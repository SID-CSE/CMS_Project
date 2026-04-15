<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\HomeController;
use App\Controllers\ProjectController;
use App\Controllers\AdminPageController;
use App\Controllers\EditorPageController;
use App\Controllers\NotificationController;
use App\Controllers\MessageController;
use App\Controllers\StakeholderPageController;
use App\Controllers\TaskWorkflowController;
use App\Core\Router;
use App\Core\Session;

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../src/';

    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }

    $relativeClass = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (is_file($file)) {
        require_once $file;
    }
});

Session::start();

$router = new Router();

$router->get('/', [HomeController::class, 'index']);

$router->get('/login', [AuthController::class, 'showLogin']);
$router->post('/login', [AuthController::class, 'login']);
$router->get('/roles', [AuthController::class, 'showRoles']);
$router->get('/signup', [AuthController::class, 'showRoles']);
$router->get('/signup/{roleName}', [AuthController::class, 'showSignup']);
$router->post('/signup', [AuthController::class, 'register']);
$router->get('/forgot-password', [AuthController::class, 'showForgotPassword']);
$router->post('/forgot-password', [AuthController::class, 'submitForgotPassword']);
$router->post('/logout', [AuthController::class, 'logout']);
$router->get('/dashboard', [AuthController::class, 'dashboardRedirect']);
$router->get('/role-dashboard', [AuthController::class, 'dashboardRedirect']);
$router->get('/editor-home', [AuthController::class, 'dashboardRedirect']);

$router->get('/editor', static function (): void {
    header('Location: /editor/dashboard');
    exit;
});

$router->get('/admin', static function (): void {
    header('Location: /admin/dashboard');
    exit;
});

$router->get('/stakeholder', static function (): void {
    header('Location: /stakeholder/home');
    exit;
});

$router->get('/projects/create', [ProjectController::class, 'createForm']);
$router->post('/projects', [ProjectController::class, 'create']);
$router->get('/projects/{projectId}', [ProjectController::class, 'show']);
$router->get('/projects/{projectId}/content', [EditorPageController::class, 'projectContent']);

$router->post('/projects/{projectId}/accept', [ProjectController::class, 'acceptPlan']);
$router->post('/projects/{projectId}/feedback', [ProjectController::class, 'requestChanges']);
$router->post('/projects/{projectId}/signoff', [TaskWorkflowController::class, 'stakeholderSignOff']);

$router->get('/api/projects/stakeholder', [ProjectController::class, 'apiList']);
$router->post('/api/projects/request', [ProjectController::class, 'apiCreate']);
$router->get('/api/projects/client', [ProjectController::class, 'apiList']);
$router->get('/api/projects/{projectId}', [ProjectController::class, 'apiShow']);

$router->post('/notifications/{notificationId}/read', [NotificationController::class, 'markRead']);
$router->post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
$router->get('/notifications', [EditorPageController::class, 'notifications']);
$router->get('/messages/compose', [MessageController::class, 'compose']);
$router->post('/messages/send', [MessageController::class, 'send']);
$router->get('/messages/{threadId}', [MessageController::class, 'thread']);

$router->get('/admin/dashboard', [AdminPageController::class, 'dashboard']);
$router->get('/admin/projects', [AdminPageController::class, 'projects']);
$router->get('/admin/projects/{projectId}', [AdminPageController::class, 'projectView']);
$router->post('/admin/projects/{projectId}/plan/send', [TaskWorkflowController::class, 'sendPlan']);
$router->post('/admin/projects/{projectId}/tasks', [TaskWorkflowController::class, 'assignTask']);
$router->post('/admin/tasks/{taskId}/approve', [TaskWorkflowController::class, 'approveTask']);
$router->post('/admin/tasks/{taskId}/revision', [TaskWorkflowController::class, 'requestTaskRevision']);
$router->get('/admin/users', [AdminPageController::class, 'users']);
$router->get('/admin/messages', [AdminPageController::class, 'messages']);
$router->get('/admin/profile', [AdminPageController::class, 'profile']);
$router->get('/admin/profile/edit', [AdminPageController::class, 'profileEdit']);
$router->post('/admin/profile/save', [AdminPageController::class, 'profileSave']);
$router->get('/admin/finance', [AdminPageController::class, 'finance']);
$router->post('/admin/finance/save', [AdminPageController::class, 'financeSave']);
$router->get('/admin/content', [AdminPageController::class, 'content']);
$router->get('/admin/analytics', [AdminPageController::class, 'analytics']);
$router->get('/admin/audit-log', [AdminPageController::class, 'auditLog']);
$router->get('/admin/settings', [AdminPageController::class, 'settings']);
$router->post('/admin/settings/save', [AdminPageController::class, 'settingsSave']);
$router->get('/admin/streaming', [AdminPageController::class, 'streaming']);
$router->get('/admin/media', [AdminPageController::class, 'streaming']);

$router->get('/editor/dashboard', [EditorPageController::class, 'dashboard']);
$router->get('/editor/content', [EditorPageController::class, 'content']);
$router->get('/editor/media', [EditorPageController::class, 'streaming']);
$router->get('/content/{contentId}/view', [EditorPageController::class, 'contentViewer']);
$router->get('/content/{contentId}/versions', [EditorPageController::class, 'versionHistory']);
$router->get('/editor/messages', [EditorPageController::class, 'messages']);
$router->get('/editor/profile', [EditorPageController::class, 'profile']);
$router->get('/editor/profile/edit', [EditorPageController::class, 'profileEdit']);
$router->post('/editor/profile/save', [EditorPageController::class, 'profileSave']);
$router->get('/editor/finance', [EditorPageController::class, 'finance']);
$router->post('/editor/finance/save', [EditorPageController::class, 'financeSave']);
$router->get('/editor/streaming', [EditorPageController::class, 'streaming']);
$router->get('/projects', [EditorPageController::class, 'projects']);
$router->post('/editor/tasks/{taskId}/submit', [TaskWorkflowController::class, 'submitTask']);

$router->get('/stakeholder/home', [StakeholderPageController::class, 'home']);
$router->get('/stakeholder/projects', [StakeholderPageController::class, 'projects']);
$router->get('/stakeholder/projects/{projectId}', [StakeholderPageController::class, 'projectView']);
$router->get('/stakeholder/content', [StakeholderPageController::class, 'content']);
$router->get('/stakeholder/media', [StakeholderPageController::class, 'streaming']);
$router->get('/stakeholder/content/{projectId}', [StakeholderPageController::class, 'contentViewer']);
$router->get('/stakeholder/notifications', [StakeholderPageController::class, 'notifications']);
$router->get('/stakeholder/streaming', [StakeholderPageController::class, 'streaming']);
$router->get('/stakeholder/create-project-request', [StakeholderPageController::class, 'createProjectRequest']);
$router->get('/stakeholder/create-request', static function (): void {
    header('Location: /stakeholder/create-project-request');
    exit;
});
$router->get('/stakeholder/messages', [StakeholderPageController::class, 'messages']);
$router->get('/stakeholder/profile', [StakeholderPageController::class, 'profile']);
$router->get('/stakeholder/profile/edit', [StakeholderPageController::class, 'profileEdit']);
$router->post('/stakeholder/profile/save', [StakeholderPageController::class, 'profileSave']);
$router->get('/stakeholder/finance', [StakeholderPageController::class, 'finance']);
$router->post('/stakeholder/finance/save', [StakeholderPageController::class, 'financeSave']);

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
