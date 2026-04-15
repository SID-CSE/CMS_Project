<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\Session;

final class AuthMiddleware
{
    public static function requireAuth(): void
    {
        $user = Session::get('auth_user');
        if ($user === null) {
            header('Location: /login');
            exit;
        }
    }
}
