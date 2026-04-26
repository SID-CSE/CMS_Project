<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<\App\Models\ProjectRequest> $projects */
/** @var array<string,array<\App\Models\ProjectTask>> $tasksByProject */
/** @var array<string,array<\App\Models\TaskAttachment>> $attachmentsByTask */

$roleLabel = 'Stakeholder';
$basePath = '/stakeholder';
$activePath = '/stakeholder/content';
require_once __DIR__ . '/../partials/role-sidebar.php';
?>
<div class="mb-6 flex items-start justify-between gap-4">
    <div>
        <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
        <h2 class="mt-1 text-3xl font-bold text-slate-900">Content Overview</h2>
        <p class="mt-2 text-sm text-slate-500">Browse the content shipped across your active projects.</p>
    </div>
    <div class="flex flex-wrap gap-3">
        <a href="/stakeholder/messages" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Messages</a>
        <a href="/stakeholder/profile" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Profile</a>
        <a href="/stakeholder/dashboard" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Dashboard</a>
    </div>
</div>

<div class="space-y-5">
    <?php foreach ($projects as $project): ?>
        <?php $projectTasks = $tasksByProject[$project->id] ?? []; ?>
        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h3 class="text-xl font-semibold text-slate-900">
                        <a class="hover:text-[#1734a1]" href="/stakeholder/content/<?= urlencode($project->id) ?>">
                            <span><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></span>
                        </a>
                    </h3>
                    <p class="mt-2 max-w-3xl whitespace-pre-line text-sm text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                </div>
                <div class="space-y-2 text-right">
                    <span class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                    <p class="text-sm text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                </div>
            </div>

            <div class="mt-4 grid gap-3 md:grid-cols-2">
                <?php foreach ($projectTasks as $task): ?>
                    <article class="rounded-2xl border border-slate-200 p-4">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($task->title, ENT_QUOTES, 'UTF-8') ?></p>
                                <p class="text-xs text-slate-500">Editor: <?= htmlspecialchars($task->assigneeEmail, ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                            <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-700"><?= htmlspecialchars($task->status, ENT_QUOTES, 'UTF-8') ?></span>
                        </div>
                        <p class="mt-2 text-sm text-slate-600"><?= htmlspecialchars($task->description, ENT_QUOTES, 'UTF-8') ?></p>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <a href="/stakeholder/content/<?= urlencode($project->id) ?>" class="rounded-lg bg-[#1734a1] px-3 py-2 text-xs font-semibold text-white hover:bg-[#132b86]">Open Project View</a>
                            <a href="/stakeholder/messages/compose" class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Discuss</a>
                        </div>
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
        </section>
    <?php endforeach; ?>
</div>
<?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
