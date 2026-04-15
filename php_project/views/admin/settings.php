<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<string,mixed> $settings */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="mx-auto max-w-4xl p-6 lg:p-10">
        <div class="mb-6 flex items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                <h2 class="mt-1 text-3xl font-bold text-slate-900">Settings</h2>
                <p class="mt-2 text-sm text-slate-500">Session-backed admin settings for the PHP SSR build.</p>
            </div>
            <a href="/admin/dashboard" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Dashboard</a>
        </div>

        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <form method="post" action="/admin/settings/save" class="grid gap-4 md:grid-cols-2">
                <label class="grid gap-2">
                    <span class="text-sm font-semibold text-slate-700">Brand Name</span>
                    <input name="brand_name" value="<?= htmlspecialchars((string) ($settings['brand_name'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" class="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </label>
                <label class="grid gap-2">
                    <span class="text-sm font-semibold text-slate-700">Support Email</span>
                    <input name="support_email" value="<?= htmlspecialchars((string) ($settings['support_email'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" class="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </label>
                <label class="grid gap-2">
                    <span class="text-sm font-semibold text-slate-700">Default Timezone</span>
                    <input name="default_timezone" value="<?= htmlspecialchars((string) ($settings['default_timezone'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" class="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </label>
                <label class="grid gap-2">
                    <span class="text-sm font-semibold text-slate-700">Maintenance Mode</span>
                    <select name="maintenance_mode" class="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                        <option value="off" <?= (($settings['maintenance_mode'] ?? 'off') === 'off') ? 'selected' : '' ?>>Off</option>
                        <option value="on" <?= (($settings['maintenance_mode'] ?? '') === 'on') ? 'selected' : '' ?>>On</option>
                    </select>
                </label>
                <div class="md:col-span-2 flex justify-end">
                    <button class="rounded-xl bg-[#1734a1] px-5 py-3 text-sm font-semibold text-white hover:bg-[#132b86]">Save Settings</button>
                </div>
            </form>
        </section>
    </div>
</div>
