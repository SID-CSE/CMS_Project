<?php
/** @var array<string,mixed> $state */
/** @var array<string,mixed> $user */
/** @var string $roleLabel */
/** @var string $basePath */
/** @var bool $allowCreate */
$activePath = $basePath . '/finance';
$stats = $state['stats'] ?? ['total_spent' => '₹0', 'pending' => '₹0', 'last_payment' => '₹0'];
$transactions = $state['transactions'] ?? [];
$requests = $state['requests'] ?? [];
$counterparties = $state['counterparties'] ?? [];
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside class="border-r border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-2xl">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?> portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Finance</p>
            </div>
            <?php require_once __DIR__ . '/../partials/role-sidebar-nav.php'; ?>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars((string) ($user['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?> Finance</h2>
                </div>
                <span class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">State stored in session</span>
            </div>

            <section class="grid gap-4 md:grid-cols-3">
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p class="text-sm text-slate-500">Total Spent</p><p class="mt-2 text-3xl font-bold text-slate-900"><?= htmlspecialchars((string) $stats['total_spent'], ENT_QUOTES, 'UTF-8') ?></p></div>
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p class="text-sm text-slate-500">Pending</p><p class="mt-2 text-3xl font-bold text-amber-600"><?= htmlspecialchars((string) $stats['pending'], ENT_QUOTES, 'UTF-8') ?></p></div>
                <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p class="text-sm text-slate-500">Last Payment</p><p class="mt-2 text-3xl font-bold text-emerald-700"><?= htmlspecialchars((string) $stats['last_payment'], ENT_QUOTES, 'UTF-8') ?></p></div>
            </section>

            <div class="mt-6 grid gap-6 xl:grid-cols-2">
                <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 class="text-lg font-semibold text-slate-900">Transactions</h3>
                    <div class="mt-4 space-y-3">
                        <?php foreach ($transactions as $transaction): ?>
                            <div class="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                                <div class="flex items-center justify-between gap-4">
                                    <span class="font-semibold text-slate-900"><?= htmlspecialchars((string) ($transaction['title'] ?? 'Transaction'), ENT_QUOTES, 'UTF-8') ?></span>
                                    <span class="text-slate-500"><?= htmlspecialchars((string) ($transaction['amount'] ?? '₹0'), ENT_QUOTES, 'UTF-8') ?></span>
                                </div>
                                <p class="mt-1 text-slate-600"><?= htmlspecialchars((string) ($transaction['status'] ?? 'Pending'), ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                        <?php endforeach; ?>
                        <?php if (empty($transactions)): ?><p class="text-sm text-slate-500">No transactions yet.</p><?php endif; ?>
                    </div>
                </section>

                <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 class="text-lg font-semibold text-slate-900">Requests</h3>
                    <div class="mt-4 space-y-3">
                        <?php foreach ($requests as $request): ?>
                            <div class="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                                <div class="flex items-center justify-between gap-4">
                                    <span class="font-semibold text-slate-900"><?= htmlspecialchars((string) ($request['title'] ?? 'Request'), ENT_QUOTES, 'UTF-8') ?></span>
                                    <span class="text-slate-500"><?= htmlspecialchars((string) ($request['amount'] ?? '₹0'), ENT_QUOTES, 'UTF-8') ?></span>
                                </div>
                                <p class="mt-1 text-slate-600"><?= htmlspecialchars((string) ($request['status'] ?? 'Pending'), ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                        <?php endforeach; ?>
                        <?php if (empty($requests)): ?><p class="text-sm text-slate-500">No requests yet.</p><?php endif; ?>
                    </div>
                </section>
            </div>

            <section class="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 class="text-lg font-semibold text-slate-900">Counterparties</h3>
                <div class="mt-4 flex flex-wrap gap-3">
                    <?php foreach ($counterparties as $counterparty): ?>
                        <span class="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"><?= htmlspecialchars((string) $counterparty, ENT_QUOTES, 'UTF-8') ?></span>
                    <?php endforeach; ?>
                    <?php if (empty($counterparties)): ?><p class="text-sm text-slate-500">No counterparties yet.</p><?php endif; ?>
                </div>
            </section>
        </main>
    </div>
</div>


