<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var ?\App\Models\ProjectRequest $project */
/** @var \App\Models\ProjectTask $task */
/** @var array<\App\Models\TaskAttachment> $attachments */
/** @var array<int,array{label:string,value:string,kind:string}> $timeline */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="mx-auto max-w-5xl p-6 lg:p-10">
        <div class="mb-6 flex items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                <h2 class="mt-1 text-3xl font-bold text-slate-900">Version History</h2>
                <p class="mt-2 text-sm text-slate-500">A compact timeline for the selected content item.</p>
            </div>
            <a href="/content/<?= urlencode($task->id) ?>/view" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Viewer</a>
        </div>

        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Project</p>
                    <h3 class="mt-1 text-xl font-semibold text-slate-900"><?= htmlspecialchars($project?->title ?? $task->projectId, ENT_QUOTES, 'UTF-8') ?></h3>
                    <p class="mt-2 text-sm text-slate-500"><?= htmlspecialchars($task->title, ENT_QUOTES, 'UTF-8') ?></p>
                </div>
                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($task->status, ENT_QUOTES, 'UTF-8') ?></span>
            </div>

            <div class="mt-6 grid gap-4 md:grid-cols-2">
                <div class="rounded-2xl border border-slate-200 p-4">
                    <h4 class="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Timeline</h4>
                    <div class="mt-3 space-y-3">
                        <?php foreach ($timeline as $item): ?>
                            <div class="rounded-xl bg-slate-50 p-3">
                                <div class="flex items-start justify-between gap-3">
                                    <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8') ?></p>
                                    <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-500"><?= htmlspecialchars($item['kind'], ENT_QUOTES, 'UTF-8') ?></span>
                                </div>
                                <p class="mt-2 text-xs text-slate-500"><?= htmlspecialchars($item['value'], ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="rounded-2xl border border-slate-200 p-4">
                    <h4 class="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Attachments</h4>
                    <?php if ($attachments === []): ?>
                        <p class="mt-3 text-sm text-slate-500">No files are linked to this version history.</p>
                    <?php else: ?>
                        <div class="mt-3 space-y-2">
                            <?php foreach ($attachments as $attachment): ?>
                                <a href="<?= htmlspecialchars($attachment->filePath, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" class="block rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#1734a1] hover:bg-blue-50">
                                    <span><?= htmlspecialchars($attachment->originalName, ENT_QUOTES, 'UTF-8') ?></span>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </section>
    </div>
</div>
