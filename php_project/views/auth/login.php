<div class="min-h-screen flex flex-col items-center px-6 py-12" style="background-image: linear-gradient(to bottom right, #e0f2ff, #f0f9ff, #ffffff);">
    <div class="self-start mb-4">
        <a href="/" class="text-[#1734a1] text-2xl font-black italic tracking-tighter cursor-pointer">Contify</a>
    </div>

    <div class="bg-[#dcf0fb] border border-white rounded-[40px] p-10 w-full max-w-md shadow-lg flex flex-col items-center">
        <h2 class="text-[#1734a1] text-4xl font-bold mb-1 text-center">Welcome Back !</h2>
        <p class="text-[#1734a1] text-3xl font-bold mb-10">LogIn</p>

        <?php if (!empty($error)): ?>
            <div class="mb-6 p-3 w-full text-center bg-red-100 border border-red-400 text-red-700 rounded-full font-bold">
                <?= htmlspecialchars((string) $error, ENT_QUOTES, 'UTF-8') ?>
            </div>
        <?php endif; ?>

        <form class="w-full space-y-6" method="post" action="/login">
            <input
                type="email"
                name="email"
                placeholder="Email"
                required
                class="w-full bg-white/60 border border-blue-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-500"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                required
                class="w-full bg-white/60 border border-blue-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-500"
            />
            <button type="submit" class="w-full bg-[#1734a1] text-white py-3 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors">
                Login ->
            </button>
        </form>

        <a href="#" class="mt-6 text-slate-700 font-medium hover:text-[#1734a1] hover:underline">Forgot Password?</a>
    </div>
</div>
