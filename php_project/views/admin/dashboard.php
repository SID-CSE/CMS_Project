<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<string,int> $stats */
/** @var array<\App\Models\ProjectRequest> $recentProjects */
/** @var int $unreadNotifications */
/** @var int $unreadThreads */
$roleLabel = 'Admin';
$basePath = '/admin';
$activePath = '/admin/dashboard';
$quickLinks = [
    ['label' => 'Open Projects', 'href' => '/admin/projects', 'description' => 'Review incoming requests and delivery work.'],
    ['label' => 'Manage Users', 'href' => '/admin/users', 'description' => 'Audit access and role assignments.'],
    ['label' => 'View Analytics', 'href' => '/admin/analytics', 'description' => 'Check performance and quality signals.'],
    ['label' => 'Open Settings', 'href' => '/admin/settings', 'description' => 'Adjust platform preferences and controls.'],
];
?>
<?php require_once __DIR__ . '/../partials/role-topbar.php'; ?>
<div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-50 text-slate-900">
    <div class="absolute left-[-6rem] top-[-6rem] h-56 w-56 rounded-full bg-blue-300/20 blur-3xl"></div>
    <div class="absolute bottom-[-5rem] right-[-4rem] h-72 w-72 rounded-full bg-slate-300/30 blur-3xl"></div>
    <?php require_once __DIR__ . '/../partials/role-sidebar.php'; ?>
            <div class="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <section class="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div class="max-w-2xl">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                        <h2 class="mt-2 text-4xl font-black tracking-tight text-slate-950">Welcome Back, Admin</h2>
                        <p class="mt-3 max-w-xl text-sm leading-7 text-slate-500">Manage projects, review workflows, and editorial operations from a single command center.</p>
                        <div class="mt-5 flex flex-wrap gap-3">
                            <a href="/admin/projects" class="rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-800">Open Projects</a>
                            <a href="/admin/messages" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">Open Messages<?php if (($unreadThreads ?? 0) > 0): ?> (<?= (int) $unreadThreads ?>)<?php endif; ?></a>
                            <a href="/admin/profile" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">Profile</a>
                        </div>
                    </div>
                    <div class="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 lg:min-w-[280px]">
                        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Unread notifications</p>
                            <p class="mt-2 text-3xl font-bold text-slate-900"><?= (int) $unreadNotifications ?></p>
                        </div>
                        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Unread threads</p>
                            <p class="mt-2 text-3xl font-bold text-slate-900"><?= (int) $unreadThreads ?></p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mt-6 grid gap-4 md:grid-cols-4">
                <div class="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total Projects</p>
                    <p class="mt-3 text-4xl font-black tracking-tight text-slate-950"><?= (int) $stats['totalProjects'] ?></p>
                    <div class="mt-4 h-1.5 rounded-full bg-slate-100"><div class="h-1.5 w-24 rounded-full bg-slate-900"></div></div>
                </div>
                <div class="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">Requested</p>
                    <p class="mt-3 text-4xl font-black tracking-tight text-blue-700"><?= (int) $stats['requested'] ?></p>
                </div>
                <div class="rounded-[24px] border border-purple-100 bg-white p-5 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-purple-500">In Progress</p>
                    <p class="mt-3 text-4xl font-black tracking-tight text-purple-700"><?= (int) $stats['inProgress'] ?></p>
                </div>
                <div class="rounded-[24px] border border-emerald-100 bg-white p-5 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Signed Off</p>
                    <p class="mt-3 text-4xl font-black tracking-tight text-emerald-700"><?= (int) $stats['signedOff'] ?></p>
                </div>
            </section>

            <section class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
                <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div class="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-950">Recent Projects</h3>
                            <p class="text-sm text-slate-500">Latest project requests from stakeholders</p>
                        </div>
                        <a href="/admin/projects" class="text-sm font-semibold text-blue-700 hover:underline">View all</a>
                    </div>
                    <div class="grid gap-4 md:grid-cols-2">
                        <?php foreach ($recentProjects as $project): ?>
                            <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
                                <div class="flex items-start justify-between gap-4">
                                    <div>
                                        <h4 class="font-semibold text-slate-950"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h4>
                                        <p class="mt-1 text-sm text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                                    </div>
                                    <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                                </div>
                                <p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                            </article>
                        <?php endforeach; ?>
                    </div>
                </div>

                <aside class="space-y-6">
                    <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-slate-950">Quick Actions</h3>
                        <div class="mt-4 space-y-3">
                            <?php foreach ($quickLinks as $link): ?>
                                <a href="<?= htmlspecialchars($link['href'], ENT_QUOTES, 'UTF-8') ?>" class="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50">
                                    <div class="text-sm font-semibold text-slate-950"><?= htmlspecialchars($link['label'], ENT_QUOTES, 'UTF-8') ?></div>
                                    <div class="mt-1 text-xs leading-5 text-slate-500"><?= htmlspecialchars($link['description'], ENT_QUOTES, 'UTF-8') ?></div>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <div class="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
                        <div class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Operations pulse</div>
                        <p class="mt-3 text-2xl font-bold tracking-tight">Control center is live</p>
                        <p class="mt-3 text-sm leading-7 text-slate-300">Keep approvals, user roles, and delivery statuses moving from one place.</p>
                    </div>
                </aside>
            </section>
            </div>
    <?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
</div>
