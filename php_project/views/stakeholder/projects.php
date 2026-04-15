<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<\App\Models\ProjectRequest> $projects */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside class="border-r border-slate-200 bg-white p-6">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Stakeholder portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Projects</p>
            </div>
            <nav class="space-y-2 text-sm font-medium text-slate-700">
                <a href="/stakeholder/home" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">Home</a>
                <a href="/stakeholder/create-project-request" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">Create Request</a>
                <a href="/stakeholder/projects" class="block rounded-xl bg-blue-50 px-4 py-3 text-[#1734a1]">Projects</a>
                <a href="/stakeholder/messages" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">Messages</a>
            </nav>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900">Stakeholder Projects</h2>
                </div>
                <a href="/stakeholder/create-project-request" class="rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">New Request</a>
            </div>

            <?php if (empty($projects)): ?>
                <section class="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                    <p class="text-slate-500">No projects yet.</p>
                    <a href="/stakeholder/create-project-request" class="mt-4 inline-block rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">Create your first request</a>
                </section>
            <?php else: ?>
                <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <?php foreach ($projects as $project): ?>
                        <article class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h3>
                                    <p class="mt-1 text-sm text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                                </div>
                                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                            </div>
                            <p class="mt-3 line-clamp-3 text-sm text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                            <div class="mt-4 flex items-center justify-between">
                                <span class="text-xs font-mono text-slate-500"><?= htmlspecialchars($project->id, ENT_QUOTES, 'UTF-8') ?></span>
                                <a href="/stakeholder/projects/<?= urlencode($project->id) ?>" class="text-sm font-semibold text-blue-700 hover:underline">View Details</a>
                            </div>
                        </article>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </main>
    </div>
</div>

