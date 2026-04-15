<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<\App\Models\ProjectRequest> $projects */
/** @var array<string,array<\App\Models\ProjectTask>> $tasksByProject */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside aria-label="Admin navigation" class="border-r border-slate-200 bg-white p-6">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Projects</p>
            </div>
            <nav class="space-y-2 text-sm font-medium text-slate-700">
                <a href="/admin/dashboard" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">Dashboard</a>
                <a href="/admin/projects" class="block rounded-xl bg-blue-50 px-4 py-3 text-[#1734a1]">Projects</a>
                <a href="/admin/users" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">Users</a>
                <a href="/admin/messages" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">Messages</a>
            </nav>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900">Admin Projects</h2>
                </div>
                <a href="/admin/dashboard" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Dashboard</a>
            </div>

            <div class="space-y-5">
                <?php foreach ($projects as $project): ?>
                    <?php $projectTasks = $tasksByProject[$project->id] ?? []; ?>
                    <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h3 class="text-xl font-semibold text-slate-900"><a class="hover:text-[#1734a1]" href="/admin/projects/<?= urlencode($project->id) ?>"><span><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></span></a></h3>
                                <p class="mt-2 max-w-3xl whitespace-pre-line text-sm text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                            <div class="space-y-2 text-right">
                                <span class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                                <p class="text-sm text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                                <p class="font-mono text-xs text-slate-400"><?= htmlspecialchars($project->id, ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                        </div>

                        <div class="mt-4 flex flex-wrap gap-3">
                            <form method="post" action="/admin/projects/<?= urlencode($project->id) ?>/plan/send">
                                <button class="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-slate-50">Send Plan</button>
                            </form>
                        </div>

                        <div class="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                            <div class="rounded-2xl border border-slate-200 p-4">
                                <h4 class="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Assign Task</h4>
                                <form method="post" action="/admin/projects/<?= urlencode($project->id) ?>/tasks" class="mt-3 grid gap-3">
                                    <input name="title" required placeholder="Task title" class="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                    <textarea name="description" rows="2" placeholder="Task details" class="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"></textarea>
                                    <input name="assignee_email" type="email" required placeholder="editor@contify.com" class="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                    <button class="rounded-xl bg-[#1734a1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#132b86]">Assign</button>
                                </form>
                            </div>

                            <div class="rounded-2xl border border-slate-200 p-4">
                                <h4 class="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Tasks</h4>
                                <?php if ($projectTasks === []): ?>
                                    <p class="mt-3 text-sm text-slate-500">No tasks assigned yet.</p>
                                <?php else: ?>
                                    <div class="mt-3 space-y-3">
                                        <?php foreach ($projectTasks as $task): ?>
                                            <article class="rounded-xl border border-slate-200 p-3">
                                                <div class="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($task->title, ENT_QUOTES, 'UTF-8') ?></p>
                                                        <p class="text-xs text-slate-500">Assigned to <?= htmlspecialchars($task->assigneeEmail, ENT_QUOTES, 'UTF-8') ?></p>
                                                    </div>
                                                    <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-700"><?= htmlspecialchars($task->status, ENT_QUOTES, 'UTF-8') ?></span>
                                                </div>
                                                <?php if ($task->description !== ''): ?>
                                                    <p class="mt-2 text-xs text-slate-600"><?= htmlspecialchars($task->description, ENT_QUOTES, 'UTF-8') ?></p>
                                                <?php endif; ?>
                                                <?php if ($task->submissionNote !== null && $task->submissionNote !== ''): ?>
                                                    <p class="mt-2 rounded-lg bg-emerald-50 px-2 py-1 text-xs text-emerald-800">Submission: <?= htmlspecialchars($task->submissionNote, ENT_QUOTES, 'UTF-8') ?></p>
                                                <?php endif; ?>
                                                <?php if ($task->status === 'SUBMITTED'): ?>
                                                    <div class="mt-3 flex flex-wrap gap-2">
                                                        <form method="post" action="/admin/tasks/<?= urlencode($task->id) ?>/approve" class="flex gap-2">
                                                            <input name="review_note" placeholder="Optional approval note" class="rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                                            <button class="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700">Approve</button>
                                                        </form>
                                                        <form method="post" action="/admin/tasks/<?= urlencode($task->id) ?>/revision" class="flex gap-2">
                                                            <input name="review_note" placeholder="Revision note" class="rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                                            <button class="rounded-lg bg-amber-500 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-600">Request Revision</button>
                                                        </form>
                                                    </div>
                                                <?php endif; ?>
                                            </article>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </section>
                <?php endforeach; ?>
            </div>
        </main>
    </div>
</div>

