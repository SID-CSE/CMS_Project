<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<int,array<string,mixed>> $contacts */
/** @var array<int,\App\Models\ProjectRequest> $projects */
/** @var array<string,string> $contactsLabelMap */
/** @var int $projectCount */
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="mx-auto max-w-4xl p-6 lg:p-10">
        <div class="mb-6 flex items-start justify-between gap-4">
            <div>
                <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                <h1 class="mt-1 text-3xl font-bold text-slate-900">Compose Message</h1>
                <p class="mt-2 text-sm text-slate-500">Connected contacts: <?= count($contacts) ?> | Projects: <?= (int) $projectCount ?></p>
            </div>
            <a href="javascript:history.back()" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back</a>
        </div>

        <form method="post" action="/messages/send" class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="grid gap-5 md:grid-cols-2">
                <div>
                    <label for="recipient_email" class="mb-2 block text-sm font-medium text-slate-700">Recipient Email</label>
                    <input id="recipient_email" name="recipient_email" list="contacts-list" required class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="editor@contify.com" />
                    <datalist id="contacts-list">
                        <?php foreach ($contacts as $contact): ?>
                            <?php $contactEmail = (string) ($contact['email'] ?? ''); ?>
                            <option value="<?= htmlspecialchars($contactEmail, ENT_QUOTES, 'UTF-8') ?>" label="<?= htmlspecialchars($contactsLabelMap[$contactEmail] ?? $contactEmail, ENT_QUOTES, 'UTF-8') ?>"></option>
                        <?php endforeach; ?>
                    </datalist>
                </div>
                <div>
                    <label for="project_id" class="mb-2 block text-sm font-medium text-slate-700">Project Link</label>
                    <select id="project_id" name="project_id" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                        <option value="">No project link</option>
                        <?php foreach ($projects as $project): ?>
                            <option value="<?= htmlspecialchars($project->id, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div class="mt-5">
                <label for="subject" class="mb-2 block text-sm font-medium text-slate-700">Subject</label>
                <input id="subject" name="subject" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Project update" />
            </div>

            <div class="mt-5">
                <label for="body" class="mb-2 block text-sm font-medium text-slate-700">Message</label>
                <textarea id="body" name="body" rows="7" required class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Write your message..."></textarea>
            </div>

            <div class="mt-6 flex justify-end gap-3">
                <a href="javascript:history.back()" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Cancel</a>
                <button class="rounded-xl bg-[#1734a1] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">Send Message</button>
            </div>
        </form>

        <section class="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 class="text-lg font-semibold text-slate-900">Suggested Contacts</h2>
            <div class="mt-4 grid gap-3 md:grid-cols-2">
                <?php foreach ($contacts as $contact): ?>
                    <article class="rounded-2xl border border-slate-200 p-4">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars((string) ($contact['name'] ?? $contact['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?></p>
                                <p class="mt-1 text-xs text-slate-500"><?= htmlspecialchars((string) ($contact['email'] ?? ''), ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars((string) ($contact['role'] ?? ''), ENT_QUOTES, 'UTF-8') ?></span>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>
    </div>
</div>
