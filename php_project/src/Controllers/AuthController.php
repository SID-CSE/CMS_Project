<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Session;
use App\Repositories\UserRepository;

final class AuthController extends Controller
{
    private UserRepository $users;
    private const AUTH_SPLIT_VIEW = 'auth/auth-split';

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
        $this->render(self::AUTH_SPLIT_VIEW, [
            'title' => 'Login - Contify',
            'error' => Session::get('flash_error'),
            'success' => Session::get('flash_success'),
            'activeForm' => 'login',
            'role' => 'STAKEHOLDER',
        ]);
        Session::remove('flash_error');
        Session::remove('flash_success');
    }

    public function showRoles(): void
    {
        $this->render('auth/roles', [
            'title' => 'Choose a Role - Contify',
        ]);
    }

    public function showForgotPassword(): void
    {
        $this->render(self::AUTH_SPLIT_VIEW, [
            'title' => 'Forgot Password - Contify',
            'error' => Session::get('flash_error'),
            'success' => Session::get('flash_success'),
            'activeForm' => 'forgot',
            'role' => 'STAKEHOLDER',
        ]);
        Session::remove('flash_error');
        Session::remove('flash_success');
    }

    public function submitForgotPassword(): void
    {
        $email = trim((string) ($_POST['email'] ?? ''));
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Session::set('flash_error', 'Please enter a valid email address.');
            $this->redirect('/forgot-password');
        }

        Session::set('flash_success', 'If an account exists for this email, reset instructions have been sent.');
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

        $this->render(self::AUTH_SPLIT_VIEW, [
            'title' => $role . ' Signup - Contify',
            'error' => Session::get('flash_error'),
            'success' => Session::get('flash_success'),
            'activeForm' => 'signup',
            'role' => $role,
        ]);
        Session::remove('flash_error');
        Session::remove('flash_success');
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
