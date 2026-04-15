<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<string,int> $stats */
/** @var array<\App\Models\ProjectRequest> $recentProjects */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="mx-auto max-w-6xl p-6 lg:p-10">
        <div class="mb-6 flex items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                <h2 class="mt-1 text-3xl font-bold text-slate-900">Admin Analytics</h2>
                <p class="mt-2 text-sm text-slate-500">High-level view of workflow status distribution.</p>
            </div>
            <a href="/admin/dashboard" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Dashboard</a>
        </div>

        <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <?php foreach ($stats as $label => $value): ?>
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <p class="text-sm text-slate-500"><?= htmlspecialchars((string) $label, ENT_QUOTES, 'UTF-8') ?></p>
                    <p class="mt-2 text-3xl font-bold text-slate-900"><?= (int) $value ?></p>
                </div>
            <?php endforeach; ?>
        </section>

        <section class="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 class="text-lg font-semibold text-slate-900">Recent Projects</h3>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
                <?php foreach ($recentProjects as $project): ?>
                    <article class="rounded-2xl border border-slate-200 p-4">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></p>
                                <p class="mt-1 text-xs text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                            <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                        </div>
                        <p class="mt-3 line-clamp-3 text-sm text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>
    </div>
</div>
