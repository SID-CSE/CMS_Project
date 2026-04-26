<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Middleware\AuthMiddleware;
use App\Repositories\TaskAttachmentRepository;
use App\Repositories\MessageRepository;
use App\Repositories\NotificationRepository;
use App\Repositories\ProjectRequestRepository;
use App\Repositories\ProjectTaskRepository;

final class StakeholderPageController extends Controller
{
    private const PROFILE_BASE_PATH = '/stakeholder/profile';
    private const FINANCE_BASE_PATH = '/stakeholder/finance';
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

    public function home(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);

        $projects = [];
        if (!empty($user['id'])) {
            $projects = $this->projects->findByClientId((string) $user['id']);
        }

        $this->render('stakeholder/dashboard', [
            'title' => 'Stakeholder Dashboard',
            'user' => $user,
            'unreadNotifications' => $this->notifications->countUnreadForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'STAKEHOLDER')
            ),
            'unreadThreads' => $this->messages->countUnreadThreadsForUser((string) ($user['id'] ?? '')),
            'projects' => $projects,
            'stats' => [
                'total' => count($projects),
                'requested' => count(array_filter($projects, static fn ($project): bool => $project->status === 'REQUESTED')),
                'inProgress' => count(array_filter($projects, static fn ($project): bool => $project->status === 'IN_PROGRESS')),
                'signedOff' => count(array_filter($projects, static fn ($project): bool => $project->status === 'SIGNED_OFF')),
            ],
        ]);
    }
    public function projects(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);

        $projects = [];
        if (!empty($user['id'])) {
            $projects = $this->projects->findByClientId((string) $user['id']);
        }

        $this->render('stakeholder/projects', [
            'title' => 'Stakeholder Projects',
            'user' => $user,
            'projects' => $projects,
        ]);
    }

    public function projectView(string $projectId): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $project = $this->projects->findById($projectId);

        if ($project === null || (string) ($user['id'] ?? '') !== $project->clientId) {
            http_response_code(404);
            echo 'Project not found';
            return;
        }

        $this->render('stakeholder/project-view', [
            'title' => 'Stakeholder Project View',
            'user' => $user,
            'project' => $project,
            'tasks' => $this->tasks->findByProjectId($project->id),
            'attachmentsByTask' => $this->attachmentsByTasks($project->id),
        ]);
    }
    public function content(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $projects = $this->projects->findByClientId((string) ($user['id'] ?? ''));

        $this->render('stakeholder/content', [
            'title' => 'Stakeholder Content',
            'user' => $user,
            'projects' => $projects,
            'tasksByProject' => $this->tasksByProjects($projects),
            'attachmentsByTask' => $this->attachmentsByProjects($projects),
        ]);
    }

    public function contentViewer(string $projectId): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $project = $this->projects->findById($projectId);

        if ($project === null || (string) ($user['id'] ?? '') !== $project->clientId) {
            http_response_code(404);
            echo 'Project not found';
            return;
        }

        $tasks = $this->tasks->findByProjectId($project->id);
        $attachmentsByTask = [];
        foreach ($tasks as $task) {
            $attachmentsByTask[$task->id] = $this->attachments->findByTaskId($task->id);
        }

        $this->render('stakeholder/content-viewer', [
            'title' => 'Content Viewer',
            'user' => $user,
            'project' => $project,
            'tasks' => $tasks,
            'attachmentsByTask' => $attachmentsByTask,
        ]);
    }
    public function notifications(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $projects = $this->projects->findByClientId((string) ($user['id'] ?? ''));
        $this->render('stakeholder/notifications', [
            'title' => 'Stakeholder Notifications',
            'user' => $user,
            'projects' => $projects,
            'notifications' => $this->notifications->findForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'STAKEHOLDER')
            ),
            'unreadNotifications' => $this->notifications->countUnreadForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'STAKEHOLDER')
            ),
            'unreadThreads' => $this->messages->countUnreadThreadsForUser((string) ($user['id'] ?? '')),
        ]);
    }
    public function streaming(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $projects = !empty($user['id']) ? $this->projects->findByClientId((string) $user['id']) : [];

        $this->render('media/dashboard', [
            'title' => 'Stakeholder Media Dashboard',
            'user' => $user,
            'roleLabel' => 'Stakeholder',
            'projects' => $projects,
            'tasks' => $this->tasksByProjects($projects),
            'attachmentsByTask' => $this->attachmentsByProjects($projects),
        ]);
    }
    public function createProjectRequest(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('projects/stakeholder-create-request', [
            'title' => 'Create Project Request',
        ]);
    }
    public function messages(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $this->render('messages/index', [
            'title' => 'Stakeholder Messages',
            'user' => $user,
            'roleLabel' => 'Stakeholder',
            'threads' => $this->messages->findThreadsForUser((string) ($user['id'] ?? '')),
            'messages' => [],
            'contacts' => $this->messages->getUserContacts((string) ($user['id'] ?? '')),
            'projects' => $this->projects->findByClientId((string) ($user['id'] ?? '')),
            'notifications' => $this->notifications->findForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'STAKEHOLDER')
            ),
            'unreadNotifications' => $this->notifications->countUnreadForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'STAKEHOLDER')
            ),
            'unreadThreads' => $this->messages->countUnreadThreadsForUser((string) ($user['id'] ?? '')),
        ]);
    }
    public function profile(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('profile/view', [
            'title' => 'Stakeholder Profile',
            'user' => Session::get('auth_user', []),
            'roleLabel' => 'Stakeholder',
            'basePath' => self::PROFILE_BASE_PATH,
            'profile' => Session::get('profile_stakeholder', []),
            'accent' => 'violet',
            'tabs' => [
                ['to' => self::PROFILE_BASE_PATH, 'label' => 'Profile'],
                ['to' => self::PROFILE_BASE_PATH . '/edit', 'label' => 'Edit Profile'],
                ['to' => '/stakeholder/messages', 'label' => 'Messages'],
                ['to' => self::FINANCE_BASE_PATH, 'label' => 'Finance'],
                ['to' => '/stakeholder/dashboard', 'label' => 'Dashboard'],
            ],
        ]);
    }
    public function profileEdit(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('profile/edit', [
            'title' => 'Edit Stakeholder Profile',
            'user' => Session::get('auth_user', []),
            'roleLabel' => 'Stakeholder',
            'basePath' => self::PROFILE_BASE_PATH,
            'profile' => Session::get('profile_stakeholder', []),
            'profileKey' => 'profile_stakeholder',
            'accent' => 'violet',
            'tabs' => [
                ['to' => self::PROFILE_BASE_PATH, 'label' => 'Profile'],
                ['to' => self::PROFILE_BASE_PATH . '/edit', 'label' => 'Edit Profile'],
                ['to' => '/stakeholder/messages', 'label' => 'Messages'],
                ['to' => self::FINANCE_BASE_PATH, 'label' => 'Finance'],
                ['to' => '/stakeholder/dashboard', 'label' => 'Dashboard'],
            ],
        ]);
    }
    public function profileSave(): void
    {
        AuthMiddleware::requireAuth();
        Session::set('profile_stakeholder', array_merge(Session::get('profile_stakeholder', []), $_POST));
        $this->redirect(self::PROFILE_BASE_PATH);
    }
    public function finance(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('finance/index', [
            'title' => 'Stakeholder Finance',
            'user' => Session::get('auth_user', []),
            'roleLabel' => 'Stakeholder',
            'basePath' => '/stakeholder',
            'accent' => 'violet',
            'state' => Session::get('finance_stakeholder', [
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
        Session::set('finance_stakeholder', array_merge(Session::get('finance_stakeholder', []), $_POST));
        $this->redirect(self::FINANCE_BASE_PATH);
    }

    /**
     * @param array<int, \App\Models\ProjectRequest> $projects
     * @return array<string, array<int, \App\Models\ProjectTask>>
     */
    private function tasksByProjects(array $projects): array
    {
        $tasksByProject = [];
        foreach ($projects as $project) {
            $tasksByProject[$project->id] = $this->tasks->findByProjectId($project->id);
        }

        return $tasksByProject;
    }

    /**
     * @param array<int, \App\Models\ProjectRequest> $projects
     * @return array<string, array<int, \App\Models\TaskAttachment>>
     */
    private function attachmentsByProjects(array $projects): array
    {
        $attachmentsByTask = [];
        foreach ($projects as $project) {
            foreach ($this->tasks->findByProjectId($project->id) as $task) {
                $attachmentsByTask[$task->id] = $this->attachments->findByTaskId($task->id);
            }
        }

        return $attachmentsByTask;
    }

    private function attachmentsByTasks(string $projectId): array
    {
        $attachmentsByTask = [];
        foreach ($this->tasks->findByProjectId($projectId) as $task) {
            $attachmentsByTask[$task->id] = $this->attachments->findByTaskId($task->id);
        }

        return $attachmentsByTask;
    }
}

