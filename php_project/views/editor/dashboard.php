<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<string,int> $stats */
/** @var array<\App\Models\ProjectRequest> $recentProjects */
/** @var int $unreadNotifications */
/** @var int $unreadThreads */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside class="border-r border-slate-200 bg-white p-6">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Editor portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Creative workspace</p>
            </div>
            <nav class="space-y-2 text-sm font-medium text-slate-700">
                <a href="/editor/dashboard" class="block rounded-xl bg-blue-50 px-4 py-3 text-[#1734a1]">Dashboard</a>
                <a href="/projects" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">Projects</a>
                <a href="/editor/content" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">My Content</a>
                <a href="/editor/messages" class="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]"><span>Messages</span><?php if (($unreadThreads ?? 0) > 0): ?><span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700"><?= (int) $unreadThreads ?></span><?php endif; ?></a>
                <a href="/editor/finance" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">Finance</a>
            </nav>
            <form class="mt-8" method="post" action="/logout">
                <button class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:opacity-90">Logout</button>
            </form>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900">Welcome Back, Editor</h2>
                    <p class="mt-2 text-sm text-slate-500">Track drafts, manage feedback, and keep your publishing queue on schedule.</p>
                </div>
                <div class="flex gap-3">
                    <a href="/editor/content" class="rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">Open My Content</a>
                    <a href="/editor/messages" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Open Messages<?php if (($unreadThreads ?? 0) > 0): ?> (<?= (int) $unreadThreads ?>)<?php endif; ?></a>
                </div>
            </div>

            <section class="grid gap-4 md:grid-cols-4">
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p class="text-sm text-slate-500">Open Requests</p><p class="mt-2 text-3xl font-bold text-blue-700"><?= (int) $stats['openProjects'] ?></p></div>
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p class="text-sm text-slate-500">In Progress</p><p class="mt-2 text-3xl font-bold text-purple-700"><?= (int) $stats['inProgress'] ?></p></div>
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p class="text-sm text-slate-500">Delivered</p><p class="mt-2 text-3xl font-bold text-emerald-700"><?= (int) $stats['delivered'] ?></p></div>
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p class="text-sm text-slate-500">Signed Off</p><p class="mt-2 text-3xl font-bold text-slate-900"><?= (int) $stats['signedOff'] ?></p></div>
            </section>

            <section class="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div class="mb-4 flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900">Recent Requests</h3>
                        <p class="text-sm text-slate-500">Latest briefs and scope changes</p>
                    </div>
                    <a href="/projects" class="text-sm font-semibold text-blue-700 hover:underline">View all</a>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                    <?php foreach ($recentProjects as $project): ?>
                        <article class="rounded-2xl border border-slate-200 p-4">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <h4 class="font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h4>
                                    <p class="mt-1 text-sm text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                                </div>
                                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                            </div>
                            <p class="mt-3 line-clamp-2 text-sm text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                        </article>
                    <?php endforeach; ?>
                </div>
            </section>
        </main>
    </div>
</div>

