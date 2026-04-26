<?php
$roleLabel = 'Stakeholder';
$basePath = '/stakeholder';
$activePath = '/stakeholder/projects/create';
require_once __DIR__ . '/../partials/role-sidebar.php';
?>
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h1 class="text-3xl font-bold text-[#1734a1] mb-6">Create Project Request</h1>

        <?php if (!empty($_SESSION['flash_error'])): ?>
            <div class="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300"><?= htmlspecialchars((string) $_SESSION['flash_error'], ENT_QUOTES, 'UTF-8') ?></div>
            <?php unset($_SESSION['flash_error']); ?>
        <?php endif; ?>

        <form method="post" action="/stakeholder/projects/request" class="space-y-5">
            <div>
                <label for="title" class="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input id="title" type="text" name="title" required class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none" />
            </div>

            <div>
                <label for="description" class="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea id="description" name="description" rows="6" required class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"></textarea>
            </div>

            <div>
                <label for="content_types" class="block text-sm font-medium text-slate-700 mb-1">Content Types (comma-separated)</label>
                <input id="content_types" type="text" name="content_types" placeholder="Video Editing, Motion Graphics" class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none" />
            </div>

            <div>
                <label for="deadline" class="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                <input id="deadline" type="date" name="deadline" required class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none" />
            </div>

            <div class="flex items-center gap-3">
                <button type="submit" class="bg-[#1734a1] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition">Submit Request</button>
                <a href="/stakeholder/dashboard" class="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</a>
            </div>
        </form>
    </div>
<?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
