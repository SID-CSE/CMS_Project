<?php
/** @var string $roleLabel */
/** @var array<string,mixed> $user */
/** @var array<int,array<string,mixed>> $threads */
/** @var array<int,array<string,mixed>> $messages */
/** @var array<int,array<string,mixed>> $contacts */
/** @var array<int,array<string,mixed>> $projects */
/** @var array<\App\Models\Notification> $notifications */
/** @var int $unreadNotifications */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside class="border-r border-slate-200 bg-white p-6">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?> portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Messages</p>
            </div>
            <p class="text-sm text-slate-500">Signed in as <?= htmlspecialchars((string) ($user['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?></p>
        </aside>

        <main class="p-6 lg:p-10">
            <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <h2 class="text-3xl font-bold text-slate-900">Notifications & Messages</h2>
                    <?php if (($unreadNotifications ?? 0) > 0): ?>
                        <form method="post" action="/notifications/read-all">
                            <button class="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 hover:bg-slate-50">Mark all as read (<?= (int) $unreadNotifications ?>)</button>
                        </form>
                    <?php endif; ?>
                </div>
                <p class="mt-2 text-sm text-slate-500">Workflow updates now persist in the database and appear here.</p>

                <?php if (($notifications ?? []) === []): ?>
                    <p class="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No notifications yet.</p>
                <?php else: ?>
                    <div class="mt-6 space-y-3">
                        <?php foreach ($notifications as $notification): ?>
                            <?php
                                $level = strtoupper($notification->level);
                                $badgeClass = 'bg-slate-100 text-slate-700';
                                if ($level === 'SUCCESS') {
                                    $badgeClass = 'bg-emerald-100 text-emerald-700';
                                } elseif ($level === 'WARNING') {
                                    $badgeClass = 'bg-amber-100 text-amber-700';
                                } elseif ($level === 'ERROR') {
                                    $badgeClass = 'bg-rose-100 text-rose-700';
                                }
                            ?>
                            <article class="rounded-2xl border border-slate-200 p-4">
                                <div class="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($notification->title, ENT_QUOTES, 'UTF-8') ?></h3>
                                        <p class="mt-1 text-sm text-slate-600"><?= htmlspecialchars($notification->body, ENT_QUOTES, 'UTF-8') ?></p>
                                    </div>
                                    <div class="text-right">
                                        <span class="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] <?= $badgeClass ?>"><?= htmlspecialchars($level, ENT_QUOTES, 'UTF-8') ?></span>
                                        <p class="mt-2 text-xs text-slate-500"><?= htmlspecialchars($notification->createdAt, ENT_QUOTES, 'UTF-8') ?></p>
                                    </div>
                                </div>
                                <?php if (!$notification->isRead): ?>
                                    <form method="post" action="/notifications/<?= urlencode($notification->id) ?>/read" class="mt-3">
                                        <button class="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:opacity-90">Mark as read</button>
                                    </form>
                                <?php endif; ?>
                                <?php if ($notification->projectId !== null): ?>
                                    <p class="mt-2 text-xs text-slate-500">Project ID: <span class="font-mono"><?= htmlspecialchars($notification->projectId, ENT_QUOTES, 'UTF-8') ?></span></p>
                                <?php endif; ?>
                            </article>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </section>
        </main>
    </div>
</div>

