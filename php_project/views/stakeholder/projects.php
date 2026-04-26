<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<\App\Models\ProjectRequest> $projects */
$roleLabel = 'Stakeholder';
$basePath = '/stakeholder';
$activePath = '/stakeholder/projects';
?>
<?php require_once __DIR__ . '/../partials/role-topbar.php'; ?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <?php require_once __DIR__ . '/../partials/role-sidebar.php'; ?>
            <div class="p-6 lg:p-10\">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900">Stakeholder Projects</h2>
                </div>
                <div class="flex flex-wrap gap-3">
                    <a href="/stakeholder/messages" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Messages</a>
                    <a href="/stakeholder/profile" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Profile</a>
                    <a href="/stakeholder/create-project-request" class="rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">New Request</a>
                </div>
            </div>

            <?php if (empty($projects)): ?>
                <section class="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                    <p class="text-slate-500">No projects yet.</p>
                    <a href="/stakeholder/create-project-request" class="mt-4 inline-block rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">Create your first request</a>
                </section>
            <?php else: ?>
                <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <?php foreach ($projects as $project): ?>
                        <article class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h3>
                                    <p class="mt-1 text-sm text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                                </div>
                                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                            </div>
                            <p class="mt-3 line-clamp-3 text-sm text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                            <div class="mt-4 flex items-center justify-between">
                                <span class="text-xs font-mono text-slate-500"><?= htmlspecialchars($project->id, ENT_QUOTES, 'UTF-8') ?></span>
                                <a href="/stakeholder/projects/<?= urlencode($project->id) ?>" class="text-sm font-semibold text-blue-700 hover:underline">View Details</a>
                            </div>
                        </article>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            </div>
    <?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
</div>


