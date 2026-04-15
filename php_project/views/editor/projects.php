<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<\App\Models\ProjectRequest> $projects */
/** @var array<\App\Models\ProjectTask> $assignedTasks */
/** @var array<string,array<\App\Models\TaskAttachment>> $attachmentsByTask */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside class="border-r border-slate-200 bg-white p-6">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Editor portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Projects</p>
            </div>
            <nav class="space-y-2 text-sm font-medium text-slate-700">
                <a href="/editor/dashboard" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">Dashboard</a>
                <a href="/projects" class="block rounded-xl bg-blue-50 px-4 py-3 text-[#1734a1]">Projects</a>
                <a href="/editor/content" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">My Content</a>
                <a href="/editor/messages" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]">Messages</a>
            </nav>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900">Editor Projects</h2>
                </div>
                <a href="/editor/dashboard" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Dashboard</a>
            </div>

            <section class="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 class="text-lg font-semibold text-slate-900">Assigned Tasks</h3>
                <?php if ($assignedTasks === []): ?>
                    <p class="mt-2 text-sm text-slate-500">No tasks assigned to your account yet.</p>
                <?php else: ?>
                    <div class="mt-4 space-y-3">
                        <?php foreach ($assignedTasks as $task): ?>
                            <article class="rounded-2xl border border-slate-200 p-4">
                                <div class="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($task->title, ENT_QUOTES, 'UTF-8') ?></p>
                                        <p class="text-xs text-slate-500">Project ID: <span class="font-mono"><?= htmlspecialchars($task->projectId, ENT_QUOTES, 'UTF-8') ?></span></p>
                                    </div>
                                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($task->status, ENT_QUOTES, 'UTF-8') ?></span>
                                </div>
                                <?php if ($task->description !== ''): ?>
                                    <p class="mt-2 text-sm text-slate-600"><?= htmlspecialchars($task->description, ENT_QUOTES, 'UTF-8') ?></p>
                                <?php endif; ?>
                                <?php if ($task->adminReviewNote !== null && $task->adminReviewNote !== ''): ?>
                                    <p class="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Admin note: <?= htmlspecialchars($task->adminReviewNote, ENT_QUOTES, 'UTF-8') ?></p>
                                <?php endif; ?>
                                <?php if ($task->status === 'ASSIGNED' || $task->status === 'REVISION_REQUESTED'): ?>
                                    <form method="post" action="/editor/tasks/<?= urlencode($task->id) ?>/submit" enctype="multipart/form-data" class="mt-3 grid gap-3">
                                        <input name="submission_note" placeholder="Submission update or delivery link" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                        <input type="file" name="attachment" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white" />
                                        <div class="flex justify-end">
                                            <button class="rounded-xl bg-[#1734a1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#132b86]">Submit Work</button>
                                        </div>
                                    </form>
                                    <?php if (!empty($attachmentsByTask[$task->id])): ?>
                                        <div class="mt-3 rounded-xl bg-slate-50 p-3">
                                            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Attachments</p>
                                            <div class="mt-2 space-y-2">
                                                <?php foreach ($attachmentsByTask[$task->id] as $attachment): ?>
                                                    <a href="<?= htmlspecialchars($attachment->filePath, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" class="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#1734a1] hover:bg-blue-50" aria-label="Open attachment <?= htmlspecialchars($attachment->originalName, ENT_QUOTES, 'UTF-8') ?>">
                                                        <span><?= htmlspecialchars($attachment->originalName, ENT_QUOTES, 'UTF-8') ?></span>
                                                    </a>
                                                <?php endforeach; ?>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                <?php endif; ?>
                            </article>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </section>

            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <?php foreach ($projects as $project): ?>
                    <article class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <h3 class="text-lg font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h3>
                                <p class="mt-1 text-sm text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                        </div>
                        <p class="mt-3 line-clamp-3 text-sm text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                    </article>
                <?php endforeach; ?>
            </div>
        </main>
    </div>
</div>
