<?php
/** @var array<string,mixed> $user */
/** @var array<string,mixed> $profile */
/** @var array<int,array{to:string,label:string}> $tabs */
/** @var string $roleLabel */
/** @var string $basePath */
/** @var string $accent */
$accentClasses = [
    'blue' => 'bg-blue-50 text-blue-700 border-blue-100',
    'emerald' => 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'violet' => 'bg-violet-50 text-violet-700 border-violet-100',
];
$accentClass = $accentClasses[$accent] ?? $accentClasses['blue'];
$fullName = trim(((string) ($profile['firstName'] ?? '')) . ' ' . ((string) ($profile['lastName'] ?? '')));
if ($fullName === '') {
    $fullName = (string) ($user['name'] ?? $roleLabel . ' User');
}
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside class="border-r border-slate-200 bg-white p-6">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?> portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Profile center</p>
            </div>
            <nav class="space-y-2 text-sm font-medium text-slate-700">
                <?php foreach ($tabs as $tab): ?>
                    <a href="<?= htmlspecialchars($tab['to'], ENT_QUOTES, 'UTF-8') ?>" class="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-[#1734a1]" aria-label="Open <?= htmlspecialchars($tab['label'], ENT_QUOTES, 'UTF-8') ?> page">
                        <span><?= htmlspecialchars($tab['label'], ENT_QUOTES, 'UTF-8') ?></span>
                    </a>
                <?php endforeach; ?>
            </nav>
        </aside>

        <main class="p-6 lg:p-10">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars((string) ($user['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900">Profile</h2>
                </div>
                <a href="<?= htmlspecialchars($basePath . '/edit', ENT_QUOTES, 'UTF-8') ?>" class="rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">Edit Profile</a>
            </div>

            <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-4">
                        <div class="flex h-20 w-20 items-center justify-center rounded-full border text-xl font-semibold <?= $accentClass ?>">
                            <?= strtoupper(substr((string) ($profile['firstName'] ?? $roleLabel), 0, 2)) ?>
                        </div>
                        <div>
                            <h3 class="text-2xl font-semibold text-slate-900"><?= htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8') ?></h3>
                            <p class="mt-1 text-sm text-slate-500"><?= htmlspecialchars((string) ($profile['email'] ?? $user['email'] ?? 'No email added'), ENT_QUOTES, 'UTF-8') ?></p>
                            <p class="mt-1 text-sm text-slate-500"><?= htmlspecialchars((string) ($profile['location'] ?? 'Location not provided'), ENT_QUOTES, 'UTF-8') ?></p>
                        </div>
                    </div>
                    <div class="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
                        <span class="font-semibold text-slate-900">Role:</span> <?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?>
                    </div>
                </div>
            </section>

            <section class="mt-6 grid gap-4 lg:grid-cols-2">
                <?php foreach (array_slice($tabs, 0, 2) as $tab): ?>
                    <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <h4 class="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500"><?= htmlspecialchars($tab['label'], ENT_QUOTES, 'UTF-8') ?></h4>
                        <p class="mt-3 whitespace-pre-wrap text-sm text-slate-700"><?= htmlspecialchars((string) ($profile[strtolower(str_replace(' ', '', $tab['label']))] ?? 'Not provided yet.'), ENT_QUOTES, 'UTF-8') ?></p>
                    </div>
                <?php endforeach; ?>
            </section>

            <section class="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <h4 class="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Professional Bio</h4>
                <p class="mt-3 whitespace-pre-wrap text-sm text-slate-700"><?= htmlspecialchars((string) ($profile['bio'] ?? 'No bio available.'), ENT_QUOTES, 'UTF-8') ?></p>
            </section>
        </main>
    </div>
</div>
