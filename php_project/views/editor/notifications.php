<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<array<string,mixed>> $notifications */
/** @var array<\App\Models\ProjectRequest> $projects */
/** @var int $unreadNotifications */
/** @var int $unreadThreads */
$roleLabel = 'Editor';
$basePath = '/editor';
$activePath = '/editor/notifications';
?>
<?php require_once __DIR__ . '/../partials/role-topbar.php'; ?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <?php require_once __DIR__ . '/../partials/role-sidebar.php'; ?>
            <div class="p-6 lg:p-10">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900">Notifications</h2>
                    <p class="mt-2 text-sm text-slate-500">Unread: <?= (int) $unreadNotifications ?> | Threads: <?= (int) $unreadThreads ?></p>
                </div>
                <div class="flex flex-wrap gap-3">
                    <a href="/editor/messages" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Messages</a>
                    <a href="/editor/profile" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Profile</a>
                    <a href="/editor/dashboard" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Dashboard</a>
                </div>
            </div>

            <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 class="text-lg font-semibold text-slate-900">Notification Feed</h3>
                <div class="mt-4 space-y-3">
                    <?php foreach ($notifications as $notification): ?>
                        <article class="rounded-2xl border border-slate-200 p-4 <?= !empty($notification['is_read']) ? 'bg-slate-50' : 'bg-blue-50/40' ?>">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars((string) ($notification['title'] ?? ''), ENT_QUOTES, 'UTF-8') ?></p>
                                    <p class="mt-1 text-xs text-slate-500"><?= htmlspecialchars((string) ($notification['message'] ?? ''), ENT_QUOTES, 'UTF-8') ?></p>
                                </div>
                                <?php if (empty($notification['is_read'])): ?>
                                    <span class="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">New</span>
                                <?php endif; ?>
                            </div>
                            <p class="mt-3 text-[11px] uppercase tracking-[0.14em] text-slate-400"><?= htmlspecialchars((string) ($notification['created_at'] ?? ''), ENT_QUOTES, 'UTF-8') ?></p>
                        </article>
                    <?php endforeach; ?>
                </div>
            </div>

            <aside class="space-y-6">
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 class="text-lg font-semibold text-slate-900">Quick Actions</h3>
                    <div class="mt-4 flex flex-wrap gap-3">
                        <a href="/editor/messages/compose" class="rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white hover:bg-[#132b86]">Compose Message</a>
                        <a href="/editor/notifications/read-all" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Mark All Read</a>
                    </div>
                </div>

                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 class="text-lg font-semibold text-slate-900">Relevant Projects</h3>
                    <div class="mt-4 space-y-3">
                        <?php foreach ($projects as $project): ?>
                            <article class="rounded-2xl border border-slate-200 p-4">
                                <div class="flex items-start justify-between gap-3">
                                    <div>
                                        <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></p>
                                        <p class="mt-1 text-xs text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                                    </div>
                                    <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                                </div>
                            </article>
                        <?php endforeach; ?>
                    </div>
                </div>
            </aside>
            </section>
            </div>
    <?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
</div>

