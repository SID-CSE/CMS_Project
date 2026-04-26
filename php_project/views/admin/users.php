<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<\App\Models\User> $users */
/** @var array<string,int> $roleCounts */
$roleLabel = 'Admin';
$basePath = '/admin';
$activePath = '/admin/users';
?>
<?php require_once __DIR__ . '/../partials/role-topbar.php'; ?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <?php require_once __DIR__ . '/../partials/role-sidebar.php'; ?>
            <div class="p-6 lg:p-10\">
            <div class="mx-auto max-w-6xl">
        <div class="mb-6 flex items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                <h2 class="mt-1 text-3xl font-bold text-slate-900">Manage Users</h2>
                <p class="mt-2 text-sm text-slate-500">User list and role distribution from the PHP database.</p>
            </div>
            <a href="/admin/dashboard" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Dashboard</a>
        </div>

        <section class="grid gap-4 md:grid-cols-3">
            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p class="text-sm text-slate-500">Admins</p><p class="mt-2 text-3xl font-bold text-slate-900"><?= (int) $roleCounts['ADMIN'] ?></p></div>
            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p class="text-sm text-slate-500">Editors</p><p class="mt-2 text-3xl font-bold text-slate-900"><?= (int) $roleCounts['EDITOR'] ?></p></div>
            <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p class="text-sm text-slate-500">Stakeholders</p><p class="mt-2 text-3xl font-bold text-slate-900"><?= (int) $roleCounts['STAKEHOLDER'] ?></p></div>
        </section>

        <section class="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 class="text-lg font-semibold text-slate-900">All Users</h3>
            <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead class="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                            <th class="px-4 py-3">Name</th>
                            <th class="px-4 py-3">Email</th>
                            <th class="px-4 py-3">Role</th>
                            <th class="px-4 py-3">Timezone</th>
                            <th class="px-4 py-3">Language</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 bg-white">
                        <?php foreach ($users as $row): ?>
                            <tr>
                                <td class="px-4 py-3 font-medium text-slate-900"><?= htmlspecialchars($row->name, ENT_QUOTES, 'UTF-8') ?></td>
                                <td class="px-4 py-3 text-slate-600"><?= htmlspecialchars($row->email, ENT_QUOTES, 'UTF-8') ?></td>
                                <td class="px-4 py-3"><span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($row->role, ENT_QUOTES, 'UTF-8') ?></span></td>
                                <td class="px-4 py-3 text-slate-600"><?= htmlspecialchars((string) ($row->timezone ?? ''), ENT_QUOTES, 'UTF-8') ?></td>
                                <td class="px-4 py-3 text-slate-600"><?= htmlspecialchars((string) ($row->language ?? ''), ENT_QUOTES, 'UTF-8') ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            </section>
            </div>
            </div>
    <?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
</div>

