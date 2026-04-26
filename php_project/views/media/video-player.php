<?php
/** @var array<int,array{attachment:\App\Models\TaskAttachment,task:\App\Models\ProjectTask,projectTitle:string}> $flatAttachments */
?>
<?php
$videoMedia = null;
foreach ($flatAttachments as $media) {
    if (strtoupper((string) ($media['attachment']->fileType ?? '')) === 'VIDEO') {
        $videoMedia = $media;
        break;
    }
}

$videoAttachments = array_values(array_filter(
    $flatAttachments,
    static fn (array $media): bool => strtoupper((string) ($media['attachment']->fileType ?? '')) === 'VIDEO'
));
?>
<section class="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
    <div class="flex items-start justify-between gap-4">
        <div>
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Video Player</p>
            <h2 class="mt-1 text-xl font-semibold">Preview playback and review</h2>
        </div>
        <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">Media</span>
    </div>

    <div class="mt-4 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <?php if ($videoMedia === null): ?>
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-sm text-slate-300">
                    Video uploads will appear here once editors submit cloud media.
                </div>
            <?php else: ?>
                <video controls playsinline class="aspect-video w-full rounded-2xl bg-black object-contain">
                    <source src="<?= htmlspecialchars((string) ($videoMedia['attachment']->streamUrl ?: $videoMedia['attachment']->filePath), ENT_QUOTES, 'UTF-8') ?>" />
                </video>
            <?php endif; ?>
        </div>
        <div class="space-y-3">
            <?php foreach (array_slice($videoAttachments, 0, 3) as $media): ?>
                <article class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="text-sm font-semibold"><?= htmlspecialchars($media['task']->title, ENT_QUOTES, 'UTF-8') ?></p>
                    <p class="mt-1 text-xs text-slate-300"><?= htmlspecialchars($media['projectTitle'], ENT_QUOTES, 'UTF-8') ?></p>
                    <p class="mt-1 text-xs text-slate-400"><?= htmlspecialchars($media['attachment']->originalName, ENT_QUOTES, 'UTF-8') ?></p>
                </article>
            <?php endforeach; ?>
            <?php if ($videoAttachments === []): ?>
                <article class="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
                    No cloud video files found in current submissions.
                </article>
            <?php endif; ?>
        </div>
    </div>
</section>
