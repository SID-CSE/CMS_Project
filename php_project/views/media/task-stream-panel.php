<?php
/** @var array<string,array<\App\Models\ProjectTask>> $tasks */
/** @var array<string,array<\App\Models\TaskAttachment>> $attachmentsByTask */
?>
<section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <div class="flex items-start justify-between gap-4">
        <div>
            <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Task Stream Panel</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">Live workflow feed</h2>
        </div>
        <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Active</span>
    </div>

    <div class="mt-4 space-y-3">
        <?php $flatTasks = []; foreach ($tasks as $projectTasks) { foreach ($projectTasks as $task) { $flatTasks[] = $task; } } ?>
        <?php foreach (array_slice($flatTasks, 0, 5) as $task): ?>
            <article class="rounded-2xl border border-slate-200 p-4">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($task->title, ENT_QUOTES, 'UTF-8') ?></p>
                        <p class="mt-1 text-xs text-slate-500">Assigned to <?= htmlspecialchars($task->assigneeEmail, ENT_QUOTES, 'UTF-8') ?></p>
                    </div>
                    <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700"><?= htmlspecialchars($task->status, ENT_QUOTES, 'UTF-8') ?></span>
                </div>
                <p class="mt-2 text-sm text-slate-600"><?= htmlspecialchars($task->description, ENT_QUOTES, 'UTF-8') ?></p>
                <?php if (!empty($attachmentsByTask[$task->id])): ?>
                    <?php $latestAttachment = $attachmentsByTask[$task->id][0]; ?>
                    <div class="mt-2 rounded-xl bg-slate-50 p-3">
                        <p class="text-xs text-slate-500"><?= count($attachmentsByTask[$task->id]) ?> attached file(s)</p>
                        <p class="mt-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($latestAttachment->originalName, ENT_QUOTES, 'UTF-8') ?></p>
                        <div class="mt-2 flex items-center gap-2">
                            <span class="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700"><?= htmlspecialchars((string) ($latestAttachment->fileType ?? 'FILE'), ENT_QUOTES, 'UTF-8') ?></span>
                            <a href="<?= htmlspecialchars((string) ($latestAttachment->streamUrl ?: $latestAttachment->filePath), ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" class="text-xs font-semibold text-[#1734a1] hover:underline">Open latest upload</a>
                        </div>
                    </div>
                <?php endif; ?>
            </article>
        <?php endforeach; ?>
    </div>
</section>
