<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<\App\Models\ProjectRequest> $projects */
?>
<?php
$roleLabel = 'Stakeholder';
$basePath = '/stakeholder';
$activePath = '/stakeholder/projects';
require_once __DIR__ . '/../partials/role-sidebar.php';
?>
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-3xl font-bold text-[#1734a1]">Dashboard</h1>
                <p class="text-slate-600 mt-1">Welcome, <?= htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8') ?></p>
            </div>
            <div class="flex gap-3">
                <a href="/stakeholder/projects/create" class="bg-[#1734a1] text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition">Create Project Request</a>
                <form action="/logout" method="post">
                    <button class="bg-black text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition">Logout</button>
                </form>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <?php foreach ($projects as $project): ?>
                <a href="/stakeholder/projects/<?= urlencode($project->id) ?>" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition block">
                    <div class="flex items-center justify-between mb-3">
                        <h2 class="text-xl font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h2>
                        <span class="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                    </div>
                    <p class="text-slate-600 mb-4 line-clamp-2"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                    <p class="text-sm text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                </a>
            <?php endforeach; ?>
        </div>
<?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>

