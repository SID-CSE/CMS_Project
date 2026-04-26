<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var string $roleLabel */
/** @var string $activePath */
/** @var string $basePath */

$roleLabel = $roleLabel ?? ucfirst(strtolower((string) ($user['role'] ?? 'stakeholder')));
$basePath = $basePath ?? ('/' . strtolower((string) ($user['role'] ?? 'stakeholder')));
$activePath = $activePath ?? $basePath;

$role = strtoupper((string) ($user['role'] ?? 'STAKEHOLDER'));
$config = [
    'ADMIN' => [
        'initials' => 'AD',
        'subtitle' => 'Publishing operations',
        'statusTitle' => 'Publishing status',
        'statusText' => 'Track approvals, quality gates, and delivery readiness.',
        'sections' => [
            [
                'title' => 'Control',
                'items' => [
                    ['label' => 'Dashboard', 'href' => '/admin/dashboard'],
                    ['label' => 'Projects', 'href' => '/admin/projects'],
                    ['label' => 'Users', 'href' => '/admin/users'],
                    ['label' => 'Messages', 'href' => '/admin/messages'],
                ],
            ],
            [
                'title' => 'Quality',
                'items' => [
                    ['label' => 'Content board', 'href' => '/admin/content'],
                    ['label' => 'Analytics', 'href' => '/admin/analytics'],
                    ['label' => 'Audit log', 'href' => '/admin/audit-log'],
                    ['label' => 'Settings', 'href' => '/admin/settings'],
                ],
            ],
            [
                'title' => 'Account',
                'items' => [
                    ['label' => 'Streaming', 'href' => '/admin/streaming'],
                    ['label' => 'Profile', 'href' => '/admin/profile'],
                    ['label' => 'Finance', 'href' => '/admin/finance'],
                ],
            ],
        ],
    ],
    'EDITOR' => [
        'initials' => 'ED',
        'subtitle' => 'Creative workspace',
        'statusTitle' => 'Production status',
        'statusText' => 'Track drafts, revisions, and submission flow as they move forward.',
        'sections' => [
            [
                'title' => 'Workspace',
                'items' => [
                    ['label' => 'Dashboard', 'href' => '/editor/dashboard'],
                    ['label' => 'Projects', 'href' => '/editor/projects'],
                    ['label' => 'My content', 'href' => '/editor/content'],
                    ['label' => 'Messages', 'href' => '/editor/messages'],
                ],
            ],
            [
                'title' => 'Delivery',
                'items' => [
                    ['label' => 'Streaming', 'href' => '/editor/streaming'],
                    ['label' => 'Profile', 'href' => '/editor/profile'],
                    ['label' => 'Finance', 'href' => '/editor/finance'],
                ],
            ],
        ],
    ],
    'STAKEHOLDER' => [
        'initials' => 'SH',
        'subtitle' => 'Approval workspace',
        'statusTitle' => 'Review status',
        'statusText' => 'Monitor approvals, requests, and finalized project deliveries.',
        'sections' => [
            [
                'title' => 'Review',
                'items' => [
                    ['label' => 'Dashboard', 'href' => '/stakeholder/dashboard'],
                    ['label' => 'Create request', 'href' => '/stakeholder/create-project-request'],
                    ['label' => 'Projects', 'href' => '/stakeholder/projects'],
                    ['label' => 'Content', 'href' => '/stakeholder/content'],
                ],
            ],
            [
                'title' => 'Communication',
                'items' => [
                    ['label' => 'Messages', 'href' => '/stakeholder/messages'],
                    ['label' => 'Notifications', 'href' => '/stakeholder/notifications'],
                    ['label' => 'Streaming', 'href' => '/stakeholder/streaming'],
                    ['label' => 'Profile', 'href' => '/stakeholder/profile'],
                    ['label' => 'Finance', 'href' => '/stakeholder/finance'],
                ],
            ],
        ],
    ],
];

$current = $config[$role] ?? $config['STAKEHOLDER'];
?>
<div class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
    <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-lg font-bold text-blue-300">
            <?= htmlspecialchars($current['initials'], ENT_QUOTES, 'UTF-8') ?>
        </div>
        <div>
            <p class="text-sm font-semibold tracking-wide text-white"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?></p>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400"><?= htmlspecialchars($current['subtitle'], ENT_QUOTES, 'UTF-8') ?></p>
        </div>
    </div>
</div>

<nav class="mt-8 flex-1 space-y-6 pr-1 text-sm font-medium">
    <?php foreach ($current['sections'] as $section): ?>
        <div>
            <p class="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"><?= htmlspecialchars($section['title'], ENT_QUOTES, 'UTF-8') ?></p>
            <div class="mt-2 space-y-2">
                <?php foreach ($section['items'] as $item): ?>
                    <?php
                    $isInBase = $basePath !== '' && str_starts_with($item['href'], $basePath);
                    $isExact = $item['href'] === $activePath;
                    $isNested = str_starts_with($activePath, $item['href'] . '/');
                    $isActive = $isInBase && ($isExact || $isNested);
                    ?>
                    <a href="<?= htmlspecialchars($item['href'], ENT_QUOTES, 'UTF-8') ?>" class="flex items-center justify-between rounded-2xl px-4 py-3 transition <?= $isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-300 hover:bg-white/5 hover:text-white' ?>" aria-label="Open <?= htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8') ?> page">
                        <span><?= htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8') ?></span>
                        <span class="h-2.5 w-2.5 rounded-full <?= $isActive ? 'bg-white' : 'bg-slate-600' ?>"></span>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endforeach; ?>
</nav>

<div class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
    <p class="text-sm font-medium text-white"><?= htmlspecialchars($current['statusTitle'], ENT_QUOTES, 'UTF-8') ?></p>
    <p class="mt-2 text-sm text-slate-300"><?= htmlspecialchars($current['statusText'], ENT_QUOTES, 'UTF-8') ?></p>
</div>

<form class="mt-4" method="post" action="/logout">
    <button class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Logout</button>
</form>
