<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var \App\Models\ProjectRequest $project */
/** @var array<\App\Models\ProjectTask> $tasks */
/** @var array<string,array<\App\Models\TaskAttachment>> $attachmentsByTask */

$roleLabel = 'Stakeholder';
$basePath = '/stakeholder';
$activePath = '/stakeholder/projects';
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside aria-label="Stakeholder navigation" class="border-r border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-2xl">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Stakeholder portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-white">Contify</h1>
                <p class="mt-2 text-sm text-slate-400">Project view</p>
            </div>
            <?php require_once __DIR__ . '/../partials/role-sidebar-nav.php'; ?>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h2>
                    <p class="mt-2 text-sm text-slate-500">Project details and status timeline</p>
                </div>
                <div class="flex flex-wrap gap-3">
                    <a href="/stakeholder/messages" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Messages</a>
                    <a href="/stakeholder/profile" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Profile</a>
                    <a href="/stakeholder/projects" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Projects</a>
                </div>
            </div>

            <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div class="grid gap-4 md:grid-cols-3">
                    <div class="rounded-2xl bg-slate-50 p-4">
                        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                        <p class="mt-2 text-lg font-semibold text-slate-900"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></p>
                    </div>
                    <div class="rounded-2xl bg-slate-50 p-4">
                        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Deadline</p>
                        <p class="mt-2 text-lg font-semibold text-slate-900"><?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                    </div>
                    <div class="rounded-2xl bg-slate-50 p-4">
                        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Project ID</p>
                        <p class="mt-2 text-sm font-mono text-slate-900"><?= htmlspecialchars($project->id, ENT_QUOTES, 'UTF-8') ?></p>
                    </div>
                </div>

                <div class="mt-6">
                    <h3 class="text-lg font-semibold text-slate-900">Description</h3>
                    <p class="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                </div>

                <div class="mt-6">
                    <h3 class="text-lg font-semibold text-slate-900">Task Progress</h3>
                    <?php if ($tasks === []): ?>
                        <p class="mt-2 text-sm text-slate-500">No tasks have been assigned yet.</p>
                    <?php else: ?>
                        <div class="mt-3 space-y-3">
                            <?php foreach ($tasks as $task): ?>
                                <article class="rounded-2xl border border-slate-200 p-4">
                                    <div class="flex items-start justify-between gap-3">
                                        <div>
                                            <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($task->title, ENT_QUOTES, 'UTF-8') ?></p>
                                            <p class="text-xs text-slate-500">Editor: <?= htmlspecialchars($task->assigneeEmail, ENT_QUOTES, 'UTF-8') ?></p>
                                        </div>
                                        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($task->status, ENT_QUOTES, 'UTF-8') ?></span>
                                    </div>
                                    <?php if ($task->submissionNote !== null && $task->submissionNote !== ''): ?>
                                        <p class="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">Submission: <?= htmlspecialchars($task->submissionNote, ENT_QUOTES, 'UTF-8') ?></p>
                                    <?php endif; ?>
                                    <?php if (!empty($attachmentsByTask[$task->id])): ?>
                                        <div class="mt-2 rounded-lg bg-slate-50 p-3">
                                            <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Attachments</p>
                                            <div class="mt-2 space-y-2">
                                                <?php foreach ($attachmentsByTask[$task->id] as $attachment): ?>
                                                    <a href="<?= htmlspecialchars($attachment->filePath, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" class="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-[#1734a1] hover:bg-blue-50" aria-label="Open attachment <?= htmlspecialchars($attachment->originalName, ENT_QUOTES, 'UTF-8') ?>">
                                                        <span><?= htmlspecialchars($attachment->originalName, ENT_QUOTES, 'UTF-8') ?></span>
                                                    </a>
                                                <?php endforeach; ?>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                </article>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="mt-6 flex flex-wrap gap-3">
                    <?php if ($project->status === 'PLAN_SENT'): ?>
                        <form method="post" action="/stakeholder/projects/<?= urlencode($project->id) ?>/accept">
                            <button class="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Accept Plan</button>
                        </form>
                    <?php endif; ?>
                    <form method="post" action="/stakeholder/projects/<?= urlencode($project->id) ?>/feedback" class="flex flex-1 gap-3 min-w-65">
                        <input type="text" name="feedback" placeholder="Request changes" class="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                        <button class="rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600">Send</button>
                    </form>
                </div>

                <?php if ($project->status === 'DELIVERED' || $project->status === 'SIGNED_OFF'): ?>
                    <form method="post" action="/stakeholder/projects/<?= urlencode($project->id) ?>/signoff" class="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <h4 class="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-800">Delivery Review</h4>
                        <div class="mt-3 grid gap-3 md:grid-cols-[200px_1fr]">
                            <div>
                                <label for="rating" class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Rating (1-5)</label>
                                <input id="rating" name="rating" type="number" min="1" max="5" value="<?= htmlspecialchars((string) ($project->stakeholderRating ?? ''), ENT_QUOTES, 'UTF-8') ?>" class="w-full rounded-xl border border-emerald-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                            </div>
                            <div>
                                <label for="signoff_feedback" class="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Feedback</label>
                                <input id="signoff_feedback" name="feedback" value="<?= htmlspecialchars((string) ($project->stakeholderFeedback ?? ''), ENT_QUOTES, 'UTF-8') ?>" placeholder="Optional sign-off feedback" class="w-full rounded-xl border border-emerald-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                            </div>
                        </div>
                        <button class="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Approve & Sign Off</button>
                    </form>
                <?php endif; ?>
            </section>
        </main>
    </div>
</div>


