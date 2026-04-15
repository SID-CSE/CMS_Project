<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Middleware\AuthMiddleware;
use App\Repositories\NotificationRepository;

final class NotificationController extends Controller
{
    private NotificationRepository $notifications;

    public function __construct()
    {
        $this->notifications = new NotificationRepository();
    }

    public function markRead(string $notificationId): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);

        $this->notifications->markReadForRecipient(
            $notificationId,
            (string) ($user['id'] ?? ''),
            (string) ($user['email'] ?? ''),
            (string) ($user['role'] ?? '')
        );

        $this->redirect($this->messagesPathForRole((string) ($user['role'] ?? '')));
    }

    public function markAllRead(): void
    {
        AuthMiddleware::requireAuth();
        $user = Session::get('auth_user', []);

        $this->notifications->markAllReadForUser(
            (string) ($user['id'] ?? ''),
            (string) ($user['email'] ?? ''),
            (string) ($user['role'] ?? '')
        );

        $this->redirect($this->messagesPathForRole((string) ($user['role'] ?? '')));
    }

    private function messagesPathForRole(string $role): string
    {
        return match (strtoupper($role)) {
            'ADMIN' => '/admin/messages',
            'EDITOR' => '/editor/messages',
            default => '/stakeholder/messages',
        };
    }
}

