<?php
/** @var array<string,mixed> $user */

use App\Core\Session;

$userData = is_array($user ?? null) ? $user : [];
$role = strtoupper((string) ($userData['role'] ?? ''));
$profileKey = match ($role) {
    'ADMIN' => 'profile_admin',
    'EDITOR' => 'profile_editor',
    'STAKEHOLDER' => 'profile_stakeholder',
    default => '',
};

$profileData = $profileKey !== '' ? Session::get($profileKey, []) : [];
$profileData = is_array($profileData) ? $profileData : [];
$displayName = trim((string) (
    $profileData['displayName']
    ?? $profileData['display_name']
    ?? $userData['displayName']
    ?? $userData['name']
    ?? 'User'
));

if ($displayName === '') {
    $displayName = 'User';
}

$avatarUrl = trim((string) (
    $profileData['avatarUrl']
    ?? $profileData['avatar_url']
    ?? $userData['avatarUrl']
    ?? $userData['avatar_url']
    ?? ''
));

$roleLabel = $role !== '' ? ucfirst(strtolower($role)) : 'Role';
$basePath = match ($role) {
    'ADMIN' => '/admin',
    'EDITOR' => '/editor',
    'STAKEHOLDER' => '/stakeholder',
    default => '',
};
$notificationsUrl = $basePath !== '' ? $basePath . '/notifications' : '/notifications';
$profileUrl = $basePath !== '' ? $basePath . '/profile' : '/profile';
$profileEditUrl = $basePath !== '' ? $basePath . '/profile/edit' : '/profile/edit';
$notificationCount = max(0, (int) ($unreadNotifications ?? 0));
$avatarInitials = strtoupper(substr($displayName, 0, 2));
?>
<header class="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 text-white backdrop-blur">
    <div class="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <div class="flex min-w-0 items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-black tracking-[0.16em] text-white shadow-lg shadow-slate-900/40">
                C
            </div>
            <div class="min-w-0">
                <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400\"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?></p>
                <h1 class="truncate text-lg font-black tracking-tight text-white">Contify</h1>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <a href="<?= htmlspecialchars($notificationsUrl, ENT_QUOTES, 'UTF-8') ?>" class="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 shadow-sm transition hover:border-blue-300 hover:text-white" aria-label="Open notifications">
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                    <path d="M10 17a2 2 0 0 0 4 0" />
                </svg>
                <?php if ($notificationCount > 0): ?>
                    <span class="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                        <?= $notificationCount > 99 ? '99+' : $notificationCount ?>
                    </span>
                <?php endif; ?>
            </a>

            <details class="relative">
                <summary class="flex cursor-pointer list-none items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-sm transition hover:border-blue-300">
                    <span class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-sm font-bold text-white">
                        <?php if ($avatarUrl !== ''): ?>
                            <img src="<?= htmlspecialchars($avatarUrl, ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8') ?>" class="h-full w-full object-cover" />
                        <?php else: ?>
                            <?= htmlspecialchars($avatarInitials, ENT_QUOTES, 'UTF-8') ?>
                        <?php endif; ?>
                    </span>
                    <span class="hidden min-w-0 text-left sm:block">
                        <span class="block truncate text-sm font-semibold text-white\"><?= htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8') ?></span>
                        <span class="block truncate text-xs text-slate-400\"><?= htmlspecialchars((string) ($userData['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?></span>
                    </span>
                    <svg viewBox="0 0 20 20" class="h-4 w-4 text-slate-400" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clip-rule="evenodd" />
                    </svg>
                </summary>

                <div class="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                    <div class="border-b border-slate-100 px-4 py-4">
                        <div class="flex items-center gap-3">
                            <span class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-200 text-sm font-bold text-slate-700">
                                <?php if ($avatarUrl !== ''): ?>
                                    <img src="<?= htmlspecialchars($avatarUrl, ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8') ?>" class="h-full w-full object-cover" />
                                <?php else: ?>
                                    <?= htmlspecialchars($avatarInitials, ENT_QUOTES, 'UTF-8') ?>
                                <?php endif; ?>
                            </span>
                            <div class="min-w-0">
                                <p class="truncate text-sm font-semibold text-slate-950"><?= htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8') ?></p>
                                <p class="truncate text-xs text-slate-500"><?= htmlspecialchars((string) ($userData['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                        </div>
                    </div>

                    <div class="p-2">
                        <a href="<?= htmlspecialchars($profileUrl, ENT_QUOTES, 'UTF-8') ?>" class="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                            <span>View Profile</span>
                            <span class="text-slate-400">&rarr;</span>
                        </a>
                        <a href="<?= htmlspecialchars($profileEditUrl, ENT_QUOTES, 'UTF-8') ?>" class="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                            <span>Edit Profile</span>
                            <span class="text-slate-400">&rarr;</span>
                        </a>
                    </div>

                    <div class="border-t border-slate-100 p-2">
                        <form method="post" action="/logout">
                            <button class="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
                                <span>Log out</span>
                                <span>&rarr;</span>
                            </button>
                        </form>
                    </div>
                </div>
            </details>
        </div>
    </div>
</header>
