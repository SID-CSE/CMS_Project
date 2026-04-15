<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<int,array{label:string,subject:string,detail:string,time:string}> $activity */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="mx-auto max-w-5xl p-6 lg:p-10">
        <div class="mb-6 flex items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                <h2 class="mt-1 text-3xl font-bold text-slate-900">Audit Log</h2>
                <p class="mt-2 text-sm text-slate-500">Synthetic activity trail from the PHP workflow data.</p>
            </div>
            <a href="/admin/dashboard" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Dashboard</a>
        </div>

        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="space-y-3">
                <?php foreach ($activity as $entry): ?>
                    <article class="rounded-2xl border border-slate-200 p-4">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($entry['label'], ENT_QUOTES, 'UTF-8') ?></p>
                                <p class="mt-1 text-xs text-slate-500"><?= htmlspecialchars($entry['subject'], ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                            <span class="text-xs text-slate-400"><?= htmlspecialchars($entry['time'], ENT_QUOTES, 'UTF-8') ?></span>
                        </div>
                        <p class="mt-2 text-sm text-slate-600"><?= htmlspecialchars($entry['detail'], ENT_QUOTES, 'UTF-8') ?></p>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>
    </div>
</div>
