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

    public function thread(string $threadId): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $thread = $this->messages->findThreadById($threadId);

        if ($thread === null || !$this->isParticipant($threadId, (string) ($user['id'] ?? ''))) {
            http_response_code(404);
            echo 'Thread not found';
            return;
        }

        $this->messages->markThreadRead($threadId, (string) ($user['id'] ?? ''));

        $participants = $this->participantNames($thread);

        $this->render('messages/thread', [
            'title' => 'Message Thread',
            'user' => $user,
            'thread' => $thread,
            'messages' => $this->messages->findMessagesForThread($threadId),
            'contacts' => $this->messages->getUserContacts((string) ($user['id'] ?? '')),
            'participants' => $participants,
        ]);
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

        $this->redirect('/messages/' . $thread->id);
    }

    public function compose(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $contacts = $this->messages->getUserContacts((string) ($user['id'] ?? ''));
        $projects = $this->projects->findByClientId((string) ($user['id'] ?? ''));

        $this->render('messages/compose', [
            'title' => 'Compose Message',
            'user' => $user,
            'contacts' => $contacts,
            'projects' => $projects,
            'contactsLabelMap' => $this->contactLabelMap($contacts),
            'projectCount' => count($projects),
        ]);
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

    /**
     * @param array<int, array<string, mixed>> $contacts
     * @return array<string, string>
     */
    private function contactLabelMap(array $contacts): array
    {
        $labels = [];
        foreach ($contacts as $contact) {
            $email = (string) ($contact['email'] ?? '');
            if ($email === '') {
                continue;
            }

            $name = trim((string) ($contact['name'] ?? ''));
            $role = trim((string) ($contact['role'] ?? ''));
            $label = $email;
            if ($name !== '') {
                $label = $name;
                if ($role !== '') {
                    $label .= ' (' . $role . ')';
                }
            }

            $labels[$email] = $label;
        }

        return $labels;
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
}
