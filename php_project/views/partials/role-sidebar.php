<div class="grid min-h-screen lg:grid-cols-[320px_1fr]">
    <aside class="border-r border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-2xl">
        <div class="mb-8">
            <div class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?> portal</div>
            <h1 class="mt-2 text-2xl font-black italic tracking-tighter text-white">Contify</h1>
            <p class="mt-2 text-sm text-slate-400"><?= htmlspecialchars($activePath, ENT_QUOTES, 'UTF-8') ?></p>
        </div>
        <?php require __DIR__ . '/role-sidebar-nav.php'; ?>
    </aside>

    <main class="p-6 lg:p-10">

