<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<\App\Models\ProjectRequest> $recentProjects */
$roleLabel = 'Admin';
$basePath = '/admin';
$activePath = '/admin/streaming';
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside class="border-r border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-2xl">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Streaming</p>
            </div>
            <?php require_once __DIR__ . '/../partials/role-sidebar-nav.php'; ?>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mx-auto max-w-6xl">
        <div class="mb-6 flex items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                <h2 class="mt-1 text-3xl font-bold text-slate-900">Streaming</h2>
                <p class="mt-2 text-sm text-slate-500">Placeholder for the client streaming screens with live project context.</p>
            </div>
            <a href="/admin/dashboard" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Dashboard</a>
        </div>

        <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <?php foreach ($recentProjects as $project): ?>
                <article class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></p>
                            <p class="mt-1 text-xs text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                        </div>
                        <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                    </div>
                    <p class="mt-3 line-clamp-4 text-sm text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                </article>
            <?php endforeach; ?>
            </section>
            </div>
        </main>
    </div>
</div>

