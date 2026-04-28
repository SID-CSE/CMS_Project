<?php
$menuData = [
    'Platform' => ['Dashboard', 'Analytics', 'Workflow Builder', 'API Access'],
    'Features' => ['Video Editing', 'Collaboration Tools', 'Automated Ledgers', 'Feedback Loops'],
    'Solutions' => ['For Editors', 'For Stakeholders', 'For Agencies', 'Enterprise'],
    'Community' => ['Forum', 'Events', 'Success Stories', 'Blog'],
];
?>
<div class="min-h-screen text-slate-800 font-sans" style="background-image: linear-gradient(to bottom, #e0f2ff, #ffffff);">
    <nav class="flex justify-between items-center px-10 py-4 bg-white/30 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
        <div class="flex gap-6 text-[#1734a1] font-semibold">
            <span class="hover:underline cursor-pointer">Updates</span>
            <span class="hover:underline cursor-pointer">Legal Guide</span>
            <span class="hover:underline cursor-pointer">About Us</span>
            <span class="hover:underline cursor-pointer">Services</span>
        </div>
        <div class="flex gap-4">
            <a href="/login" class="bg-black text-white px-8 py-1.5 rounded-full text-sm font-medium hover:opacity-80 transition">LogIn</a>
            <a href="/signup" class="bg-[#1734a1] text-white px-8 py-1.5 rounded-full text-sm font-medium hover:bg-blue-800 transition">SignUp</a>
        </div>
    </nav>

    <div class="flex justify-end gap-8 px-16 py-6 font-medium text-slate-700 relative">
        <?php foreach ($menuData as $menu => $items): ?>
            <div class="relative group">
                <span class="cursor-pointer hover:text-blue-600 transition flex items-center gap-1">
                    <?= htmlspecialchars($menu, ENT_QUOTES, 'UTF-8') ?> <?= $menu !== 'Community' ? 'v' : '' ?>
                </span>
                <div class="hidden group-hover:block absolute top-10 right-0 w-98 bg-white border border-blue-100 shadow-xl rounded-2xl p-4 z-40">
                    <ul class="space-y-3">
                        <?php foreach ($items as $item): ?>
                            <li class="text-sm text-slate-600 hover:text-[#1734a1] cursor-pointer hover:font-bold transition-all">
                                <?= htmlspecialchars($item, ENT_QUOTES, 'UTF-8') ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <header class="flex flex-col md:flex-row items-center justify-between px-16 py-10 max-w-7xl mx-auto">
        <div class="md:w-1/2 space-y-6">
            <h1 class="text-[#1734a1] text-6xl font-black italic tracking-tighter">Contify</h1>
            <h2 class="text-4xl md:text-5xl font-bold leading-tight text-slate-900">Where Content <br /> Meets Collaboration</h2>
            <p class="text-lg text-slate-600 max-w-md">The all-in-one ecosystem for stakeholders to commission, admins to manage, and editors to produce world-class video content.</p>
            <div class="flex gap-4 pt-4">
                <a href="/signup" class="bg-[#1734a1] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-800 transition">Find your Role</a>
                <button class="bg-[#4d6ecf] text-white px-6 py-3 rounded-lg font-medium shadow-md">Find Your Next Project</button>
            </div>
        </div>
        <div class="md:w-1/2 flex justify-end">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/content-creator-making-video-illustration-download-in-svg-png-gif-file-formats--blogger-logo-like-influencer-pack-science-technology-illustrations-3605633.png" alt="Hero" class="drop-shadow-2xl" style="width: 600px;" />
        </div>
    </header>

    <section class="text-center py-16 px-6 bg-white/40">
        <p class="text-2xl font-medium text-slate-800 max-w-2xl mx-auto italic">"Celebrate success, encourage growth, and strengthen your workplace culture."</p>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 px-16 max-w-7xl mx-auto mb-20">
        <div class="bg-white/80 p-8 rounded-[40px] border border-blue-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center text-center group">
            <div class="w-32 h-32 mb-6 flex items-center justify-center bg-blue-50 rounded-full group-hover:scale-110 transition-transform">
                <img src="https://illustrations.popsy.co/blue/shaking-hands.svg" alt="Editor Collaboration" class="w-24 h-24 object-contain" />
            </div>
            <h3 class="text-xl font-bold mb-2 text-[#1734a1]">Editor Collaboration</h3>
            <p class="text-slate-600 text-sm">Scale your video productions with seamless team integration.</p>
        </div>

        <div class="bg-white/80 p-8 rounded-[40px] border border-blue-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center text-center group">
            <div class="w-32 h-32 mb-6 flex items-center justify-center bg-blue-50 rounded-full group-hover:scale-110 transition-transform">
                <img src="https://static.vecteezy.com/system/resources/previews/017/585/169/large_2x/customer-feedback-and-user-experience-illustration-characters-giving-review-to-customer-service-operator-choosing-emoji-to-show-satisfaction-rating-and-filling-survey-form-flat-illustration-vector.jpg" alt="Give Feedback" class="w-24 h-24 object-contain" />
            </div>
            <h3 class="text-xl font-bold mb-2 text-[#1734a1]">Give Feedback</h3>
            <p class="text-slate-600 text-sm">Real-time frame-accurate feedback for editors and stakeholders.</p>
        </div>

        <div class="bg-white/80 p-8 rounded-[40px] border border-blue-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center text-center group">
            <div class="w-32 h-32 mb-6 flex items-center justify-center bg-blue-50 rounded-full group-hover:scale-110 transition-transform">
                <img src="https://illustrations.popsy.co/blue/digital-nomad.svg" alt="Automated Ledger" class="w-24 h-24 object-contain" />
            </div>
            <h3 class="text-xl font-bold mb-2 text-[#1734a1]">Automated Ledger</h3>
            <p class="text-slate-600 text-sm">Transparent payments that flow without invoice headaches.</p>
        </div>
    </section>

    <div class="flex justify-center gap-6 mb-32">
        <a href="/signup" class="bg-[#1734a1] text-white px-10 py-3 rounded-lg text-xl flex items-center gap-2 hover:bg-blue-800 hover:scale-105 transition-all">
            Get Started <span>-></span>
        </a>
    </div>

    <footer class="w-full bg-white/50 pt-16">
        <div class="max-w-7xl mx-auto px-16 grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
                <h4 class="font-bold text-lg mb-6">New to Contify ?</h4>
                <ul class="space-y-2 text-[#1734a1] font-semibold">
                    <li class="cursor-pointer hover:underline">What is Contify?</li>
                    <li class="cursor-pointer hover:underline">Stakeholders</li>
                    <li class="cursor-pointer hover:underline">Admin</li>
                    <li class="cursor-pointer hover:underline">Editors</li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold text-lg mb-6">Quick Links</h4>
                <ul class="space-y-2 text-[#1734a1] font-semibold">
                    <li class="cursor-pointer hover:underline">Home</li>
                    <li class="cursor-pointer hover:underline">About Us</li>
                </ul>
            </div>
        </div>
        <div class="border-t border-blue-200 py-6 px-16 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-2 text-slate-600"><span>Email</span> support@contify.com</div>
            <div class="flex gap-6 text-xl text-slate-700">
                <span class="cursor-pointer hover:text-blue-600 transition">X</span>
                <span class="cursor-pointer hover:text-blue-600 transition">Facebook</span>
                <a href="https://www.linkedin.com/in/muskan-kumari-497351285/" class="hover:text-blue-600 transition underline">LinkedIn</a>
            </div>
        </div>
        <div class="bg-[#1734a1] text-white py-3 text-center font-medium italic">@ 2026 Contify</div>
    </footer>
</div>
