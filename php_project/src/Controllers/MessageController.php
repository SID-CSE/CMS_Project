<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Middleware\AuthMiddleware;
use App\Models\MessageThread;
use App\Repositories\MessageRepository;
use App\Repositories\NotificationRepository;
use App\Repositories\ProjectRequestRepository;
use App\Repositories\UserRepository;

final class MessageController extends Controller
{
    private MessageRepository $messages;
    private UserRepository $users;
    private ProjectRequestRepository $projects;
    private NotificationRepository $notifications;

    public function __construct()
    {
        $this->messages = new MessageRepository();
        $this->users = new UserRepository();
        $this->projects = new ProjectRequestRepository();
        $this->notifications = new NotificationRepository();
    }

    public function index(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $inbox = $this->buildInboxState($user, true);

        $flashError = Session::get('flash_error');
        $flashSuccess = Session::get('flash_success');
        Session::remove('flash_error');
        Session::remove('flash_success');

        $selectedRecipientEmail = trim((string) ($_GET['recipient_email'] ?? ''));

        $this->render('messages/index', [
            'title' => $inbox['roleLabel'] . ' Messages',
            'user' => $user,
            'roleLabel' => $inbox['roleLabel'],
            'threads' => $inbox['threads'],
            'contacts' => $inbox['contacts'],
            'projects' => $inbox['projects'],
            'selectedThread' => $inbox['selectedThread'],
            'selectedThreadId' => $inbox['selectedThreadId'],
            'selectedMessages' => $inbox['selectedMessages'],
            'selectedCounterpart' => $inbox['selectedCounterpart'],
            'composeMode' => $inbox['composeMode'],
            'selectedRecipientEmail' => $selectedRecipientEmail,
            'flashError' => is_string($flashError) ? $flashError : null,
            'flashSuccess' => is_string($flashSuccess) ? $flashSuccess : null,
            'unreadThreads' => $inbox['unreadThreads'],
            'pollUrl' => $this->messagesPathForRole((string) ($user['role'] ?? '')) . '/poll',
            'stateFingerprint' => $inbox['stateFingerprint'],
        ]);
    }

    public function poll(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $inbox = $this->buildInboxState($user, false);

        $this->json([
            'ok' => true,
            'fingerprint' => $inbox['stateFingerprint'],
            'selectedThreadId' => $inbox['selectedThreadId'],
            'unreadThreads' => $inbox['unreadThreads'],
        ]);
    }

