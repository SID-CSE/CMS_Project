<?php
/** @var \App\Models\ProjectRequest $project */
?>
<?php
$roleLabel = 'Stakeholder';
$basePath = '/stakeholder';
$activePath = '/stakeholder/projects';
require_once __DIR__ . '/../partials/role-sidebar.php';
?>
        <a href="/stakeholder/dashboard" class="inline-flex items-center text-sm font-medium text-blue-700 hover:underline mb-5"><- Back to Dashboard</a>

        <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div class="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900 mb-2"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h1>
                    <p class="text-slate-500">Project ID: <?= htmlspecialchars($project->id, ENT_QUOTES, 'UTF-8') ?></p>
                </div>
                <span class="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
            </div>

            <p class="text-slate-700 leading-7 mb-6"><?= nl2br(htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8')) ?></p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div class="rounded-xl border border-slate-200 p-4">
                    <p class="text-xs uppercase tracking-wide text-slate-500">Deadline</p>
                    <p class="text-slate-900 font-semibold mt-1"><?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                </div>
                <div class="rounded-xl border border-slate-200 p-4 md:col-span-2">
                    <p class="text-xs uppercase tracking-wide text-slate-500">Content Types</p>
                    <p class="text-slate-900 font-semibold mt-1"><?= htmlspecialchars(implode(', ', $project->contentTypes), ENT_QUOTES, 'UTF-8') ?></p>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
                <form method="post" action="/stakeholder/projects/<?= urlencode($project->id) ?>/accept">
                    <button class="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">Accept Plan</button>
                </form>

                <form method="post" action="/stakeholder/projects/<?= urlencode($project->id) ?>/feedback" class="flex-1 flex gap-2">
                    <input type="text" name="feedback" placeholder="Request changes" class="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none" />
                    <button class="bg-amber-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-amber-600 transition">Send</button>
                </form>
            </div>
        </div>
<?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
