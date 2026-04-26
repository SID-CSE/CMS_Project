<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<string,int> $stats */
/** @var array<\App\Models\ProjectRequest> $recentProjects */
/** @var int $unreadNotifications */
/** @var int $unreadThreads */
$roleLabel = 'Editor';
$basePath = '/editor';
$activePath = '/editor/dashboard';
$quickLinks = [
    ['label' => 'Open My Content', 'href' => '/editor/content', 'description' => 'Review assigned content and task attachments.'],
    ['label' => 'Open Projects', 'href' => '/projects', 'description' => 'Check current project requests.'],
    ['label' => 'Messages', 'href' => '/editor/messages', 'description' => 'Continue review discussions.'],
    ['label' => 'Streaming', 'href' => '/editor/streaming', 'description' => 'Preview video and media workflow.'],
];
?>
<?php require_once __DIR__ . '/../partials/role-topbar.php'; ?>
<div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-cyan-50 text-slate-900">
    <div class="absolute right-[-6rem] top-[-6rem] h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl"></div>
    <div class="absolute bottom-[-5rem] left-[-4rem] h-72 w-72 rounded-full bg-slate-300/30 blur-3xl"></div>
    <?php require_once __DIR__ . '/../partials/role-sidebar.php'; ?>
            <div class="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <section class="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div class="max-w-2xl">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                        <h2 class="mt-2 text-4xl font-black tracking-tight text-slate-950">Welcome Back, Editor</h2>
                        <p class="mt-3 max-w-xl text-sm leading-7 text-slate-500">Track drafts, manage feedback, and keep your publishing queue moving on time.</p>
                        <div class="mt-5 flex flex-wrap gap-3">
                            <a href="/editor/content" class="rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-800">Open My Content</a>
                            <a href="/editor/messages" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">Open Messages<?php if (($unreadThreads ?? 0) > 0): ?> (<?= (int) $unreadThreads ?>)<?php endif; ?></a>
                            <a href="/editor/profile" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">Profile</a>
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
                <div class="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">Open Requests</p>
                    <p class="mt-3 text-4xl font-black tracking-tight text-blue-700"><?= (int) $stats['openProjects'] ?></p>
                </div>
                <div class="rounded-[24px] border border-purple-100 bg-white p-5 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-purple-500">In Progress</p>
                    <p class="mt-3 text-4xl font-black tracking-tight text-purple-700"><?= (int) $stats['inProgress'] ?></p>
                </div>
                <div class="rounded-[24px] border border-emerald-100 bg-white p-5 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Delivered</p>
                    <p class="mt-3 text-4xl font-black tracking-tight text-emerald-700"><?= (int) $stats['delivered'] ?></p>
                </div>
                <div class="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Signed Off</p>
                    <p class="mt-3 text-4xl font-black tracking-tight text-slate-950"><?= (int) $stats['signedOff'] ?></p>
                </div>
            </section>

            <section class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
                <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div class="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-950">Recent Requests</h3>
                            <p class="text-sm text-slate-500">Latest briefs and scope changes</p>
                        </div>
                        <a href="/editor/projects" class="text-sm font-semibold text-blue-700 hover:underline">View all</a>
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
                                <a href="<?= htmlspecialchars($link['href'], ENT_QUOTES, 'UTF-8') ?>" class="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-cyan-50">
                                    <div class="text-sm font-semibold text-slate-950"><?= htmlspecialchars($link['label'], ENT_QUOTES, 'UTF-8') ?></div>
                                    <div class="mt-1 text-xs leading-5 text-slate-500"><?= htmlspecialchars($link['description'], ENT_QUOTES, 'UTF-8') ?></div>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <div class="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
                        <div class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Production pulse</div>
                        <p class="mt-3 text-2xl font-bold tracking-tight">Queue is moving</p>
                        <p class="mt-3 text-sm leading-7 text-slate-300">Stay on top of revisions, approvals, and content handoffs from one clean overview.</p>
                    </div>
                </aside>
            </section>
            </div>
    <?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
</div>

