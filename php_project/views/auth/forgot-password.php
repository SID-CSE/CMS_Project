<div class="min-h-screen flex flex-col items-center px-6 py-12" style="background-image: linear-gradient(to bottom right, #e0f2ff, #f0f9ff, #ffffff);">
    <div class="self-start mb-4">
        <a href="/" class="text-[#1734a1] text-2xl font-black italic tracking-tighter">Contify</a>
    </div>

    <div class="bg-[#dcf0fb] border border-white rounded-[40px] p-12 w-full max-w-md shadow-lg flex flex-col items-center">
        <h2 class="text-[#1734a1] text-4xl font-bold mb-12">Forgot Password</h2>

        <form class="w-full space-y-8" method="post" action="/forgot-password">
            <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                required
                class="w-full bg-white/60 border border-blue-300 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-500"
            />

            <button class="w-full bg-[#1734a1] text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg">
                Reset Password
            </button>
        </form>

        <p class="mt-20 text-slate-700 font-medium">
            Remember your Password? <a href="/login" class="text-[#1734a1] font-bold hover:underline">Login</a>
        </p>
    </div>
</div>
