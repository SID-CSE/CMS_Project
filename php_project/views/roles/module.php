<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var string $pageKey */
$navigation = [
    'ADMIN' => [
        ['label' => 'Dashboard', 'href' => '/admin/dashboard'],
        ['label' => 'Projects', 'href' => '/admin/projects'],
        ['label' => 'Users', 'href' => '/admin/users'],
        ['label' => 'Messages', 'href' => '/admin/messages'],
        ['label' => 'Content', 'href' => '/admin/content'],
        ['label' => 'Analytics', 'href' => '/admin/analytics'],
        ['label' => 'Audit Log', 'href' => '/admin/audit-log'],
        ['label' => 'Settings', 'href' => '/admin/settings'],
        ['label' => 'Streaming', 'href' => '/admin/streaming'],
        ['label' => 'Profile', 'href' => '/admin/profile'],
        ['label' => 'Finance', 'href' => '/admin/finance'],
    ],
    'EDITOR' => [
        ['label' => 'Dashboard', 'href' => '/editor/dashboard'],
        ['label' => 'Projects', 'href' => '/projects'],
        ['label' => 'My Content', 'href' => '/editor/content'],
        ['label' => 'Messages', 'href' => '/editor/messages'],
        ['label' => 'Profile', 'href' => '/editor/profile'],
        ['label' => 'Finance', 'href' => '/editor/finance'],
        ['label' => 'Streaming', 'href' => '/editor/streaming'],
    ],
    'STAKEHOLDER' => [
        ['label' => 'Home', 'href' => '/stakeholder/home'],
        ['label' => 'Create Request', 'href' => '/stakeholder/create-project-request'],
        ['label' => 'Projects', 'href' => '/stakeholder/projects'],
        ['label' => 'Content', 'href' => '/stakeholder/content'],
        ['label' => 'Messages', 'href' => '/stakeholder/messages'],
        ['label' => 'Profile', 'href' => '/stakeholder/profile'],
        ['label' => 'Finance', 'href' => '/stakeholder/finance'],
        ['label' => 'Notifications', 'href' => '/stakeholder/notifications'],
    ],
];

$role = strtoupper((string) ($user['role'] ?? 'EDITOR'));
$items = $navigation[$role] ?? $navigation['EDITOR'];
$prettyKey = strtoupper(str_replace(['roles/', '-'], ['', ' '], $pageKey));
?>
<div class="min-h-screen bg-slate-50">
    <div class="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside class="border-r border-slate-200 bg-white p-6">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"><?= htmlspecialchars($role, ENT_QUOTES, 'UTF-8') ?> portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500"><?= htmlspecialchars($prettyKey, ENT_QUOTES, 'UTF-8') ?></p>
            </div>

            <nav class="space-y-2">
                <?php foreach ($items as $item): ?>
                    <a href="<?= htmlspecialchars($item['href'], ENT_QUOTES, 'UTF-8') ?>" class="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-[#1734a1]" aria-label="Open <?= htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8') ?> page">
                        <span><?= htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8') ?></span>
                    </a>
                <?php endforeach; ?>
            </nav>

            <form class="mt-8" method="post" action="/logout">
                <button class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:opacity-90">Logout</button>
            </form>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900"><?= htmlspecialchars($title ?? 'Module', ENT_QUOTES, 'UTF-8') ?></h2>
                </div>
                <div class="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                    <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Route</div>
                    <div class="mt-1 text-sm font-semibold text-slate-800"><?= htmlspecialchars($pageKey, ENT_QUOTES, 'UTF-8') ?></div>
                </div>
            </div>

            <section class="grid gap-6 md:grid-cols-3">
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:col-span-2">
                    <h3 class="text-lg font-semibold text-slate-900">Page scaffold</h3>
                    <p class="mt-3 text-sm leading-7 text-slate-600">This PHP module now matches the React route surface with a shared shell, session auth, and Tailwind-styled SSR view. Replace this content with the exact dashboard or detail layout as each page is migrated.
                    </p>
                </div>
                <div class="rounded-3xl bg-[#1734a1] p-6 text-white shadow-lg">
                    <div class="text-xs uppercase tracking-[0.24em] text-blue-100">Status</div>
                    <div class="mt-3 text-2xl font-bold">Migration running</div>
                    <p class="mt-3 text-sm leading-6 text-blue-100">Role shell, nav, and route mapping are in place for PHP SSR pages.</p>
                </div>
            </section>
        </main>
    </div>
</div>
