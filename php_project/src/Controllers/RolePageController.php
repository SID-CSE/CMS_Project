<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Middleware\AuthMiddleware;

final class RolePageController extends Controller
{
    private function user(): array
    {
        $user = Session::get('auth_user');
        return is_array($user) ? $user : [];
    }

    private function renderRolePage(string $template, string $title, array $data = []): void
    {
        AuthMiddleware::requireAuth();
        $this->render('roles/module', array_merge([
            'title' => $title,
            'user' => $this->user(),
            'pageKey' => $template,
        ], $data));
    }

    public function adminDashboard(): void
    {
        $this->renderRolePage('roles/admin-dashboard', 'Admin Dashboard');
    }

    public function adminProjects(): void
    {
        $this->renderRolePage('roles/admin-projects', 'Admin Projects');
    }

    public function adminUsers(): void
    {
        $this->renderRolePage('roles/admin-users', 'Manage Users');
    }

    public function adminMessages(): void
    {
        $this->renderRolePage('roles/admin-messages', 'Admin Messages');
    }

    public function adminProfile(): void
    {
        $this->renderRolePage('roles/admin-profile', 'Admin Profile');
    }

    public function adminProfileEdit(): void
    {
        $this->renderRolePage('roles/admin-profile-edit', 'Edit Admin Profile');
    }

    public function adminFinance(): void
    {
        $this->renderRolePage('roles/admin-finance', 'Admin Finance');
    }

    public function adminContent(): void
    {
        $this->renderRolePage('roles/admin-content', 'Admin Content');
    }

    public function adminAnalytics(): void
    {
        $this->renderRolePage('roles/admin-analytics', 'Admin Analytics');
    }

    public function adminAuditLog(): void
    {
        $this->renderRolePage('roles/admin-audit-log', 'Admin Audit Log');
    }

    public function adminSettings(): void
    {
        $this->renderRolePage('roles/admin-settings', 'Admin Settings');
    }

    public function adminStreaming(): void
    {
        $this->renderRolePage('roles/admin-streaming', 'Admin Streaming');
    }

    public function editorDashboard(): void
    {
        $this->renderRolePage('roles/editor-dashboard', 'Editor Dashboard');
    }

    public function editorProjects(): void
    {
        $this->renderRolePage('roles/editor-projects', 'Editor Projects');
    }

    public function editorContent(): void
    {
        $this->renderRolePage('roles/editor-content', 'My Content');
    }

    public function editorMessages(): void
    {
        $this->renderRolePage('roles/editor-messages', 'Editor Messages');
    }

    public function editorProfile(): void
    {
        $this->renderRolePage('roles/editor-profile', 'Editor Profile');
    }

    public function editorProfileEdit(): void
    {
        $this->renderRolePage('roles/editor-profile-edit', 'Edit Editor Profile');
    }

    public function editorFinance(): void
    {
        $this->renderRolePage('roles/editor-finance', 'Editor Finance');
    }

    public function editorStreaming(): void
    {
        $this->renderRolePage('roles/editor-streaming', 'Editor Streaming');
    }

    public function stakeholderHome(): void
    {
        $this->renderRolePage('roles/stakeholder-home', 'Stakeholder Home');
    }

    public function stakeholderProjects(): void
    {
        $this->renderRolePage('roles/stakeholder-projects', 'Stakeholder Projects');
    }

    public function stakeholderProjectView(): void
    {
        $this->renderRolePage('roles/stakeholder-project-view', 'Stakeholder Project View');
    }

    public function stakeholderContent(): void
    {
        $this->renderRolePage('roles/stakeholder-content', 'Stakeholder Content');
    }

    public function stakeholderNotifications(): void
    {
        $this->renderRolePage('roles/stakeholder-notifications', 'Stakeholder Notifications');
    }

    public function stakeholderStreaming(): void
    {
        $this->renderRolePage('roles/stakeholder-streaming', 'Stakeholder Streaming');
    }

    public function stakeholderCreateProjectRequest(): void
    {
        $this->renderRolePage('roles/stakeholder-create-request', 'Create Project Request');
    }

    public function stakeholderMessages(): void
    {
        $this->renderRolePage('roles/stakeholder-messages', 'Stakeholder Messages');
    }

    public function stakeholderProfile(): void
    {
        $this->renderRolePage('roles/stakeholder-profile', 'Stakeholder Profile');
    }

    public function stakeholderProfileEdit(): void
    {
        $this->renderRolePage('roles/stakeholder-profile-edit', 'Edit Stakeholder Profile');
    }

    public function stakeholderFinance(): void
    {
        $this->renderRolePage('roles/stakeholder-finance', 'Stakeholder Finance');
    }
}
