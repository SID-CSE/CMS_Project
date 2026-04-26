<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var ?\App\Models\ProjectRequest $project */
/** @var \App\Models\ProjectTask $task */
/** @var array<\App\Models\TaskAttachment> $attachments */
/** @var array<int,array{label:string,value:string,kind:string}> $timeline */
?>
<?php
$timelineBadgeClass = static function (string $kind): string {
    return match ($kind) {
        'success' => 'bg-emerald-100 text-emerald-700',
        'warning' => 'bg-amber-100 text-amber-700',
        default => 'bg-slate-100 text-slate-700',
    };
};
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside aria-label="Editor navigation" class="border-r border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-2xl">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Editor portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Content Viewer</p>
            </div>
            <?php require_once __DIR__ . '/../partials/role-sidebar-nav.php'; ?>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900"><?= htmlspecialchars($task->title, ENT_QUOTES, 'UTF-8') ?></h2>
                    <p class="mt-2 text-sm text-slate-500">Detailed content view and current version state.</p>
                </div>
                <div class="flex flex-wrap gap-3">
                    <a href="/editor/messages" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Messages</a>
                    <a href="/editor/profile" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Profile</a>
                    <a href="/editor/content" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Content</a>
                </div>
            </div>

            <section class="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Project</p>
                        <p class="mt-1 text-lg font-semibold text-slate-900"><?= htmlspecialchars($project?->title ?? $task->projectId, ENT_QUOTES, 'UTF-8') ?></p>
                    </div>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($task->status, ENT_QUOTES, 'UTF-8') ?></span>
                </div>

                <div class="mt-6">
                    <h3 class="text-lg font-semibold text-slate-900">Content Brief</h3>
                    <p class="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600"><?= htmlspecialchars($task->description, ENT_QUOTES, 'UTF-8') ?></p>
                </div>

                <?php if ($task->submissionNote !== null && $task->submissionNote !== ''): ?>
                    <div class="mt-6 rounded-2xl bg-emerald-50 p-4 text-emerald-900">
                        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Submission Note</p>
                        <p class="mt-2 whitespace-pre-line text-sm leading-7"><?= htmlspecialchars($task->submissionNote, ENT_QUOTES, 'UTF-8') ?></p>
                    </div>
                <?php endif; ?>

                <?php if ($task->adminReviewNote !== null && $task->adminReviewNote !== ''): ?>
                    <div class="mt-4 rounded-2xl bg-amber-50 p-4 text-amber-900">
                        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Admin Review</p>
                        <p class="mt-2 whitespace-pre-line text-sm leading-7"><?= htmlspecialchars($task->adminReviewNote, ENT_QUOTES, 'UTF-8') ?></p>
                    </div>
                <?php endif; ?>

                <div class="mt-6">
                    <h3 class="text-lg font-semibold text-slate-900">Attachments</h3>
                    <?php if ($attachments === []): ?>
                        <p class="mt-2 text-sm text-slate-500">No attachments uploaded for this content yet.</p>
                    <?php else: ?>
                        <div class="mt-3 space-y-2">
                            <?php foreach ($attachments as $attachment): ?>
                                <a href="<?= htmlspecialchars($attachment->filePath, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" class="block rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#1734a1] hover:bg-blue-50">
                                    <span><?= htmlspecialchars($attachment->originalName, ENT_QUOTES, 'UTF-8') ?></span>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <aside aria-label="Related content" class="space-y-6">
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 class="text-lg font-semibold text-slate-900">Timeline</h3>
                    <div class="mt-4 space-y-3">
                        <?php foreach ($timeline as $item): ?>
                            <div class="rounded-2xl border border-slate-200 p-4">
                                <div class="flex items-start justify-between gap-3">
                                    <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8') ?></p>
                                    <span class="rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide <?= htmlspecialchars($timelineBadgeClass((string) $item['kind']), ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($item['kind'], ENT_QUOTES, 'UTF-8') ?></span>
                                </div>
                                <p class="mt-2 text-xs text-slate-500"><?= htmlspecialchars($item['value'], ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="rounded-3xl bg-[#1734a1] p-6 text-white shadow-lg">
                    <div class="text-xs uppercase tracking-[0.24em] text-blue-100">Action</div>
                    <div class="mt-3 text-2xl font-bold">Version review</div>
                    <p class="mt-3 text-sm leading-6 text-blue-100">Use the version history view to inspect the content state after each submission or review.</p>
                    <div class="mt-5 flex flex-wrap gap-2">
                        <a href="/editor/content/<?= urlencode($task->id) ?>/versions" class="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1734a1] hover:bg-blue-50">Open Versions</a>
                        <a href="/editor/projects/<?= urlencode($task->projectId) ?>/content" class="rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">Project Content</a>
                    </div>
                </div>
            </aside>
            </section>
        </main>
    </div>
</div>

