<?php
/** @var array<string,mixed> $user */
/** @var array<string,mixed> $profile */
/** @var array<int,array{to:string,label:string}> $tabs */
/** @var string $roleLabel */
/** @var string $basePath */
/** @var string $profileKey */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside class="border-r border-slate-200 bg-white p-6">
            <div class="mb-8">
                <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?> portal</div>
                <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-[#1734a1]">Contify</h1>
                <p class="mt-2 text-sm text-slate-500">Edit profile</p>
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
                    <h2 class="mt-1 text-3xl font-bold text-slate-900">Edit Profile</h2>
                </div>
                <a href="<?= htmlspecialchars($basePath, ENT_QUOTES, 'UTF-8') ?>" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Cancel</a>
            </div>

            <form method="post" action="<?= htmlspecialchars($basePath . '/save', ENT_QUOTES, 'UTF-8') ?>" class="space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div class="grid gap-5 md:grid-cols-2">
                    <div>
                        <label for="firstName" class="mb-2 block text-sm font-medium text-slate-700">First Name</label>
                        <input id="firstName" type="text" name="firstName" value="<?= htmlspecialchars((string) ($profile['firstName'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label for="lastName" class="mb-2 block text-sm font-medium text-slate-700">Last Name</label>
                        <input id="lastName" type="text" name="lastName" value="<?= htmlspecialchars((string) ($profile['lastName'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                </div>
                <div class="grid gap-5 md:grid-cols-2">
                    <div>
                        <label for="email" class="mb-2 block text-sm font-medium text-slate-700">Email</label>
                        <input id="email" type="email" name="email" value="<?= htmlspecialchars((string) ($profile['email'] ?? $user['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label for="location" class="mb-2 block text-sm font-medium text-slate-700">Location</label>
                        <input id="location" type="text" name="location" value="<?= htmlspecialchars((string) ($profile['location'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                </div>
                <div>
                    <label for="bio" class="mb-2 block text-sm font-medium text-slate-700">Bio</label>
                    <textarea id="bio" name="bio" rows="5" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"><?= htmlspecialchars((string) ($profile['bio'] ?? ''), ENT_QUOTES, 'UTF-8') ?></textarea>
                </div>
                <div class="grid gap-5 md:grid-cols-2">
                    <div>
                        <label for="fieldOne" class="mb-2 block text-sm font-medium text-slate-700">Field One</label>
                        <input id="fieldOne" type="text" name="fieldOne" value="" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label for="fieldTwo" class="mb-2 block text-sm font-medium text-slate-700">Field Two</label>
                        <input id="fieldTwo" type="text" name="fieldTwo" value="" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                </div>
                <div class="flex gap-3">
                    <button class="rounded-xl bg-[#1734a1] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800">Save Profile</button>
                    <a href="<?= htmlspecialchars($basePath, ENT_QUOTES, 'UTF-8') ?>" class="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Discard</a>
                </div>
            </form>
        </main>
    </div>
</div>
