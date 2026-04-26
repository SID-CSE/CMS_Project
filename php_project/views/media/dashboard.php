<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var string $roleLabel */
/** @var array<\App\Models\ProjectRequest> $projects */
/** @var array<string,array<\App\Models\ProjectTask>> $tasks */
/** @var array<string,array<\App\Models\TaskAttachment>> $attachmentsByTask */
?>
<?php
$roleLabel = $roleLabel ?? 'Editor';
$roleKey = strtolower((string) $roleLabel);
if ($roleKey !== 'admin' && $roleKey !== 'stakeholder') {
    $roleKey = 'editor';
}
$basePath = '/' . $roleKey;
$activePath = $basePath . '/streaming';
$projectTitles = [];
foreach ($projects as $project) {
    $projectTitles[$project->id] = $project->title;
}

$flatAttachments = [];
foreach ($tasks as $projectId => $projectTasks) {
    foreach ($projectTasks as $task) {
        foreach ($attachmentsByTask[$task->id] ?? [] as $attachment) {
            $flatAttachments[] = [
                'attachment' => $attachment,
                'task' => $task,
                'projectTitle' => $projectTitles[$projectId] ?? $projectId,
            ];
        }
    }
}

usort($flatAttachments, static function (array $left, array $right): int {
    return strcmp((string) ($right['attachment']->createdAt ?? ''), (string) ($left['attachment']->createdAt ?? ''));
});
require_once __DIR__ . '/../partials/role-sidebar.php';
?>
        <div class="mb-6 flex items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?> media workspace</p>
                <h1 class="mt-1 text-3xl font-bold text-slate-900">Media Dashboard</h1>
                <p class="mt-2 text-sm text-slate-500">Cloud media viewer, video playback, and task stream panels in one SSR layout.</p>
            </div>
            <a href="javascript:history.back()" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back</a>
        </div>

        <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div class="space-y-6">
                <?php require_once __DIR__ . '/cloud-media-viewer.php'; ?>
                <?php require_once __DIR__ . '/video-player.php'; ?>
            </div>
            <div class="space-y-6">
                <?php require_once __DIR__ . '/task-stream-panel.php'; ?>
                <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h2 class="text-lg font-semibold text-slate-900">Recent Projects</h2>
                    <div class="mt-4 space-y-3">
                        <?php foreach ($projects as $project): ?>
                            <article class="rounded-2xl border border-slate-200 p-4">
                                <div class="flex items-start justify-between gap-3">
                                    <div>
                                        <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></p>
                                        <p class="mt-1 text-xs text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                                    </div>
                                    <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                                </div>
                            </article>
                        <?php endforeach; ?>
                    </div>
                </section>
            </div>
        </section>
<?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
