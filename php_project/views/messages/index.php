<?php
/** @var string $roleLabel */
/** @var array<string,mixed> $user */
/** @var array<int,array<string,mixed>> $threads */
/** @var array<int,array<string,mixed>> $contacts */
/** @var array<int,\App\Models\ProjectRequest> $projects */
/** @var \App\Models\MessageThread|null $selectedThread */
/** @var string $selectedThreadId */
/** @var array<int,\App\Models\Message> $selectedMessages */
/** @var array{id:string,name:string,email:string,role:string}|null $selectedCounterpart */
/** @var bool $composeMode */
/** @var string $selectedRecipientEmail */
/** @var string|null $flashError */
/** @var string|null $flashSuccess */
/** @var int $unreadThreads */
/** @var string $pollUrl */
/** @var string $stateFingerprint */
?>
<?php
$roleKey = strtolower((string) ($user['role'] ?? 'stakeholder'));
$basePath = '/' . $roleKey;
$activePath = $basePath . '/messages';

$contactsByEmail = [];
foreach ($contacts as $contact) {
    $email = strtolower((string) ($contact['email'] ?? ''));
    if ($email !== '') {
        $contactsByEmail[$email] = $contact;
    }
}
$prefilledContact = $selectedRecipientEmail !== '' ? ($contactsByEmail[strtolower($selectedRecipientEmail)] ?? null) : null;

$formatTimestamp = static function (?string $value): string {
    if ($value === null || trim($value) === '') {
        return '';
    }
    $timestamp = strtotime($value);
    return $timestamp !== false ? date('d M, h:i A', $timestamp) : $value;
};