    public function thread(string $threadId): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $this->redirect($this->messagesPathForRole((string) ($user['role'] ?? '')) . '?thread=' . urlencode($threadId));
    }

    public function send(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $senderId = (string) ($user['id'] ?? '');
        $recipientEmail = strtolower(trim((string) ($_POST['recipient_email'] ?? '')));
        $subject = trim((string) ($_POST['subject'] ?? ''));
        $body = trim((string) ($_POST['body'] ?? ''));
        $projectId = trim((string) ($_POST['project_id'] ?? ''));
        $threadId = trim((string) ($_POST['thread_id'] ?? ''));

        if ($body === '') {
            Session::set('flash_error', 'Message body is required.');
            $this->redirect($this->messagesPathForRole((string) ($user['role'] ?? '')));
        }

        [$thread, $recipient] = $this->resolveThreadAndRecipient(
            $senderId,
            $threadId,
            $recipientEmail,
            $subject,
            $projectId,
            (string) ($user['role'] ?? '')
        );

        $this->messages->sendMessage($thread->id, $senderId, $body);
        $this->notifications->create(
            userId: $recipient->id,
            recipientEmail: $recipient->email,
            recipientRole: $recipient->role,
            title: 'New Message',
            body: 'You received a new message from ' . ($user['name'] ?? $user['email'] ?? 'a user') . '.',
            level: 'INFO',
            projectId: $projectId !== '' ? $projectId : null
        );

        Session::set('flash_success', 'Message sent.');
        $this->redirect($this->messagesPathForRole((string) ($user['role'] ?? '')) . '?thread=' . urlencode($thread->id));
    }

    public function compose(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $query = '?compose=1';
        $recipientEmail = trim((string) ($_GET['recipient_email'] ?? ''));
        if ($recipientEmail !== '') {
            $query .= '&recipient_email=' . urlencode($recipientEmail);
        }
        $this->redirect($this->messagesPathForRole((string) ($user['role'] ?? '')) . $query);
    }

    private function isParticipant(string $threadId, string $userId): bool
    {
        $thread = $this->messages->findThreadById($threadId);
        if ($thread === null) {
            return false;
        }

        return $thread->participantAId === $userId || $thread->participantBId === $userId;
    }

    /**
     * @return array{0:\App\Models\MessageThread,1:\App\Models\User}
     */
    private function resolveThreadAndRecipient(
        string $senderId,
        string $threadId,
        string $recipientEmail,
        string $subject,
        string $projectId,
        string $role
    ): array {
        if ($threadId !== '') {
            $thread = $this->messages->findThreadById($threadId);
            if ($thread === null || !$this->ownsThread($thread, $senderId)) {
                Session::set('flash_error', 'Thread not found.');
                $this->redirect($this->messagesPathForRole($role));
            }

            $recipientId = $thread->participantAId === $senderId ? $thread->participantBId : $thread->participantAId;
            $recipient = $this->users->findById($recipientId);
            if ($recipient === null) {
                Session::set('flash_error', 'Recipient not found.');
                $this->redirect($this->messagesPathForRole($role));
            }

            return [$thread, $recipient];
        }

        if ($recipientEmail === '') {
            Session::set('flash_error', 'Recipient is required.');
            $this->redirect($this->messagesPathForRole($role));
        }

        $recipient = $this->users->findByEmail($recipientEmail);
        if ($recipient === null) {
            Session::set('flash_error', 'Recipient not found.');
            $this->redirect($this->messagesPathForRole($role));
        }

        $thread = $this->messages->createThread(
            $senderId,
            $recipient->id,
            $subject !== '' ? $subject : null,
            $projectId !== '' ? $projectId : null
        );

        return [$thread, $recipient];
    }

    private function ownsThread(\App\Models\MessageThread $thread, string $userId): bool
    {
        return $thread->participantAId === $userId || $thread->participantBId === $userId;
    }

    private function messagesPathForRole(string $role): string
    {
        return match (strtoupper($role)) {
            'ADMIN' => '/admin/messages',
            'EDITOR' => '/editor/messages',
            default => '/stakeholder/messages',
        };
    }

    private function threadPathForRole(string $role, string $threadId): string
    {
        return match (strtoupper($role)) {
            'ADMIN' => '/admin/messages/' . $threadId,
            'EDITOR' => '/editor/messages/' . $threadId,
            default => '/stakeholder/messages/' . $threadId,
        };
    }

    /**
     * @param array<string,mixed> $user
     * @return array{
     *   roleLabel:string,
     *   contacts:array<int,array<string,mixed>>,
     *   projects:array<int,\App\Models\ProjectRequest>,
     *   threads:array<int,array<string,mixed>>,
     *   selectedThread:\App\Models\MessageThread|null,
     *   selectedThreadId:string,
     *   selectedMessages:array<int,\App\Models\Message>,
     *   selectedCounterpart:array{id:string,name:string,email:string,role:string}|null,
     *   composeMode:bool,
     *   unreadThreads:int,
     *   stateFingerprint:string
     * }
     */
    private function buildInboxState(array $user, bool $markRead): array
    {
        $userId = (string) ($user['id'] ?? '');
        $role = (string) ($user['role'] ?? 'STAKEHOLDER');
        $roleLabel = ucfirst(strtolower($role));
        $contacts = $this->messages->getUserContacts($userId);
        $projects = $this->projectsForUser($user);
        $threads = $this->messages->findThreadsForUser($userId);
        $threadSummaries = $this->buildThreadSummaries($threads, $userId);

        $selectedThreadId = trim((string) ($_GET['thread'] ?? ''));
        if ($selectedThreadId === '' && $threadSummaries !== []) {
            $selectedThreadId = (string) ($threadSummaries[0]['id'] ?? '');
        }

        $selectedThread = $selectedThreadId !== '' ? $this->messages->findThreadById($selectedThreadId) : null;
        if ($selectedThread !== null && $this->isParticipant($selectedThread->id, $userId)) {
            if ($markRead) {
                $this->messages->markThreadRead($selectedThread->id, $userId);
                $selectedThread = $this->messages->findThreadById($selectedThread->id);
            }
        } else {
            $selectedThread = null;
            $selectedThreadId = '';
        }

        $selectedMessages = $selectedThread !== null ? $this->messages->findMessagesForThread($selectedThread->id) : [];
        $participants = $selectedThread !== null ? $this->participantNames($selectedThread) : ['a' => null, 'b' => null];
        $selectedCounterpart = $selectedThread !== null ? $this->counterpartForUser($selectedThread, $userId, $participants) : null;
        $composeMode = isset($_GET['compose']) || $selectedThread === null;
        $unreadThreads = $this->messages->countUnreadThreadsForUser($userId);

        $fingerprintData = [
            'threads' => array_map(static function (array $thread): array {
                return [
                    'id' => (string) ($thread['id'] ?? ''),
                    'lastMessageAt' => (string) ($thread['lastMessageAt'] ?? ''),
                    'lastMessageBody' => (string) ($thread['lastMessageBody'] ?? ''),
                    'unreadCount' => (int) ($thread['unreadCount'] ?? 0),
                ];
            }, $threadSummaries),
            'selectedThreadId' => $selectedThreadId,
            'selectedMessages' => array_map(static fn (\App\Models\Message $message): array => [
                'id' => $message->id,
                'updatedAt' => $message->updatedAt,
            ], $selectedMessages),
            'composeMode' => $composeMode,
            'unreadThreads' => $unreadThreads,
        ];

        return [
            'roleLabel' => $roleLabel,
            'contacts' => $contacts,
            'projects' => $projects,
            'threads' => $threadSummaries,
            'selectedThread' => $selectedThread,
            'selectedThreadId' => $selectedThreadId,
            'selectedMessages' => $selectedMessages,
            'selectedCounterpart' => $selectedCounterpart,
            'composeMode' => $composeMode,
            'unreadThreads' => $unreadThreads,
            'stateFingerprint' => md5((string) json_encode($fingerprintData, JSON_UNESCAPED_UNICODE)),
        ];
    }

    /**
     * @param array<string,mixed> $user
     * @return array<int,\App\Models\ProjectRequest>
     */
    private function projectsForUser(array $user): array
    {
        $role = strtoupper((string) ($user['role'] ?? ''));
        if ($role === 'STAKEHOLDER') {
            return $this->projects->findByClientId((string) ($user['id'] ?? ''));
        }

        return $this->projects->findRecent(20);
    }

    /**
     * @param array<int,\App\Models\MessageThread> $threads
     * @return array<int,array<string,mixed>>
     */
    private function buildThreadSummaries(array $threads, string $currentUserId): array
    {
        $summaries = [];
        foreach ($threads as $thread) {
            $participants = $this->participantNames($thread);
            $counterpart = $this->counterpartForUser($thread, $currentUserId, $participants);
            $projectTitle = null;
            if ($thread->projectId !== null && $thread->projectId !== '') {
                $project = $this->projects->findById($thread->projectId);
                $projectTitle = $project?->title ?? $thread->projectId;
            }

            $summaries[] = [
                'id' => $thread->id,
                'subject' => $thread->subject,
                'projectId' => $thread->projectId,
                'projectTitle' => $projectTitle,
                'lastMessageBody' => $thread->lastMessageBody,
                'lastMessageAt' => $thread->lastMessageAt,
                'unreadCount' => $thread->unreadCount,
                'counterpart' => $counterpart,
            ];
        }

        return $summaries;
    }

    /**
     * @return array{a:?array{id:string,name:string,email:string,role:string},b:?array{id:string,name:string,email:string,role:string}}
     */
    private function participantNames(MessageThread $thread): array
    {
        $a = $this->users->findById($thread->participantAId);
        $b = $this->users->findById($thread->participantBId);

        return [
            'a' => $a !== null ? ['id' => $a->id, 'name' => $a->name, 'email' => $a->email, 'role' => $a->role] : null,
            'b' => $b !== null ? ['id' => $b->id, 'name' => $b->name, 'email' => $b->email, 'role' => $b->role] : null,
        ];
    }

    /**
     * @param array{a:?array{id:string,name:string,email:string,role:string},b:?array{id:string,name:string,email:string,role:string}} $participants
     * @return array{id:string,name:string,email:string,role:string}|null
     */
    private function counterpartForUser(MessageThread $thread, string $userId, array $participants): ?array
    {
        if ($thread->participantAId === $userId) {
            return $participants['b'];
        }

        if ($thread->participantBId === $userId) {
            return $participants['a'];
        }

        return null;
    }
}
