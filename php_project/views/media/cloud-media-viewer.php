<?php
/** @var array<int,array{attachment:\App\Models\TaskAttachment,task:\App\Models\ProjectTask,projectTitle:string}> $flatAttachments */
?>
<?php
$featuredMedia = $flatAttachments[0] ?? null;
$mediaUrl = $featuredMedia !== null ? (($featuredMedia['attachment']->streamUrl ?: $featuredMedia['attachment']->filePath)) : null;
$mediaType = strtoupper((string) ($featuredMedia['attachment']->fileType ?? 'FILE'));
?>
<section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <div class="flex items-start justify-between gap-4">
        <div>
            <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Cloud Media Viewer</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">Review uploaded assets</h2>
        </div>
        <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">SSR</span>
    </div>

    <div class="mt-4 space-y-4">
        <?php if ($featuredMedia === null || $mediaUrl === null || $mediaUrl === ''): ?>
            <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                No uploaded media yet. Editor submissions with cloud uploads will appear here.
            </div>
        <?php else: ?>
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                <div class="border-b border-white/10 px-4 py-3 text-sm font-medium text-slate-200">
                    <?= htmlspecialchars($featuredMedia['task']->title, ENT_QUOTES, 'UTF-8') ?> · <?= htmlspecialchars($featuredMedia['projectTitle'], ENT_QUOTES, 'UTF-8') ?>
                </div>
                <?php if ($mediaType === 'VIDEO'): ?>
                    <video controls playsinline class="h-96 w-full bg-black object-contain">
                        <source src="<?= htmlspecialchars($mediaUrl, ENT_QUOTES, 'UTF-8') ?>" />
                    </video>
                <?php elseif ($mediaType === 'IMAGE'): ?>
                    <div class="flex min-h-96 items-center justify-center bg-black p-4">
                        <img src="<?= htmlspecialchars($mediaUrl, ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($featuredMedia['attachment']->originalName, ENT_QUOTES, 'UTF-8') ?>" class="max-h-96 w-full object-contain" />
                    </div>
                <?php else: ?>
                    <iframe src="<?= htmlspecialchars($mediaUrl, ENT_QUOTES, 'UTF-8') ?>" title="Cloud media preview" class="h-96 w-full bg-white"></iframe>
                <?php endif; ?>
            </div>
            <div class="grid gap-3 md:grid-cols-2">
                <?php foreach (array_slice($flatAttachments, 0, 4) as $media): ?>
                    <article class="rounded-2xl border border-slate-200 p-4">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($media['task']->title, ENT_QUOTES, 'UTF-8') ?></p>
                                <p class="mt-1 text-xs text-slate-500"><?= htmlspecialchars($media['projectTitle'], ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                            <span class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-700"><?= htmlspecialchars((string) ($media['attachment']->fileType ?? 'FILE'), ENT_QUOTES, 'UTF-8') ?></span>
                        </div>
                        <p class="mt-2 text-xs text-slate-500"><?= htmlspecialchars($media['attachment']->originalName, ENT_QUOTES, 'UTF-8') ?></p>
                        <a href="<?= htmlspecialchars((string) ($media['attachment']->streamUrl ?: $media['attachment']->filePath), ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" class="mt-3 inline-flex rounded-lg bg-[#1734a1] px-3 py-2 text-xs font-semibold text-white hover:bg-[#132b86]">Open Media</a>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>