$avatarText = static function (string $value): string {
    $parts = preg_split('/\s+/', trim($value)) ?: [];
    $parts = array_values(array_filter($parts, static fn (string $part): bool => $part !== ''));
    if ($parts === []) {
        return '?';
    }
    if (count($parts) === 1) {
        return strtoupper(substr($parts[0], 0, 1));
    }
    return strtoupper(substr($parts[0], 0, 1) . substr($parts[1], 0, 1));
};
require_once __DIR__ . '/../partials/role-sidebar.php';
?>
        <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?> inbox</p>
                <h1 class="mt-1 text-3xl font-bold text-slate-900">Messages</h1>
                <p class="mt-2 text-sm text-slate-500"><?= (int) $unreadThreads ?> unread conversation(s)</p>
            </div>
            <a href="<?= htmlspecialchars($basePath . '/messages?compose=1', ENT_QUOTES, 'UTF-8') ?>" class="rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white hover:bg-[#132b86]">New chat</a>
        </div>

        <?php if ($flashError !== null && $flashError !== ''): ?>
            <div class="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><?= htmlspecialchars($flashError, ENT_QUOTES, 'UTF-8') ?></div>
        <?php endif; ?>
        <?php if ($flashSuccess !== null && $flashSuccess !== ''): ?>
            <div class="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"><?= htmlspecialchars($flashSuccess, ENT_QUOTES, 'UTF-8') ?></div>
        <?php endif; ?>

        <section class="js-messages-inbox overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-slate-200 lg:grid lg:grid-cols-[360px_1fr]" data-poll-url="<?= htmlspecialchars($pollUrl, ENT_QUOTES, 'UTF-8') ?>" data-state-fingerprint="<?= htmlspecialchars($stateFingerprint, ENT_QUOTES, 'UTF-8') ?>" data-compose-mode="<?= $composeMode ? '1' : '0' ?>">
            <aside class="border-r border-slate-200 bg-[#111b21] text-white">
                <div class="border-b border-white/10 px-5 py-5">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300"><?= htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8') ?> chat</p>
                            <h2 class="mt-2 text-2xl font-semibold text-white">Conversations</h2>
                            <p class="mt-1 text-sm text-slate-300">Connect across all roles from one inbox.</p>
                        </div>
                        <a href="<?= htmlspecialchars($basePath . '/messages?compose=1', ENT_QUOTES, 'UTF-8') ?>" class="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/15">New</a>
                    </div>

                    <div class="mt-4 flex items-center gap-2 rounded-2xl bg-white/8 px-4 py-3 text-slate-300 ring-1 ring-white/8">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" class="js-thread-search w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400" placeholder="Search conversations" />
                    </div>

                    <form method="get" action="<?= htmlspecialchars($basePath . '/messages', ENT_QUOTES, 'UTF-8') ?>" class="mt-4 rounded-2xl bg-white/6 p-3 ring-1 ring-white/8">
                        <input type="hidden" name="compose" value="1" />
                        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Start new chat</p>
                        <div class="mt-3 grid gap-2">
                            <select name="recipient_email" class="rounded-xl border border-white/10 bg-[#1f2c34] px-3 py-2 text-sm text-white outline-none">
                                <option value="">Select contact</option>
                                <?php foreach ($contacts as $contact): ?>
                                    <?php $contactEmail = (string) ($contact['email'] ?? ''); ?>
                                    <?php $contactName = (string) ($contact['name'] ?? $contactEmail); ?>
                                    <option value="<?= htmlspecialchars($contactEmail, ENT_QUOTES, 'UTF-8') ?>" <?= strtolower($selectedRecipientEmail) === strtolower($contactEmail) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($contactName, ENT_QUOTES, 'UTF-8') ?> (<?= htmlspecialchars($contactEmail, ENT_QUOTES, 'UTF-8') ?>)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <button class="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400">Open compose</button>
                        </div>
                    </form>
                </div>

                <div class="max-h-[calc(100vh-290px)] overflow-y-auto px-3 py-3">
                    <?php if ($threads === []): ?>
                        <div class="rounded-3xl bg-white/6 p-4 text-sm text-slate-300 ring-1 ring-white/8">No conversations yet. Start one from the panel above.</div>
                    <?php else: ?>
                        <?php foreach ($threads as $thread): ?>
                            <?php
                            $counterpart = is_array($thread['counterpart'] ?? null) ? $thread['counterpart'] : null;
                            $displayName = (string) ($counterpart['name'] ?? $thread['subject'] ?? 'Conversation');
                            $email = (string) ($counterpart['email'] ?? '');
                            $role = (string) ($counterpart['role'] ?? '');
                            $active = ((string) ($thread['id'] ?? '')) === $selectedThreadId && !$composeMode;
                            ?>
                            <a href="<?= htmlspecialchars($basePath . '/messages?thread=' . urlencode((string) $thread['id']), ENT_QUOTES, 'UTF-8') ?>" class="js-thread-item mb-2 flex w-full items-start gap-3 rounded-3xl px-3 py-3 text-left transition <?= $active ? 'bg-[#202c33] shadow-lg' : 'hover:bg-white/6' ?>" data-search-text="<?= htmlspecialchars(strtolower(trim($displayName . ' ' . $email . ' ' . $role . ' ' . (string) ($thread['projectTitle'] ?? '') . ' ' . (string) ($thread['lastMessageBody'] ?? ''))), ENT_QUOTES, 'UTF-8') ?>">
                                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-sm font-semibold text-white">
                                    <?= htmlspecialchars($avatarText($displayName), ENT_QUOTES, 'UTF-8') ?>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center justify-between gap-2">
                                        <div class="min-w-0">
                                            <p class="truncate text-sm font-semibold text-white"><?= htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8') ?></p>
                                            <p class="truncate text-xs text-slate-300"><?= htmlspecialchars((string) ($thread['projectTitle'] ?? $role ?: $email), ENT_QUOTES, 'UTF-8') ?></p>
                                        </div>
                                        <div class="text-[11px] text-slate-400"><?= htmlspecialchars($formatTimestamp((string) ($thread['lastMessageAt'] ?? '')), ENT_QUOTES, 'UTF-8') ?></div>
                                    </div>
                                    <div class="mt-2 flex items-center justify-between gap-2">
                                        <p class="truncate text-sm text-slate-300"><?= htmlspecialchars((string) ($thread['lastMessageBody'] ?? 'No messages yet'), ENT_QUOTES, 'UTF-8') ?></p>
                                        <?php if ((int) ($thread['unreadCount'] ?? 0) > 0): ?>
                                            <span class="inline-flex min-w-6 items-center justify-center rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white"><?= (int) ($thread['unreadCount'] ?? 0) ?></span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </aside>

            <section class="min-h-[720px] bg-[linear-gradient(180deg,#ece5dd_0%,#f8faf8_100%)]">
                <?php if ($composeMode): ?>
                    <div class="flex min-h-[720px] items-center justify-center p-8">
                        <div class="w-full max-w-2xl rounded-4xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">New conversation</p>
                                    <h2 class="mt-2 text-2xl font-semibold text-slate-900">Start a chat</h2>
                                    <p class="mt-2 text-sm text-slate-500">Pick any user and send the first message. The thread will appear in the left panel.</p>
                                </div>
                                <?php if ($selectedThreadId !== ''): ?>
                                    <a href="<?= htmlspecialchars($basePath . '/messages?thread=' . urlencode($selectedThreadId), ENT_QUOTES, 'UTF-8') ?>" class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back to chat</a>
                                <?php endif; ?>
                            </div>

                            <form method="post" action="<?= htmlspecialchars($basePath . '/messages/send', ENT_QUOTES, 'UTF-8') ?>" class="mt-6 grid gap-4">
                                <div>
                                    <label for="recipient_email" class="mb-2 block text-sm font-medium text-slate-700">Contact</label>
                                    <select id="recipient_email" name="recipient_email" required class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                        <option value="">Select contact</option>
                                        <?php foreach ($contacts as $contact): ?>
                                            <?php $contactEmail = (string) ($contact['email'] ?? ''); ?>
                                            <?php $contactName = (string) ($contact['name'] ?? $contactEmail); ?>
                                            <option value="<?= htmlspecialchars($contactEmail, ENT_QUOTES, 'UTF-8') ?>" <?= strtolower($selectedRecipientEmail) === strtolower($contactEmail) ? 'selected' : '' ?>>
                                                <?= htmlspecialchars($contactName, ENT_QUOTES, 'UTF-8') ?> (<?= htmlspecialchars((string) ($contact['role'] ?? 'USER'), ENT_QUOTES, 'UTF-8') ?>) · <?= htmlspecialchars($contactEmail, ENT_QUOTES, 'UTF-8') ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>

                                <div>
                                    <label for="project_id" class="mb-2 block text-sm font-medium text-slate-700">Project context</label>
                                    <select id="project_id" name="project_id" class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                        <option value="">General chat</option>
                                        <?php foreach ($projects as $project): ?>
                                            <option value="<?= htmlspecialchars($project->id, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>

                                <div>
                                    <label for="subject" class="mb-2 block text-sm font-medium text-slate-700">Subject</label>
                                    <input id="subject" name="subject" class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Optional thread subject" />
                                </div>

                                <div>
                                    <label for="body" class="mb-2 block text-sm font-medium text-slate-700">Message</label>
                                    <textarea id="body" name="body" rows="6" required class="w-full rounded-3xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Write your message..."></textarea>
                                </div>

                                <div class="flex justify-end">
                                    <button class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Send message</button>
                                </div>
                            </form>
                        </div>
                    </div>
                <?php elseif ($selectedThread !== null && $selectedCounterpart !== null): ?>
                    <header class="border-b border-slate-200 bg-white px-6 py-5">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div class="flex items-start gap-4">
                                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-sm font-semibold text-white">
                                    <?= htmlspecialchars($avatarText((string) ($selectedCounterpart['name'] ?? 'Conversation')), ENT_QUOTES, 'UTF-8') ?>
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900"><?= htmlspecialchars((string) ($selectedCounterpart['name'] ?? 'Conversation'), ENT_QUOTES, 'UTF-8') ?></h3>
                                    <p class="mt-1 text-sm text-slate-500"><?= htmlspecialchars((string) ($selectedCounterpart['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?></p>
                                    <div class="mt-2 flex flex-wrap gap-2">
                                        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"><?= htmlspecialchars((string) ($selectedCounterpart['role'] ?? 'USER'), ENT_QUOTES, 'UTF-8') ?></span>
                                        <?php if ($selectedThread->projectId !== null && $selectedThread->projectId !== ''): ?>
                                            <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"><?= htmlspecialchars((string) ($selectedThread->subject ?? 'Project chat'), ENT_QUOTES, 'UTF-8') ?></span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                            <a href="<?= htmlspecialchars($basePath . '/messages?compose=1&recipient_email=' . urlencode((string) ($selectedCounterpart['email'] ?? '')), ENT_QUOTES, 'UTF-8') ?>" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">New chat</a>
                        </div>
                    </header>

                    <div class="flex min-h-[620px] flex-col">
                        <div class="flex-1 overflow-y-auto px-5 py-5">
                            <div class="space-y-3">
                                <?php foreach ($selectedMessages as $message): ?>
                                    <?php $mine = $message->senderId === (string) ($user['id'] ?? ''); ?>
                                    <div class="flex <?= $mine ? 'justify-end' : 'justify-start' ?>">
                                        <div class="max-w-[78%] rounded-3xl px-4 py-3 shadow-sm <?= $mine ? 'bg-[#d9fdd3] text-slate-900' : 'bg-white text-slate-800' ?>">
                                            <p class="whitespace-pre-wrap text-sm leading-6"><?= htmlspecialchars($message->body, ENT_QUOTES, 'UTF-8') ?></p>
                                            <div class="mt-2 flex items-center justify-end gap-2 text-[11px] text-slate-500">
                                                <span><?= htmlspecialchars($formatTimestamp($message->createdAt), ENT_QUOTES, 'UTF-8') ?></span>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                                <?php if ($selectedMessages === []): ?>
                                    <div class="flex h-full min-h-80 items-center justify-center text-sm text-slate-500">No messages in this thread yet.</div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="border-t border-slate-200 bg-[#f0f2f5] px-5 py-4">
                            <form method="post" action="<?= htmlspecialchars($basePath . '/messages/send', ENT_QUOTES, 'UTF-8') ?>" class="grid gap-3">
                                <input type="hidden" name="thread_id" value="<?= htmlspecialchars($selectedThread->id, ENT_QUOTES, 'UTF-8') ?>" />
                                <textarea name="body" rows="3" required class="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Type a message"></textarea>
                                <div class="flex justify-end">
                                    <button class="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="flex min-h-[720px] items-center justify-center p-8 text-center">
                        <div class="max-w-md">
                            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white shadow-lg"><?= htmlspecialchars(strtoupper(substr($roleLabel, 0, 2)), ENT_QUOTES, 'UTF-8') ?></div>
                            <h3 class="mt-5 text-2xl font-semibold text-slate-900">Pick a conversation</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-500">Choose a thread from the left or start a new chat with any user.</p>
                        </div>
                    </div>
                <?php endif; ?>
            </section>
        </section>
<?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
<script>
(() => {
    const inbox = document.querySelector('.js-messages-inbox');
    if (!inbox) return;

    const searchInput = inbox.querySelector('.js-thread-search');
    const threadItems = () => Array.from(inbox.querySelectorAll('.js-thread-item'));

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.trim().toLowerCase();
            threadItems().forEach((item) => {
                const haystack = item.dataset.searchText || '';
                item.style.display = term === '' || haystack.includes(term) ? '' : 'none';
            });
        });
    }

    const pollUrl = inbox.dataset.pollUrl || '';
    let fingerprint = inbox.dataset.stateFingerprint || '';
    const composeMode = inbox.dataset.composeMode === '1';

    if (!pollUrl) return;

    const hasDirtyDraft = () => {
        const textarea = document.activeElement instanceof HTMLTextAreaElement
            ? document.activeElement
            : document.querySelector('textarea[name="body"]');
        return !!(textarea && textarea.value.trim() !== '');
    };

    window.setInterval(async () => {
        if (composeMode && hasDirtyDraft()) {
            return;
        }

        try {
            const response = await fetch(pollUrl + window.location.search, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            if (!response.ok) return;
            const data = await response.json();
            if (data?.ok && typeof data.fingerprint === 'string' && data.fingerprint !== fingerprint) {
                window.location.reload();
            }
        } catch (error) {
        }
    }, 15000);
})();
</script>
