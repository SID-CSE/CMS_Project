<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var \App\Models\MessageThread $thread */
/** @var array<int,\App\Models\Message> $messages */
/** @var array<int,array<string,mixed>> $contacts */
/** @var array{a:?array{id:string,name:string,email:string,role:string},b:?array{id:string,name:string,email:string,role:string}} $participants */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="mx-auto max-w-5xl p-6 lg:p-10">
        <div class="mb-6 flex items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                <h1 class="mt-1 text-3xl font-bold text-slate-900"><?= htmlspecialchars($thread->subject ?? 'Conversation', ENT_QUOTES, 'UTF-8') ?></h1>
                <p class="mt-2 text-sm text-slate-500">
                    <?= htmlspecialchars((string) ($participants['a']['name'] ?? $thread->participantAId), ENT_QUOTES, 'UTF-8') ?>
                    ·
                    <?= htmlspecialchars((string) ($participants['b']['name'] ?? $thread->participantBId), ENT_QUOTES, 'UTF-8') ?>
                </p>
            </div>
            <a href="javascript:history.back()" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back</a>
        </div>

        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="mb-5 grid gap-3 md:grid-cols-2">
                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-xs uppercase tracking-[0.14em] text-slate-500">Participant A</p>
                    <p class="mt-1 text-sm font-semibold text-slate-900"><?= htmlspecialchars((string) ($participants['a']['name'] ?? $thread->participantAId), ENT_QUOTES, 'UTF-8') ?></p>
                    <p class="text-xs text-slate-500"><?= htmlspecialchars((string) ($participants['a']['email'] ?? $thread->participantAId), ENT_QUOTES, 'UTF-8') ?></p>
                </div>
                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-xs uppercase tracking-[0.14em] text-slate-500">Participant B</p>
                    <p class="mt-1 text-sm font-semibold text-slate-900"><?= htmlspecialchars((string) ($participants['b']['name'] ?? $thread->participantBId), ENT_QUOTES, 'UTF-8') ?></p>
                    <p class="text-xs text-slate-500"><?= htmlspecialchars((string) ($participants['b']['email'] ?? $thread->participantBId), ENT_QUOTES, 'UTF-8') ?></p>
                </div>
            </div>

            <div class="space-y-4">
                <?php foreach ($messages as $message): ?>
                    <article class="rounded-2xl border border-slate-200 p-4 <?= ($message->senderId === ($user['id'] ?? '')) ? 'bg-blue-50' : 'bg-white' ?>">
                        <div class="flex items-center justify-between gap-3">
                            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"><?= htmlspecialchars($message->senderId === ($user['id'] ?? '') ? 'You' : $message->senderId, ENT_QUOTES, 'UTF-8') ?></p>
                            <p class="text-xs text-slate-500"><?= htmlspecialchars($message->createdAt, ENT_QUOTES, 'UTF-8') ?></p>
                        </div>
                        <p class="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700"><?= htmlspecialchars($message->body, ENT_QUOTES, 'UTF-8') ?></p>
                    </article>
                <?php endforeach; ?>
            </div>

            <form method="post" action="/messages/send" class="mt-6 rounded-2xl border border-slate-200 p-4">
                <input type="hidden" name="thread_id" value="<?= htmlspecialchars($thread->id, ENT_QUOTES, 'UTF-8') ?>" />
                <label for="reply_body" class="mb-2 block text-sm font-medium text-slate-700">Reply</label>
                <textarea id="reply_body" name="body" rows="4" required class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Write a reply..."></textarea>
                <div class="mt-4 flex justify-end">
                    <button class="rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">Send Reply</button>
                </div>
            </form>
        </section>
    </div>
</div>
