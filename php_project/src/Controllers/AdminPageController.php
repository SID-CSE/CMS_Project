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
use App\Repositories\UserRepository;

final class AdminPageController extends Controller
{
    private const PROFILE_BASE_PATH = '/admin/profile';
    private const FINANCE_BASE_PATH = '/admin/finance';
    private ProjectRequestRepository $projects;
    private ProjectTaskRepository $tasks;
    private TaskAttachmentRepository $attachments;
    private NotificationRepository $notifications;
    private MessageRepository $messages;
    private UserRepository $users;

    public function __construct()
    {
        $this->projects = new ProjectRequestRepository();
        $this->tasks = new ProjectTaskRepository();
        $this->attachments = new TaskAttachmentRepository();
        $this->notifications = new NotificationRepository();
        $this->messages = new MessageRepository();
        $this->users = new UserRepository();
    }

    public function dashboard(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $this->render('admin/dashboard', [
            'title' => 'Admin Dashboard',
            'user' => $user,
            'unreadNotifications' => $this->notifications->countUnreadForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'ADMIN')
            ),
            'unreadThreads' => $this->messages->countUnreadThreadsForUser((string) ($user['id'] ?? '')),
            'stats' => [
                'totalProjects' => $this->projects->countAll(),
                'requested' => $this->projects->countByStatus('REQUESTED'),
                'inProgress' => $this->projects->countByStatus('IN_PROGRESS'),
                'signedOff' => $this->projects->countByStatus('SIGNED_OFF'),
            ],
            'recentProjects' => $this->projects->findRecent(5),
        ]);
    }
    public function projects(): void
    {
        AuthMiddleware::requireAuth();
        $projects = $this->projects->findAll();
        $tasksByProject = [];
        foreach ($projects as $project) {
            $tasksByProject[$project->id] = $this->tasks->findByProjectId($project->id);
        }

        $this->render('admin/projects', [
            'title' => 'Admin Projects',
            'user' => Session::get('auth_user', []),
            'projects' => $projects,
            'tasksByProject' => $tasksByProject,
            'editors' => $this->users->findByRole('EDITOR'),
        ]);
    }
    public function users(): void
    {
        AuthMiddleware::requireAuth();
        $users = $this->users->findAll();
        $roleCounts = [
            'ADMIN' => 0,
            'EDITOR' => 0,
            'STAKEHOLDER' => 0,
        ];

        foreach ($users as $user) {
            $role = strtoupper($user->role);
            if (isset($roleCounts[$role])) {
                $roleCounts[$role]++;
            }
        }

        $this->render('admin/users', [
            'title' => 'Manage Users',
            'user' => Session::get('auth_user', []),
            'users' => $users,
            'roleCounts' => $roleCounts,
        ]);
    }
    public function messages(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $this->render('messages/index', [
            'title' => 'Admin Messages',
            'user' => $user,
            'roleLabel' => 'Admin',
            'threads' => $this->messages->findThreadsForUser((string) ($user['id'] ?? '')),
            'messages' => [],
            'contacts' => $this->messages->getUserContacts((string) ($user['id'] ?? '')),
            'projects' => $this->projects->findAll(),
            'notifications' => $this->notifications->findForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'ADMIN')
            ),
            'unreadNotifications' => $this->notifications->countUnreadForUser(
                (string) ($user['id'] ?? ''),
                (string) ($user['email'] ?? ''),
                (string) ($user['role'] ?? 'ADMIN')
            ),
            'unreadThreads' => $this->messages->countUnreadThreadsForUser((string) ($user['id'] ?? '')),
        ]);
    }

    public function projectView(string $projectId): void
    {
        AuthMiddleware::requireAuth();
        $project = $this->projects->findById($projectId);

        if ($project === null) {
            http_response_code(404);
            echo 'Project not found';
            return;
        }

        $this->render('admin/project-view', [
            'title' => 'Admin Project View',
            'user' => Session::get('auth_user', []),
            'project' => $project,
            'tasks' => $this->tasks->findByProjectId($project->id),
            'attachmentsByTask' => $this->attachmentsByTasks($project->id),
        ]);
    }

    public function content(): void
    {
        AuthMiddleware::requireAuth();
        $projects = $this->projects->findRecent(8);
        $tasksByProject = [];
        foreach ($projects as $project) {
            $tasksByProject[$project->id] = $this->tasks->findByProjectId($project->id);
        }

        $this->render('admin/content', [
            'title' => 'Admin Content',
            'user' => Session::get('auth_user', []),
            'projects' => $projects,
            'tasksByProject' => $tasksByProject,
        ]);
    }

    private function attachmentsByTasks(string $projectId): array
    {
        $attachmentsByTask = [];
        foreach ($this->tasks->findByProjectId($projectId) as $task) {
            $attachmentsByTask[$task->id] = $this->attachments->findByTaskId($task->id);
        }

        return $attachmentsByTask;
    }
    public function profile(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('profile/view', [
            'title' => 'Admin Profile',
            'user' => Session::get('auth_user', []),
            'roleLabel' => 'Admin',
            'basePath' => self::PROFILE_BASE_PATH,
            'profile' => Session::get('profile_admin', []),
            'accent' => 'blue',
            'tabs' => [
                ['to' => self::PROFILE_BASE_PATH, 'label' => 'Profile'],
                ['to' => self::PROFILE_BASE_PATH . '/edit', 'label' => 'Edit Profile'],
                ['to' => '/admin/messages', 'label' => 'Messages'],
                ['to' => self::FINANCE_BASE_PATH, 'label' => 'Finance'],
                ['to' => '/admin/dashboard', 'label' => 'Dashboard'],
            ],
        ]);
    }

    public function profileEdit(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('profile/edit', [
            'title' => 'Edit Admin Profile',
            'user' => Session::get('auth_user', []),
            'roleLabel' => 'Admin',
            'basePath' => self::PROFILE_BASE_PATH,
            'profile' => Session::get('profile_admin', []),
            'profileKey' => 'profile_admin',
            'accent' => 'blue',
            'tabs' => [
                ['to' => self::PROFILE_BASE_PATH, 'label' => 'Profile'],
                ['to' => self::PROFILE_BASE_PATH . '/edit', 'label' => 'Edit Profile'],
                ['to' => '/admin/messages', 'label' => 'Messages'],
                ['to' => self::FINANCE_BASE_PATH, 'label' => 'Finance'],
                ['to' => '/admin/dashboard', 'label' => 'Dashboard'],
            ],
        ]);
    }

    public function profileSave(): void
    {
        AuthMiddleware::requireAuth();
        Session::set('profile_admin', array_merge(Session::get('profile_admin', []), $_POST));
        $this->redirect('/admin/profile');
    }

    public function finance(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('finance/index', [
            'title' => 'Admin Finance',
            'user' => Session::get('auth_user', []),
            'roleLabel' => 'Admin',
            'basePath' => '/admin',
            'accent' => 'blue',
            'state' => Session::get('finance_admin', [
                'stats' => ['total_spent' => '₹0', 'pending' => '₹0', 'last_payment' => '₹0'],
                'transactions' => [],
                'requests' => [],
                'expenses' => [],
                'counterparties' => [],
            ]),
            'allowCreate' => true,
        ]);
    }

    public function financeSave(): void
    {
        AuthMiddleware::requireAuth();
        Session::set('finance_admin', array_merge(Session::get('finance_admin', []), $_POST));
        $this->redirect(self::FINANCE_BASE_PATH);
    }

    public function analytics(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('admin/analytics', [
            'title' => 'Admin Analytics',
            'user' => Session::get('auth_user', []),
            'stats' => [
                'totalProjects' => $this->projects->countAll(),
                'requested' => $this->projects->countByStatus('REQUESTED'),
                'planSent' => $this->projects->countByStatus('PLAN_SENT'),
                'inProgress' => $this->projects->countByStatus('IN_PROGRESS'),
                'delivered' => $this->projects->countByStatus('DELIVERED'),
                'signedOff' => $this->projects->countByStatus('SIGNED_OFF'),
            ],
            'recentProjects' => $this->projects->findRecent(6),
        ]);
    }

    public function auditLog(): void
    {
        AuthMiddleware::requireAuth();
        $recentProjects = $this->projects->findRecent(6);
        $activity = [];

        foreach ($recentProjects as $project) {
            $activity[] = [
                'label' => 'Project ' . $project->status,
                'subject' => $project->title,
                'detail' => $project->description,
                'time' => $project->updatedAt,
            ];

            foreach ($this->tasks->findByProjectId($project->id) as $task) {
                $activity[] = [
                    'label' => 'Task ' . $task->status,
                    'subject' => $task->title,
                    'detail' => $task->assigneeEmail,
                    'time' => $task->updatedAt,
                ];
            }
        }

        $this->render('admin/audit-log', [
            'title' => 'Admin Audit Log',
            'user' => Session::get('auth_user', []),
            'activity' => array_slice($activity, 0, 12),
        ]);
    }

    public function settings(): void
    {
        AuthMiddleware::requireAuth();
        $this->render('admin/settings', [
            'title' => 'Admin Settings',
            'user' => Session::get('auth_user', []),
            'settings' => Session::get('admin_settings', [
                'brand_name' => 'Contify',
                'support_email' => 'support@contify.com',
                'default_timezone' => 'Asia/Kolkata',
                'maintenance_mode' => 'off',
            ]),
        ]);
    }

    public function settingsSave(): void
    {
        AuthMiddleware::requireAuth();
        Session::set('admin_settings', array_merge(Session::get('admin_settings', []), $_POST));
        $this->redirect('/admin/settings');
    }

    public function streaming(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);
        $recentProjects = $this->projects->findRecent(5);

        $this->render('media/dashboard', [
            'title' => 'Admin Media Dashboard',
            'user' => $user,
            'roleLabel' => 'Admin',
            'projects' => $recentProjects,
            'tasks' => $this->tasksByProjects($recentProjects),
            'attachmentsByTask' => $this->attachmentsByProjects($recentProjects),
        ]);
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
}
