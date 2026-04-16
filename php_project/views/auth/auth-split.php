<?php
$activeForm = (string) ($activeForm ?? 'login');
if (!in_array($activeForm, ['login', 'signup', 'forgot'], true)) {
    $activeForm = 'login';
}

$role = strtoupper((string) ($role ?? 'STAKEHOLDER'));
$roleData = [
    'ADMIN' => [
        'label' => 'Admin',
        'image' => 'https://img.freepik.com/premium-vector/flat-design-illustration-female-admin-receiving-call-from-customer_608297-23864.jpg',
        'overlay_image' => 'https://img.freepik.com/premium-vector/flat-design-illustration-female-admin-receiving-call-from-customer_608297-23864.jpg',
        'blurb' => 'Manage teams, resources, and project workflows from one control center.',
    ],
    'EDITOR' => [
        'label' => 'Editor',
        'image' => 'https://illustrations.popsy.co/blue/video-call.svg',
        'overlay_image' => 'https://illustrations.popsy.co/blue/video-call.svg',
        'blurb' => 'Create and publish quality content while collaborating with your team.',
    ],
    'STAKEHOLDER' => [
        'label' => 'Stakeholder',
        'image' => 'https://illustrations.popsy.co/blue/shaking-hands.svg',
        'overlay_image' => 'https://illustrations.popsy.co/blue/shaking-hands.svg',
        'blurb' => 'Track outcomes, review progress, and guide project decisions confidently.',
    ],
];
if (!isset($roleData[$role])) {
    $role = 'STAKEHOLDER';
}

$roleOptions = array_keys($roleData);
$signupStep = $activeForm === 'signup' ? 'form' : 'role';

