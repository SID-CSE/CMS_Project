<?php
/** @var array<\App\Models\ProjectRequest> $projects */
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
            <div class="aspect-video rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 p-4">
                <div class="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                    <div class="text-center">
                        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-950">▶</div>
                        <p class="mt-3 text-sm text-slate-300">Video preview placeholder for uploaded content</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="space-y-3">
            <?php foreach (array_slice($projects, 0, 3) as $project): ?>
                <article class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="text-sm font-semibold"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></p>
                    <p class="mt-1 text-xs text-slate-300">Status: <?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

