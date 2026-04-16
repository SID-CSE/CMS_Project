<?php $isSuccess = !empty($success); ?>
<div class="min-h-screen flex items-center justify-center px-6 py-10" style="background-image: linear-gradient(140deg, #eef6ff, #f9fbff);">
    <div class="forgot-card <?= $isSuccess ? 'active' : '' ?>">
        <style>
            .forgot-card {
                width: min(980px, 100%);
                min-height: 520px;
                background: #fff;
                border-radius: 28px;
                box-shadow: 0 25px 60px rgba(16, 42, 120, 0.16);
                position: relative;
                overflow: hidden;
            }
            .forgot-shell { display: flex; min-height: 520px; }
            .forgot-panel {
                width: 50%;
                padding: 42px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 16px;
            }
            .forgot-main { opacity: 1; transition: opacity .3s ease; }
            .forgot-success { opacity: 0; pointer-events: none; transition: opacity .3s ease; }
            .forgot-card.active .forgot-main { opacity: 0; pointer-events: none; }
            .forgot-card.active .forgot-success { opacity: 1; pointer-events: auto; }
            .forgot-overlay {
                position: absolute;
                top: 0;
                left: 50%;
                width: 50%;
                height: 100%;
                transition: transform .6s ease;
                transform: translateX(0);
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: #fff;
                padding: 34px;
                box-sizing: border-box;
                background-image:
                    linear-gradient(150deg, rgba(7, 24, 79, 0.8), rgba(13, 148, 136, 0.64)),
                    url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80');
                background-size: cover;
                background-position: center;
            }
            .forgot-card.active .forgot-overlay { transform: translateX(-100%); }
            @media (max-width: 900px) {
                .forgot-shell { display: block; }
                .forgot-panel { width: 100%; padding: 24px; }
                .forgot-main { opacity: 1 !important; pointer-events: auto !important; }
                .forgot-success { display: none; }
                .forgot-card.active .forgot-success { display: flex; opacity: 1; }
                .forgot-overlay { position: static; width: 100%; min-height: 220px; transform: none !important; }
            }
        </style>

        <div class="forgot-shell">
            <section class="forgot-panel forgot-main">
                <h2 class="text-4xl font-bold text-slate-900">Forgot Password</h2>
                <p class="text-slate-600">Enter your email and we will send reset instructions if your account exists.</p>

                <?php if (!empty($error)): ?>
                    <div class="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm font-medium">
                        <?= htmlspecialchars((string) $error, ENT_QUOTES, 'UTF-8') ?>
                    </div>
                <?php endif; ?>

                <form class="space-y-4" method="post" action="/forgot-password">
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                    />
                    <button type="submit" class="w-full rounded-xl bg-[#1734a1] text-white py-3 font-semibold hover:bg-blue-800 transition-colors">
                        Send Reset Link
                    </button>
                </form>

                <a href="/login" class="text-[#1734a1] font-semibold hover:underline">Back to Login</a>
            </section>

            <section class="forgot-panel forgot-success">
                <h3 class="text-3xl font-bold text-slate-900">Email Sent</h3>
                <p class="text-slate-600"><?= htmlspecialchars((string) ($success ?? 'If your account exists, reset instructions have been sent.'), ENT_QUOTES, 'UTF-8') ?></p>
                <a href="/login" class="w-full text-center rounded-xl bg-[#1734a1] text-white py-3 font-semibold hover:bg-blue-800 transition-colors">Continue to Login</a>
            </section>

            <aside class="forgot-overlay">
                <div>
                    <h3 class="text-4xl font-bold mb-3">Secure Recovery</h3>
                    <p class="text-white/90 leading-7 mb-5">We protect your account and only send reset links to verified email addresses.</p>
                    <?php if ($isSuccess): ?>
                        <a href="/forgot-password" class="inline-flex px-5 py-2.5 rounded-xl border border-white/70 font-semibold hover:bg-white/15">Send Another Link</a>
                    <?php endif; ?>
                </div>
            </aside>
        </div>
    </div>
</div>

