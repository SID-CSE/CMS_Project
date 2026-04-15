<?php
$roles = [
    [
        'image' => 'https://illustrations.popsy.co/blue/video-call.svg',
        'role' => 'Editor',
        'description' => 'Build your portfolio and find exciting projects.',
        'buttonText' => 'Sign up as Editor',
    ],
    [
        'image' => 'https://img.freepik.com/premium-vector/flat-design-illustration-female-admin-receiving-call-from-customer_608297-23864.jpg',
        'role' => 'Admin',
        'description' => 'Manage teams and oversee platform operations.',
        'buttonText' => 'Sign up as Admin',
    ],
    [
        'image' => 'https://illustrations.popsy.co/blue/shaking-hands.svg',
        'role' => 'Stakeholder',
        'description' => 'Invest in projects and track strategic goals.',
        'buttonText' => 'Sign up as Stakeholder',
    ],
];
?>
<div class="min-h-screen flex flex-col items-center px-6 py-12 font-sans" style="background-image: linear-gradient(to bottom right, #e0f2ff, #f0f9ff, #ffffff);">
    <div class="w-full max-w-7xl flex items-center justify-between mb-16">
        <a href="/" class="text-[#1734a1] text-3xl font-black italic tracking-tighter">Contify</a>
        <a href="/" class="text-[#1734a1] font-bold hover:underline flex items-center gap-2"><- Exit</a>
    </div>

    <div class="text-center mb-16">
        <h1 class="text-[#1734a1] text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">Create Your Account</h1>
        <p class="text-[#1734a1] text-2xl font-medium opacity-80">How do you want to get started?</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl w-full justify-items-center">
        <?php foreach ($roles as $role): ?>
            <div class="bg-white/60 backdrop-blur-sm border border-blue-100 p-8 rounded-[40px] flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-2 w-full max-w-[320px] group">
                <div class="w-32 h-32 mb-6 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-inner group-hover:scale-105 transition-transform">
                    <img src="<?= htmlspecialchars($role['image'], ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($role['role'], ENT_QUOTES, 'UTF-8') ?>" class="w-full h-full object-cover" />
                </div>
                <h3 class="text-[#1734a1] text-2xl font-bold mb-3"><?= htmlspecialchars($role['role'], ENT_QUOTES, 'UTF-8') ?></h3>
                <p class="text-slate-600 text-sm mb-8 leading-relaxed h-12"><?= htmlspecialchars($role['description'], ENT_QUOTES, 'UTF-8') ?></p>
                <a href="/signup/<?= urlencode(strtolower($role['role'])) ?>" class="w-full bg-[#1734a1] text-white py-3 rounded-2xl font-bold hover:bg-blue-800 transition shadow-md mt-auto text-center" aria-label="<?= htmlspecialchars($role['buttonText'], ENT_QUOTES, 'UTF-8') ?>">
                    <span><?= htmlspecialchars($role['buttonText'], ENT_QUOTES, 'UTF-8') ?></span>
                </a>
            </div>
        <?php endforeach; ?>
    </div>

    <p class="mt-16 text-slate-500 font-medium">Already have an account? <a href="/login" class="text-[#1734a1] font-bold hover:underline">Log In</a></p>
</div>
