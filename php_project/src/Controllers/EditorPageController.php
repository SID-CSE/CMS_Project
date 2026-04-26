<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Middleware\AuthMiddleware;
use App\Models\ProjectTask;
use App\Repositories\TaskAttachmentRepository;
use App\Repositories\MessageRepository;
use App\Repositories\NotificationRepository;
use App\Repositories\ProjectRequestRepository;
use App\Repositories\ProjectTaskRepository;

final class EditorPageController extends Controller
{
    private const PROFILE_BASE_PATH = '/editor/profile';
    private const FINANCE_BASE_PATH = '/editor/finance';
    private ProjectRequestRepository $projects;
    private ProjectTaskRepository $tasks;
    private TaskAttachmentRepository $attachments;
    private NotificationRepository $notifications;
    private MessageRepository $messages;

    public function __construct()
    {
        $this->projects = new ProjectRequestRepository();
        $this->tasks = new ProjectTaskRepository();
        $this->attachments = new TaskAttachmentRepository();
        $this->notifications = new NotificationRepository();
        $this->messages = new MessageRepository();
    }

    public function dashboard(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $this->render('editor/dashboard', [
            'title' => 'Editor Dashboard',
            'user' => $user,
            'unreadNotifications' => $this->notifications->countUnreadForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'EDITOR')
            ),
            'unreadThreads' => $this->messages->countUnreadThreadsForUser((string) ($user['id'] ?? '')),
            'stats' => [
                'openProjects' => $this->projects->countByStatus('REQUESTED'),
                'inProgress' => $this->projects->countByStatus('IN_PROGRESS'),
                'delivered' => $this->projects->countByStatus('DELIVERED'),
                'signedOff' => $this->projects->countByStatus('SIGNED_OFF'),
            ],
            'recentProjects' => $this->projects->findRecent(5),
        ]);
    }

    public function content(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $email = strtolower((string) ($user['email'] ?? ''));
        $assignedTasks = $email !== '' ? $this->tasks->findByAssigneeEmail($email) : [];
        $attachmentsByTask = [];

        foreach ($assignedTasks as $task) {
            $attachmentsByTask[$task->id] = $this->attachments->findByTaskId($task->id);
        }

        $this->render('editor/content', [
            'title' => 'My Content',
            'user' => $user,
            'projects' => $this->projects->findRecent(10),
            'assignedTasks' => $assignedTasks,
            'attachmentsByTask' => $attachmentsByTask,
            'unreadNotifications' => $this->notifications->countUnreadForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'EDITOR')
            ),
            'unreadThreads' => $this->messages->countUnreadThreadsForUser((string) ($user['id'] ?? '')),
        ]);
    }

    public function projectContent(string $projectId): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $project = $this->projects->findById($projectId);

        if ($project === null) {
            http_response_code(404);
            echo 'Project not found';
            return;
        }

        $tasks = $this->tasks->findByProjectId($projectId);
        $attachmentsByTask = [];
        foreach ($tasks as $task) {
            $attachmentsByTask[$task->id] = $this->attachments->findByTaskId($task->id);
        }

        $this->render('editor/project-content', [
            'title' => 'Project Content',
            'user' => $user,
            'project' => $project,
            'tasks' => $tasks,
            'attachmentsByTask' => $attachmentsByTask,
        ]);
    }

    public function contentViewer(string $contentId): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $task = $this->tasks->findById($contentId);

        if ($task === null) {
            http_response_code(404);
            echo 'Content not found';
            return;
        }

        $project = $this->projects->findById($task->projectId);

        $this->render('editor/content-viewer', [
            'title' => 'Content Viewer',
            'user' => $user,
            'project' => $project,
            'task' => $task,
            'attachments' => $this->attachments->findByTaskId($task->id),
            'timeline' => $this->buildTaskTimeline($task),
        ]);
    }

    public function versionHistory(string $contentId): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $task = $this->tasks->findById($contentId);

        if ($task === null) {
            http_response_code(404);
            echo 'Content not found';
            return;
        }

        $project = $this->projects->findById($task->projectId);
        $attachments = $this->attachments->findByTaskId($task->id);

        $this->render('editor/version-history', [
            'title' => 'Version History',
            'user' => $user,
            'project' => $project,
            'task' => $task,
            'attachments' => $attachments,
            'timeline' => $this->buildTaskTimeline($task),
        ]);
    }

    public function notifications(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $notifications = $this->notifications->findForUser(
            (string) ($user['id'] ?? ''),
            (string) ($user['email'] ?? ''),
            (string) ($user['role'] ?? 'EDITOR')
        );

        $this->render('editor/notifications', [
            'title' => 'Editor Notifications',
            'user' => $user,
            'notifications' => $notifications,
            'unreadNotifications' => $this->notifications->countUnreadForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'EDITOR')
            ),
            'unreadThreads' => $this->messages->countUnreadThreadsForUser((string) ($user['id'] ?? '')),
            'projects' => $this->projects->findRecent(8),
        ]);
    }

    /**
     * @return array<int, array{label:string,value:string,kind:string}>
     */
    private function buildTaskTimeline(ProjectTask $task): array
    {
        $timeline = [
            ['label' => 'Assigned', 'value' => $task->createdAt, 'kind' => 'neutral'],
        ];

        if ($task->submittedAt !== null) {
            $timeline[] = ['label' => 'Submitted', 'value' => $task->submittedAt, 'kind' => 'info'];
        }

        if ($task->reviewedAt !== null) {
            $timeline[] = [
                'label' => $task->status === ProjectTask::STATUS_APPROVED ? 'Approved' : 'Reviewed',
                'value' => $task->reviewedAt,
                'kind' => $task->status === ProjectTask::STATUS_APPROVED ? 'success' : 'warning',
            ];
        }

        return $timeline;
    }
    public function messages(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $this->render('messages/index', [
            'title' => 'Editor Messages',
            'user' => $user,
            'roleLabel' => 'Editor',
            'threads' => $this->messages->findThreadsForUser((string) ($user['id'] ?? '')),
            'messages' => [],
            'contacts' => $this->messages->getUserContacts((string) ($user['id'] ?? '')),
            'projects' => $this->projects->findRecent(12),
            'notifications' => $this->notifications->findForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'EDITOR')
            ),
            'unreadNotifications' => $this->notifications->countUnreadForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'EDITOR')
            ),
            'unreadThreads' => $this->messages->countUnreadThreadsForUser((string) ($user['id'] ?? '')),
        ]);
    }
    public function profile(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('profile/view', [
            'title' => 'Editor Profile',
            'user' => Session::get('auth_user', []),
            'roleLabel' => 'Editor',
            'basePath' => self::PROFILE_BASE_PATH,
            'profile' => Session::get('profile_editor', []),
            'accent' => 'emerald',
            'tabs' => [
                ['to' => self::PROFILE_BASE_PATH, 'label' => 'Profile'],
                ['to' => self::PROFILE_BASE_PATH . '/edit', 'label' => 'Edit Profile'],
                ['to' => '/editor/messages', 'label' => 'Messages'],
                ['to' => self::FINANCE_BASE_PATH, 'label' => 'Finance'],
                ['to' => '/editor/dashboard', 'label' => 'Dashboard'],
            ],
        ]);
    }
    public function profileEdit(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('profile/edit', [
            'title' => 'Edit Editor Profile',
            'user' => Session::get('auth_user', []),
            'roleLabel' => 'Editor',
            'basePath' => self::PROFILE_BASE_PATH,
            'profile' => Session::get('profile_editor', []),
            'profileKey' => 'profile_editor',
            'accent' => 'emerald',
            'tabs' => [
                ['to' => self::PROFILE_BASE_PATH, 'label' => 'Profile'],
                ['to' => self::PROFILE_BASE_PATH . '/edit', 'label' => 'Edit Profile'],
                ['to' => '/editor/messages', 'label' => 'Messages'],
                ['to' => self::FINANCE_BASE_PATH, 'label' => 'Finance'],
                ['to' => '/editor/dashboard', 'label' => 'Dashboard'],
            ],
        ]);
    }
    public function profileSave(): void
    {
        AuthMiddleware::requireAuth();
        Session::set('profile_editor', array_merge(Session::get('profile_editor', []), $_POST));
        $this->redirect(self::PROFILE_BASE_PATH);
    }
    public function finance(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('finance/index', [
            'title' => 'Editor Finance',
            'user' => Session::get('auth_user', []),
            'roleLabel' => 'Editor',
            'basePath' => '/editor',
            'accent' => 'emerald',
            'state' => Session::get('finance_editor', [
                'stats' => ['total_spent' => '₹0', 'pending' => '₹0', 'last_payment' => '₹0'],
                'transactions' => [],
                'requests' => [],
                'expenses' => [],
                'counterparties' => [],
            ]),
            'allowCreate' => false,
        ]);
    }
    public function financeSave(): void
    {
        AuthMiddleware::requireAuth();
        Session::set('finance_editor', array_merge(Session::get('finance_editor', []), $_POST));
        $this->redirect(self::FINANCE_BASE_PATH);
    }
    public function streaming(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $email = strtolower((string) ($user['email'] ?? ''));
        $assignedTasks = $email !== '' ? $this->tasks->findByAssigneeEmail($email) : [];
        $recentProjects = $this->projects->findRecent(6);

        $tasksByProject = [];
        foreach ($recentProjects as $project) {
            $tasksByProject[$project->id] = $this->tasks->findByProjectId($project->id);
        }

        $this->render('media/dashboard', [
            'title' => 'Editor Media Dashboard',
            'user' => $user,
            'roleLabel' => 'Editor',
            'projects' => $recentProjects,
            'tasks' => $tasksByProject,
            'attachmentsByTask' => $this->attachmentsByTaskMap($assignedTasks),
        ]);
    }
    public function projects(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $email = strtolower((string) ($user['email'] ?? ''));
        $assignedTasks = $email !== '' ? $this->tasks->findByAssigneeEmail($email) : [];
        $attachmentsByTask = [];
        foreach ($assignedTasks as $task) {
            $attachmentsByTask[$task->id] = $this->attachments->findByTaskId($task->id);
        }

        $this->render('editor/projects', [
            'title' => 'Editor Projects',
            'user' => $user,
            'projects' => $this->projects->findRecent(12),
            'assignedTasks' => $assignedTasks,
            'attachmentsByTask' => $attachmentsByTask,
            'cloudinary' => [
                'cloudName' => trim((string) getenv('CLOUDINARY_CLOUD_NAME')),
                'uploadPreset' => trim((string) getenv('CLOUDINARY_UPLOAD_PRESET')),
                'uploadFolder' => trim((string) getenv('CLOUDINARY_UPLOAD_FOLDER')) ?: 'Contify_PHP',
            ],
        ]);
    }

    /**
     * @param array<int, \App\Models\ProjectTask> $tasks
     * @return array<string, array<int, \App\Models\TaskAttachment>>
     */
    private function attachmentsByTaskMap(array $tasks): array
    {
        $attachmentsByTask = [];
        foreach ($tasks as $task) {
            $attachmentsByTask[$task->id] = $this->attachments->findByTaskId($task->id);
        }

        return $attachmentsByTask;
    }
}
