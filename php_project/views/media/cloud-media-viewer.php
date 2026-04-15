<?php
/** @var array<\App\Models\ProjectRequest> $projects */
?>
<section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <div class="flex items-start justify-between gap-4">
        <div>
            <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Cloud Media Viewer</p>
            <h2 class="mt-1 text-xl font-semibold text-slate-900">Review uploaded assets</h2>
        </div>
        <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">SSR</span>
    </div>

    <div class="mt-4 grid gap-4 md:grid-cols-2">
        <?php foreach (array_slice($projects, 0, 4) as $project): ?>
            <article class="rounded-2xl border border-slate-200 p-4">
                <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></p>
                <p class="mt-2 text-sm text-slate-600">Use the project content pages to inspect attachments, submissions, and linked media for this request.</p>
                <a href="/projects/<?= urlencode($project->id) ?>/content" class="mt-3 inline-flex rounded-lg bg-[#1734a1] px-3 py-2 text-xs font-semibold text-white hover:bg-[#132b86]">Open Content</a>
            </article>
        <?php endforeach; ?>
    </div>
</section>
