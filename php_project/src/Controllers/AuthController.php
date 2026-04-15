<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Repositories\UserRepository;

final class AuthController extends Controller
{
    private UserRepository $users;

    private const DEFAULT_DASHBOARD_PATH = '/dashboard';
    private const DASHBOARD_PATHS = [
        'ADMIN' => '/admin/dashboard',
        'EDITOR' => '/editor/dashboard',
        'STAKEHOLDER' => '/stakeholder/home',
    ];

    public function __construct()
    {
        $this->users = new UserRepository();
    }

    public function showLogin(): void
    {
        $this->render('auth/login', [
            'title' => 'Login - Contify',
            'error' => Session::get('flash_error'),
        ]);
        Session::remove('flash_error');
    }

    public function showRoles(): void
    {
        $this->render('auth/roles', [
            'title' => 'Choose a Role - Contify',
        ]);
    }

    public function showForgotPassword(): void
    {
        $this->render('auth/forgot-password', [
            'title' => 'Forgot Password - Contify',
        ]);
    }

    public function submitForgotPassword(): void
    {
        Session::set('flash_error', 'Password reset instructions are not configured yet.');
        $this->redirect('/forgot-password');
    }

    public function login(): void
    {
        $email = trim((string) ($_POST['email'] ?? ''));
        $password = (string) ($_POST['password'] ?? '');

        $user = $this->users->findByEmail($email);
        if ($user === null || !password_verify($password, $user->passwordHash)) {
            Session::set('flash_error', 'Invalid credentials');
            $this->redirect('/login');
        }

        Session::regenerate();
        Session::set('auth_user', [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'role' => $user->role,
        ]);

        $this->redirect('/dashboard');
    }

    public function showSignup(?string $roleName = null): void
    {
        $role = strtoupper((string) ($roleName ?: 'STAKEHOLDER'));

        $this->render('auth/signup-role', [
            'title' => $role . ' Signup - Contify',
            'error' => Session::get('flash_error'),
            'role' => $role,
        ]);
        Session::remove('flash_error');
    }

    public function register(): void
    {
        $name = trim((string) ($_POST['name'] ?? ''));
        $email = trim((string) ($_POST['email'] ?? ''));
        $role = strtoupper(trim((string) ($_POST['role'] ?? 'STAKEHOLDER')));
        $password = (string) ($_POST['password'] ?? '');

        if ($name === '' || $email === '' || $password === '') {
            Session::set('flash_error', 'Name, email and password are required.');
            $this->redirect('/signup/' . strtolower($role));
        }

        if ($this->users->findByEmail($email) !== null) {
            Session::set('flash_error', 'Email already exists.');
            $this->redirect('/signup/' . strtolower($role));
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $user = $this->users->create($email, $name, $role, $passwordHash);

        Session::regenerate();
        Session::set('auth_user', [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'role' => $user->role,
        ]);

        $this->redirect(self::DASHBOARD_PATHS[$user->role] ?? self::DEFAULT_DASHBOARD_PATH);
    }

    public function logout(): void
    {
        Session::destroy();
        $this->redirect('/');
    }

    public function dashboardRedirect(): void
    {
        $user = Session::get('auth_user');
        if (!is_array($user) || empty($user['role'])) {
            $this->redirect('/login');
        }

        $this->redirect(self::DASHBOARD_PATHS[strtoupper((string) $user['role'])] ?? self::DEFAULT_DASHBOARD_PATH);
    }
}
