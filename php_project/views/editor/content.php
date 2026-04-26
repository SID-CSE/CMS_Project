<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<\App\Models\ProjectRequest> $projects */
/** @var array<\App\Models\ProjectTask> $assignedTasks */
/** @var array<string,array<\App\Models\TaskAttachment>> $attachmentsByTask */
/** @var int $unreadNotifications */
/** @var int $unreadThreads */
$roleLabel = 'Editor';
$basePath = '/editor';
$activePath = '/editor/content';
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside class="border-r border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-2xl">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Editor portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Content library</p>
            </div>
            <?php require_once __DIR__ . '/../partials/role-sidebar-nav.php'; ?>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900">My Content</h2>
                    <p class="mt-2 text-sm text-slate-500">Tasks, submissions, and versions tied to your work queue.</p>
                </div>
                <div class="flex flex-wrap gap-3">
                    <a href="/editor/notifications" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Notifications<?php if (($unreadNotifications ?? 0) > 0): ?> (<?= (int) $unreadNotifications ?>)<?php endif; ?></a>
                    <a href="/editor/messages" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Messages<?php if (($unreadThreads ?? 0) > 0): ?> (<?= (int) $unreadThreads ?>)<?php endif; ?></a>
                    <a href="/editor/profile" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Profile</a>
                </div>
            </div>

            <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900">Assigned Content</h3>
                        <p class="text-sm text-slate-500">Open content items with the same route structure as the React app.</p>
                    </div>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= count($assignedTasks) ?> items</span>
                </div>

                <div class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <?php foreach ($assignedTasks as $task): ?>
                        <article class="rounded-2xl border border-slate-200 p-4">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <h4 class="text-base font-semibold text-slate-900"><?= htmlspecialchars($task->title, ENT_QUOTES, 'UTF-8') ?></h4>
                                    <p class="mt-1 text-xs text-slate-500">Project <?= htmlspecialchars($task->projectId, ENT_QUOTES, 'UTF-8') ?></p>
                                </div>
                                <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-700"><?= htmlspecialchars($task->status, ENT_QUOTES, 'UTF-8') ?></span>
                            </div>
                            <p class="mt-3 line-clamp-3 text-sm text-slate-600"><?= htmlspecialchars($task->description, ENT_QUOTES, 'UTF-8') ?></p>
                            <div class="mt-4 flex flex-wrap gap-2">
                                <a href="/editor/content/<?= urlencode($task->id) ?>/view" class="rounded-lg bg-[#1734a1] px-3 py-2 text-xs font-semibold text-white hover:bg-[#132b86]">Open Viewer</a>
                                <a href="/editor/content/<?= urlencode($task->id) ?>/versions" class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Versions</a>
                            </div>
                            <?php if (!empty($attachmentsByTask[$task->id])): ?>
                                <div class="mt-4 rounded-xl bg-slate-50 p-3">
                                    <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Attachments</p>
                                    <div class="mt-2 space-y-2">
                                        <?php foreach ($attachmentsByTask[$task->id] as $attachment): ?>
                                            <a href="<?= htmlspecialchars($attachment->filePath, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" class="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-[#1734a1] hover:bg-blue-50">
                                                <span><?= htmlspecialchars($attachment->originalName, ENT_QUOTES, 'UTF-8') ?></span>
                                            </a>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </article>
                    <?php endforeach; ?>
                </div>
            </section>

            <section class="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900">Recent Projects</h3>
                        <p class="text-sm text-slate-500">Cross-check the full project context around your content.</p>
                    </div>
                    <a href="/editor/projects" class="text-sm font-semibold text-[#1734a1] hover:underline">View Projects</a>
                </div>
                <div class="mt-4 grid gap-4 md:grid-cols-2">
                    <?php foreach ($projects as $project): ?>
                        <article class="rounded-2xl border border-slate-200 p-4">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <h4 class="font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h4>
                                    <p class="mt-1 text-xs text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                                </div>
                                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                            </div>
                            <p class="mt-3 line-clamp-3 text-sm text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                        </article>
                    <?php endforeach; ?>
                </div>
            </section>
        </main>
    </div>
</div>

