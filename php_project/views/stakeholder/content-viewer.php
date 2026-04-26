<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var \App\Models\ProjectRequest $project */
/** @var array<\App\Models\ProjectTask> $tasks */
/** @var array<string,array<\App\Models\TaskAttachment>> $attachmentsByTask */

$roleLabel = 'Stakeholder';
$basePath = '/stakeholder';
$activePath = '/stakeholder/content';
require_once __DIR__ . '/../partials/role-sidebar.php';
?>
        <div class="mb-6 flex items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                <h2 class="mt-1 text-3xl font-bold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h2>
                <p class="mt-2 text-sm text-slate-500">Content delivery details for your project.</p>
            </div>
            <a href="/stakeholder/content" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Content</a>
        </div>

        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="grid gap-4 md:grid-cols-3">
                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                    <p class="mt-2 text-lg font-semibold text-slate-900"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></p>
                </div>
                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Deadline</p>
                    <p class="mt-2 text-lg font-semibold text-slate-900"><?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                </div>
                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Project ID</p>
                    <p class="mt-2 text-sm font-mono text-slate-900"><?= htmlspecialchars($project->id, ENT_QUOTES, 'UTF-8') ?></p>
                </div>
            </div>

            <div class="mt-6">
                <h3 class="text-lg font-semibold text-slate-900">Task Content</h3>
                <div class="mt-4 space-y-4">
                    <?php foreach ($tasks as $task): ?>
                        <article class="rounded-2xl border border-slate-200 p-4">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($task->title, ENT_QUOTES, 'UTF-8') ?></p>
                                    <p class="text-xs text-slate-500">Editor: <?= htmlspecialchars($task->assigneeEmail, ENT_QUOTES, 'UTF-8') ?></p>
                                </div>
                                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($task->status, ENT_QUOTES, 'UTF-8') ?></span>
                            </div>
                            <p class="mt-2 text-sm text-slate-600"><?= htmlspecialchars($task->description, ENT_QUOTES, 'UTF-8') ?></p>
                            <?php if (!empty($attachmentsByTask[$task->id])): ?>
                                <div class="mt-4 rounded-xl bg-slate-50 p-3">
                                    <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Attachments</p>
                                    <div class="mt-2 space-y-2">
                                        <?php foreach ($attachmentsByTask[$task->id] as $attachment): ?>
                                            <a href="<?= htmlspecialchars($attachment->filePath, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" class="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-[#1734a1] hover:bg-blue-50">
                                                <span><?= htmlspecialchars($attachment->originalName, ENT_QUOTES, 'UTF-8') ?></span>
                                            </a>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </article>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
<?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