$initialOverlayTitle = 'New Here?';
$initialOverlayText = 'Create your account to collaborate with admins, editors, and stakeholders in one place.';
if ($activeForm === 'signup') {
    $initialOverlayTitle = $roleData[$role]['label'] . ' Sign Up';
    $initialOverlayText = $roleData[$role]['blurb'];
} elseif ($activeForm === 'forgot') {
    $initialOverlayTitle = 'Reset Access';
    $initialOverlayText = 'Use your registered email and we will send password reset instructions.';
}
?>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    body {
        margin: 0;
        font-family: 'Inter', sans-serif;
        background: radial-gradient(circle at 15% 15%, #dcecff 0%, transparent 35%),
                    radial-gradient(circle at 85% 80%, #defff2 0%, transparent 40%),
                    linear-gradient(140deg, #eef6ff, #f9fbff);
        min-height: 100vh;
    }

    .auth-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
    }

    .auth-main {
        width: min(1060px, 100%);
        min-height: 640px;
        background: #ffffff;
        border-radius: 28px;
        box-shadow: 0 25px 60px rgba(16, 42, 120, 0.16);
        position: relative;
        overflow: hidden;
        display: flex;
    }

    .auth-form-panel {
        width: 50%;
        padding: 52px 44px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 16px;
        transition: opacity 0.3s ease;
        z-index: 1;
    }

    .auth-signup-panel {
        opacity: 0;
        pointer-events: none;
        overflow: hidden;
    }

    .auth-main.active .auth-signup-panel {
        opacity: 1;
        pointer-events: auto;
    }

    .auth-main.active .auth-login-panel {
        opacity: 0;
        pointer-events: none;
    }

    .auth-stack {
        width: 100%;
        max-width: 420px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .left-step-track {
        width: 200%;
        display: flex;
        transform: translateX(0%);
        transition: transform 0.6s ease;
    }

    .left-step-track.show-forgot {
        transform: translateX(-50%);
    }

    .left-step {
        flex: 0 0 50%;
        width: 50%;
        padding-right: 0;
        box-sizing: border-box;
        opacity: 1;
        transition: opacity 0.35s ease;
    }

    .left-login-step {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
    }

    .left-step-track.show-forgot .left-login-step {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    .left-forgot-step {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    .left-step-track.show-forgot .left-forgot-step {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
    }

    .auth-title {
        margin: 0;
        font-size: 2rem;
        color: #0f1d3a;
        font-weight: 700;
    }

    .auth-subtitle {
        margin: 0;
        color: #5f6b84;
        font-size: 0.96rem;
    }

    .auth-field {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #dbe4ff;
        border-radius: 14px;
        padding: 12px 14px;
        font-size: 0.95rem;
        color: #0f1d3a;
        background: #ffffff;
        outline: none;
    }

    .password-wrap {
        position: relative;
        width: 100%;
    }

    .password-wrap .auth-field {
        padding-right: 54px;
    }

    .password-toggle {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        border: 0;
        background: transparent;
        color: #1e3a8a;
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 8px;
    }

    .password-toggle:hover {
        background: #eef2ff;
    }

    .auth-field:focus {
        border-color: #1d4ed8;
        box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.14);
    }

    .auth-btn {
        border: 0;
        border-radius: 12px;
        padding: 12px 14px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s ease;
    }

    .auth-btn-primary {
        background: linear-gradient(90deg, #1d4ed8, #1e3a8a);
        color: #fff;
    }

    .auth-btn-primary:hover {
        filter: brightness(1.05);
    }

    .auth-btn-ghost {
        background: rgba(255, 255, 255, 0.22);
        border: 1px solid rgba(255, 255, 255, 0.7);
        color: #fff;
    }

    .auth-btn-google {
        background: #ffffff;
        color: #1f2937;
        border: 1px solid #d1d5db;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .auth-links {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
        font-size: 0.9rem;
    }

    .auth-link {
        color: #1d4ed8;
        text-decoration: none;
        font-weight: 600;
    }

    .auth-link:hover {
        text-decoration: underline;
    }

    .auth-divider {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #7b879f;
        font-size: 0.85rem;
    }

    .auth-divider::before,
    .auth-divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e5eaf6;
    }

    .auth-flash {
        border-radius: 12px;
        padding: 10px 12px;
        font-size: 0.9rem;
        margin-bottom: 4px;
        border: 1px solid transparent;
    }

    .auth-flash-error {
        background: #fff1f2;
        border-color: #fecdd3;
        color: #9f1239;
    }

    .auth-flash-success {
        background: #ecfeff;
        border-color: #a5f3fc;
        color: #155e75;
    }

    .strength-wrap {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: -4px;
    }

    .strength-bar {
        width: 100%;
        height: 7px;
        border-radius: 999px;
        background: #e2e8f0;
        overflow: hidden;
    }

    .strength-fill {
        height: 100%;
        width: 0%;
        border-radius: 999px;
        background: #94a3b8;
        transition: width 0.25s ease, background-color 0.25s ease;
    }

    .strength-text {
        font-size: 0.8rem;
        font-weight: 600;
        color: #94a3b8;
    }

    .auth-overlay {
        position: absolute;
        top: 0;
        left: 50%;
        width: 50%;
        height: 100%;
        transition: transform 0.6s ease;
        transform: translateX(0);
        z-index: 3;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 38px;
        box-sizing: border-box;
        background-image:
            linear-gradient(150deg, rgba(7, 24, 79, 0.76), rgba(13, 148, 136, 0.62)),
            url('/assets/side-panel-default.png');
        background-size: cover;
        background-position: center;
    }

    .auth-main.active .auth-overlay {
        transform: translateX(-100%);
    }

    .auth-overlay h3 {
        margin: 0 0 10px;
        font-size: 2rem;
        font-weight: 700;
    }

    .auth-overlay p {
        margin: 0 0 18px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        font-size: 0.95rem;
    }

    .role-avatar {
        width: 110px;
        height: 110px;
        border-radius: 999px;
        object-fit: cover;
        border: 3px solid rgba(255, 255, 255, 0.7);
        margin-bottom: 16px;
        background: rgba(255, 255, 255, 0.2);
    }

    .signup-step-track {
        width: 200%;
        display: flex;
        transform: translateX(0%);
        transition: transform 0.6s ease;
    }

    .signup-step-track.show-form {
        transform: translateX(-50%);
    }

    .signup-step {
        flex: 0 0 50%;
        width: 50%;
        box-sizing: border-box;
        padding-right: 0;
        opacity: 1;
        transition: opacity 0.35s ease;
    }

    .signup-step-role {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
    }

    .signup-step-track.show-form .signup-step-role {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    .signup-step-form {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    .signup-step-track.show-form .signup-step-form {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
    }

    .role-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .role-card-btn {
        border: 1px solid #dbe4ff;
        background: #f8fbff;
        border-radius: 12px;
        padding: 10px 12px;
        cursor: pointer;
        transition: all 0.25s ease;
        color: #0f1d3a;
        font-weight: 600;
        font-size: 0.88rem;
        display: flex;
        align-items: center;
        gap: 10px;
        text-align: left;
    }

    .role-card-btn:hover {
        border-color: #1d4ed8;
        box-shadow: 0 10px 20px rgba(29, 78, 216, 0.12);
        transform: translateY(-2px);
    }

    .role-card-img {
        width: 44px;
        height: 44px;
        object-fit: cover;
        border-radius: 999px;
        margin: 0;
        display: inline-block;
        border: 2px solid #e6eeff;
        background: #ffffff;
    }

    .back-role-btn {
        margin-top: 12px;
        width: fit-content;
        padding: 0;
        display: inline-block;
    }

    @media (max-width: 900px) {
        .auth-main {
            min-height: auto;
            display: block;
        }

        .auth-form-panel,
        .auth-signup-panel,
        .auth-login-panel {
            width: 100%;
            padding: 32px 24px;
            opacity: 1;
            pointer-events: auto;
        }

        .auth-signup-panel {
            display: none;
        }

        .auth-main.active .auth-signup-panel {
            display: flex;
        }

        .auth-main.active .auth-login-panel {
            display: none;
        }

        .auth-overlay {
            position: static;
            width: 100%;
            min-height: 230px;
            transform: none !important;
        }
    }
</style>

<!-- Brand Header -->
<div style="width: 100%; border-bottom: 1px solid #e2e8f0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); padding: 16px 24px;">
    <div style="max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
        <a href="/" style="text-decoration: none;">
            <h1 style="font-size: 24px; font-weight: 900; font-style: italic; color: #1734a1; margin: 0;">Contify</h1>
        </a>
        <?php if (empty($_SESSION['user_id'])): ?>
            <a href="/" style="font-size: 14px; font-weight: 600; color: #1734a1; text-decoration: none; cursor: pointer;">← Back to Home</a>
        <?php endif; ?>
    </div>
</div>

<div class="auth-page">
    <div class="auth-main<?= $activeForm === 'signup' ? ' active' : '' ?>" id="authMain">
        <section class="auth-form-panel auth-login-panel" style="overflow: hidden;">
            <div class="left-step-track<?= $activeForm === 'forgot' ? ' show-forgot' : '' ?>" id="leftStepTrack">
                <div class="left-step left-login-step">
                    <div class="auth-stack">
                        <h2 class="auth-title">Welcome Back</h2>
                        <p class="auth-subtitle">Sign in to continue to your Contify dashboard.</p>

                        <?php if (!empty($error) && $activeForm === 'login'): ?>
                            <div class="auth-flash auth-flash-error"><?= htmlspecialchars((string) $error, ENT_QUOTES, 'UTF-8') ?></div>
                        <?php endif; ?>

                        <form method="post" action="/login" style="display:flex;flex-direction:column;gap:12px;">
                            <input class="auth-field" type="email" name="email" placeholder="Email" required />
                            <div class="password-wrap">
                                <input class="auth-field" type="password" name="password" id="loginPassword" placeholder="Password" required />
                                <button type="button" class="password-toggle" id="toggleLoginPassword">👁</button>
                            </div>
                            <button type="submit" class="auth-btn auth-btn-primary">Login</button>
                        </form>

                        <div class="auth-divider">or</div>
                        <button type="button" class="auth-btn auth-btn-google">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google" />
                            Continue with Google
                        </button>

                        <div class="auth-links">
                            <button type="button" class="auth-link" data-action="show-forgot" style="border:0;background:none;cursor:pointer;">Forgot Password?</button>
                            <button type="button" class="auth-link" data-action="show-signup" style="border:0;background:none;cursor:pointer;">Need an account?</button>
                        </div>
                    </div>
                </div>

                <div class="left-step left-forgot-step">
                    <div class="auth-stack">
                        <h2 class="auth-title">Forgot Password</h2>
                        <p class="auth-subtitle">Enter your email to receive reset instructions.</p>

                        <?php if (!empty($error) && $activeForm === 'forgot'): ?>
                            <div class="auth-flash auth-flash-error"><?= htmlspecialchars((string) $error, ENT_QUOTES, 'UTF-8') ?></div>
                        <?php endif; ?>
                        <?php if (!empty($success) && $activeForm === 'forgot'): ?>
                            <div class="auth-flash auth-flash-success"><?= htmlspecialchars((string) $success, ENT_QUOTES, 'UTF-8') ?></div>
                        <?php endif; ?>

                        <form method="post" action="/forgot-password" style="display:flex;flex-direction:column;gap:12px;">
                            <input class="auth-field" type="email" name="email" placeholder="you@example.com" required />
                            <button type="submit" class="auth-btn auth-btn-primary">Send Reset Link</button>
                        </form>

                        <button type="button" class="auth-link" data-action="show-login" style="border:0;background:none;cursor:pointer;">← Back to Login</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="auth-form-panel auth-signup-panel">
            <div class="signup-step-track<?= $signupStep === 'form' ? ' show-form' : '' ?>" id="signupStepTrack">
                <div class="signup-step signup-step-role">
                    <div class="auth-stack">
                        <h2 class="auth-title">Select Role</h2>
                        <p class="auth-subtitle">Choose your role first, then continue to sign up.</p>
                        <div class="role-grid">
                            <?php foreach ($roleOptions as $option): ?>
                                <button type="button" class="role-card-btn role-select" data-role="<?= htmlspecialchars($option, ENT_QUOTES, 'UTF-8') ?>">
                                    <img class="role-card-img" src="<?= htmlspecialchars($roleData[$option]['image'], ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($roleData[$option]['label'], ENT_QUOTES, 'UTF-8') ?>" />
                                    <?= htmlspecialchars($roleData[$option]['label'], ENT_QUOTES, 'UTF-8') ?>
                                </button>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>

                <div class="signup-step signup-step-form">
                    <div class="auth-stack">
                        <h2 class="auth-title">Create Account</h2>
                        <p class="auth-subtitle">Signing up as <span id="roleNameLabel"><?= htmlspecialchars($roleData[$role]['label'], ENT_QUOTES, 'UTF-8') ?></span>.</p>

                        <?php if (!empty($error) && $activeForm === 'signup'): ?>
                            <div class="auth-flash auth-flash-error"><?= htmlspecialchars((string) $error, ENT_QUOTES, 'UTF-8') ?></div>
                        <?php endif; ?>

                        <form method="post" action="/signup" style="display:flex;flex-direction:column;gap:12px;">
                            <input type="hidden" name="role" id="roleField" value="<?= htmlspecialchars($role, ENT_QUOTES, 'UTF-8') ?>" />
                            <input class="auth-field" type="text" name="name" placeholder="Full Name" required />
                            <input class="auth-field" type="email" name="email" placeholder="Email" required />
                            <div class="password-wrap">
                                <input class="auth-field" type="password" name="password" id="signupPassword" placeholder="Password" required minlength="6" />
                                <button type="button" class="password-toggle" id="toggleSignupPassword">👁</button>
                            </div>

                            <div class="strength-wrap">
                                <div class="strength-bar"><div class="strength-fill" id="strengthFill"></div></div>
                                <span class="strength-text" id="strengthText">Password strength: No password</span>
                            </div>

                            <button type="submit" class="auth-btn auth-btn-primary">Sign Up</button>
                        </form>

                        <div class="auth-divider">or</div>
                        <button type="button" class="auth-btn auth-btn-google">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google" />
                            Sign up with Google
                        </button>

                        <button type="button" class="auth-link back-role-btn" id="backToRoles" style="border:0;background:none;cursor:pointer;">← Back to role selection</button>
                    </div>
                </div>
            </div>
        </section>

        <aside class="auth-overlay" id="authOverlay">
            <div>
                <img class="role-avatar" id="overlayAvatar" src="<?= htmlspecialchars($roleData[$role]['overlay_image'] ?? $roleData[$role]['image'], ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($roleData[$role]['label'], ENT_QUOTES, 'UTF-8') ?>" style="display: <?= $activeForm === 'signup' ? 'inline-block' : 'none' ?>;" />
                <h3 id="overlayTitle"><?= htmlspecialchars($initialOverlayTitle, ENT_QUOTES, 'UTF-8') ?></h3>
                <p id="overlayText"><?= htmlspecialchars($initialOverlayText, ENT_QUOTES, 'UTF-8') ?></p>
                <button type="button" class="auth-btn auth-btn-ghost" id="overlayAction" data-action="<?= $activeForm === 'login' ? 'show-signup' : 'show-login' ?>">
                    <?= $activeForm === 'login' ? 'Sign Up' : 'Sign In' ?>
                </button>
            </div>
        </aside>
    </div>
</div>

<script>
    (function () {
        const ROLE_DATA = <?= json_encode($roleData, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;
        const authMain = document.getElementById('authMain');
        const leftStepTrack = document.getElementById('leftStepTrack');
        const signupTrack = document.getElementById('signupStepTrack');
        const roleField = document.getElementById('roleField');
        const roleNameLabel = document.getElementById('roleNameLabel');
        const overlayTitle = document.getElementById('overlayTitle');
        const overlayText = document.getElementById('overlayText');
        const overlayAction = document.getElementById('overlayAction');
        const overlayAvatar = document.getElementById('overlayAvatar');
        const authOverlay = document.getElementById('authOverlay');
        const passwordField = document.getElementById('signupPassword');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        const loginPasswordField = document.getElementById('loginPassword');
        const toggleLoginPassword = document.getElementById('toggleLoginPassword');
        const toggleSignupPassword = document.getElementById('toggleSignupPassword');

        let mode = <?= json_encode($activeForm) ?>;
        let signupStep = <?= json_encode($signupStep) ?>;

        function strengthForPassword(value) {
            const password = (value || '').trim();
            let score = 0;
            if (password.length >= 8) score += 1;
            if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
            if (/\d/.test(password)) score += 1;
            if (/[^A-Za-z0-9]/.test(password)) score += 1;

            if (!password.length) return { label: 'No password', color: '#94a3b8', width: '0%' };
            if (score <= 1) return { label: 'Weak', color: '#dc2626', width: '25%' };
            if (score === 2) return { label: 'Fair', color: '#d97706', width: '50%' };
            if (score === 3) return { label: 'Good', color: '#2563eb', width: '75%' };
            return { label: 'Strong', color: '#16a34a', width: '100%' };
        }

        function updateStrength() {
            if (!passwordField || !strengthFill || !strengthText) return;
            const strength = strengthForPassword(passwordField.value);
            strengthFill.style.width = strength.width;
            strengthFill.style.backgroundColor = strength.color;
            strengthText.style.color = strength.color;
            strengthText.textContent = `Password strength: ${strength.label}`;
        }

        function currentRole() {
            return roleField ? roleField.value : 'STAKEHOLDER';
        }

        function updateRoleMeta() {
            const role = currentRole();
            const roleMeta = ROLE_DATA[role] || ROLE_DATA.STAKEHOLDER;
            roleNameLabel.textContent = roleMeta.label;
            overlayAvatar.src = roleMeta.overlay_image || roleMeta.image;
            overlayAvatar.alt = roleMeta.label;
            if (mode === 'signup' && signupStep === 'form') {
                authOverlay.style.backgroundImage = "linear-gradient(150deg, rgba(7, 24, 79, 0.76), rgba(13, 148, 136, 0.62)), url('/assets/side-panel-default.png')";
                overlayAvatar.style.display = 'inline-block';
                overlayTitle.textContent = `${roleMeta.label} Sign Up`;
                overlayText.textContent = roleMeta.blurb;
            }
        }

        function syncState() {
            const isSignup = mode === 'signup';
            const isForgot = mode === 'forgot';

            authMain.classList.toggle('active', isSignup);
            leftStepTrack.classList.toggle('show-forgot', isForgot);
            signupTrack.classList.toggle('show-form', signupStep === 'form');

            if (isSignup) {
                overlayAction.textContent = 'Sign In';
                overlayAction.dataset.action = 'show-login';
                if (signupStep === 'form') {
                    updateRoleMeta();
                } else {
                    authOverlay.style.backgroundImage = "linear-gradient(150deg, rgba(7, 24, 79, 0.76), rgba(13, 148, 136, 0.62)), url('/assets/side-panel-default.png')";
                    overlayAvatar.style.display = 'none';
                    overlayTitle.textContent = 'Choose Your Role';
                    overlayText.textContent = 'Start by selecting Admin, Editor, or Stakeholder, then complete your signup details.';
                }
                return;
            }

            overlayAvatar.style.display = 'none';
            if (isForgot) {
                authOverlay.style.backgroundImage = "linear-gradient(150deg, rgba(7, 24, 79, 0.76), rgba(13, 148, 136, 0.62)), url('/assets/side-panel-forgot.png')";
                overlayTitle.textContent = 'Reset Access';
                overlayText.textContent = 'Use your registered email and we will send password reset instructions.';
                overlayAction.textContent = 'Sign In';
                overlayAction.dataset.action = 'show-login';
                return;
            }

            authOverlay.style.backgroundImage = "linear-gradient(150deg, rgba(7, 24, 79, 0.76), rgba(13, 148, 136, 0.62)), url('/assets/side-panel-default.png')";
            overlayTitle.textContent = 'New Here?';
            overlayText.textContent = 'Create your account to collaborate with admins, editors, and stakeholders in one place.';
            overlayAction.textContent = 'Sign Up';
            overlayAction.dataset.action = 'show-signup';
        }

        document.querySelectorAll('[data-action="show-signup"]').forEach((button) => {
            button.addEventListener('click', () => {
                mode = 'signup';
                signupStep = 'role';
                syncState();
            });
        });

        document.querySelectorAll('[data-action="show-login"]').forEach((button) => {
            button.addEventListener('click', () => {
                mode = 'login';
                signupStep = 'role';
                syncState();
            });
        });

        document.querySelectorAll('[data-action="show-forgot"]').forEach((button) => {
            button.addEventListener('click', () => {
                mode = 'forgot';
                syncState();
            });
        });

        document.querySelectorAll('.role-select').forEach((button) => {
            button.addEventListener('click', () => {
                if (roleField) {
                    roleField.value = button.dataset.role || 'STAKEHOLDER';
                }
                signupStep = 'form';
                mode = 'signup';
                syncState();
            });
        });

        const backToRoles = document.getElementById('backToRoles');
        if (backToRoles) {
            backToRoles.addEventListener('click', () => {
                signupStep = 'role';
                syncState();
            });
        }

        if (passwordField) {
            passwordField.addEventListener('input', updateStrength);
        }

        if (toggleLoginPassword && loginPasswordField) {
            toggleLoginPassword.addEventListener('click', () => {
                const nextType = loginPasswordField.type === 'password' ? 'text' : 'password';
                loginPasswordField.type = nextType;
                toggleLoginPassword.textContent = nextType === 'password' ? '👁' : 'Hide';
            });
        }

        if (toggleSignupPassword && passwordField) {
            toggleSignupPassword.addEventListener('click', () => {
                const nextType = passwordField.type === 'password' ? 'text' : 'password';
                passwordField.type = nextType;
                toggleSignupPassword.textContent = nextType === 'password' ? '👁' : 'Hide';
            });
        }

        updateStrength();
        syncState();
    }());
</script>

