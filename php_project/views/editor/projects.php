<?php
/** @var array{id:string,email:string,name:string,role:string} $user */
/** @var array<\App\Models\ProjectRequest> $projects */
/** @var array<\App\Models\ProjectTask> $assignedTasks */
/** @var array<string,array<\App\Models\TaskAttachment>> $attachmentsByTask */
/** @var array{cloudName:string,uploadPreset:string,uploadFolder:string} $cloudinary */
$roleLabel = 'Editor';
$basePath = '/editor';
$activePath = '/editor/projects';
$cloudConfigured = (($cloudinary['cloudName'] ?? '') !== '') && (($cloudinary['uploadPreset'] ?? '') !== '');
?>
<?php require_once __DIR__ . '/../partials/role-topbar.php'; ?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <?php require_once __DIR__ . '/../partials/role-sidebar.php'; ?>
            <div class="p-6 lg:p-10">
            <div class="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Signed in as <?= htmlspecialchars($user['email'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
                    <h2 class="mt-1 text-3xl font-bold text-slate-900">Editor Projects</h2>
                </div>
                <div class="flex flex-wrap gap-3">
                    <a href="/editor/messages" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Messages</a>
                    <a href="/editor/profile" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Profile</a>
                    <a href="/editor/dashboard" class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back to Dashboard</a>
                </div>
            </div>

            <section class="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 class="text-lg font-semibold text-slate-900">Assigned Tasks</h3>
                <?php if (!$cloudConfigured): ?>
                    <div class="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Cloud upload is not configured in `php_project/.env`. Add `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET` to upload to the `<?= htmlspecialchars((string) ($cloudinary['uploadFolder'] ?? 'Contify_PHP'), ENT_QUOTES, 'UTF-8') ?>` folder.
                    </div>
                <?php endif; ?>
                <?php if ($assignedTasks === []): ?>
                    <p class="mt-2 text-sm text-slate-500">No tasks assigned to your account yet.</p>
                <?php else: ?>
                    <div class="mt-4 space-y-3">
                        <?php foreach ($assignedTasks as $task): ?>
                            <article class="rounded-2xl border border-slate-200 p-4">
                                <div class="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p class="text-sm font-semibold text-slate-900"><?= htmlspecialchars($task->title, ENT_QUOTES, 'UTF-8') ?></p>
                                        <p class="text-xs text-slate-500">Project ID: <span class="font-mono"><?= htmlspecialchars($task->projectId, ENT_QUOTES, 'UTF-8') ?></span></p>
                                    </div>
                                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($task->status, ENT_QUOTES, 'UTF-8') ?></span>
                                </div>
                                <?php if ($task->description !== ''): ?>
                                    <p class="mt-2 text-sm text-slate-600"><?= htmlspecialchars($task->description, ENT_QUOTES, 'UTF-8') ?></p>
                                <?php endif; ?>
                                <?php if ($task->adminReviewNote !== null && $task->adminReviewNote !== ''): ?>
                                    <p class="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Admin note: <?= htmlspecialchars($task->adminReviewNote, ENT_QUOTES, 'UTF-8') ?></p>
                                <?php endif; ?>
                                <?php if ($task->status === 'ASSIGNED' || $task->status === 'REVISION_REQUESTED'): ?>
                                    <form method="post" action="/editor/tasks/<?= urlencode($task->id) ?>/submit" enctype="multipart/form-data" class="js-cloud-upload-form mt-3 grid gap-3" data-cloud-name="<?= htmlspecialchars((string) ($cloudinary['cloudName'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" data-upload-preset="<?= htmlspecialchars((string) ($cloudinary['uploadPreset'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" data-cloud-folder="<?= htmlspecialchars((string) ($cloudinary['uploadFolder'] ?? 'Contify_PHP'), ENT_QUOTES, 'UTF-8') ?>">
                                        <input name="submission_note" placeholder="Submission update or delivery link" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                        <input type="file" name="attachment" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white" />
                                        <input type="hidden" name="cloud_public_id" value="" />
                                        <input type="hidden" name="cloud_secure_url" value="" />
                                        <input type="hidden" name="cloud_stream_url" value="" />
                                        <input type="hidden" name="cloud_resource_type" value="" />
                                        <input type="hidden" name="cloud_file_type" value="" />
                                        <input type="hidden" name="cloud_mime_type" value="" />
                                        <input type="hidden" name="cloud_original_name" value="" />
                                        <input type="hidden" name="cloud_stored_name" value="" />
                                        <p class="hidden rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 js-upload-status"></p>
                                        <div class="flex justify-end">
                                            <button class="rounded-xl bg-[#1734a1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#132b86]">Submit Work</button>
                                        </div>
                                    </form>
                                    <?php if (!empty($attachmentsByTask[$task->id])): ?>
                                        <div class="mt-3 rounded-xl bg-slate-50 p-3">
                                            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Attachments</p>
                                            <div class="mt-2 space-y-2">
                                                <?php foreach ($attachmentsByTask[$task->id] as $attachment): ?>
                                                    <a href="<?= htmlspecialchars($attachment->filePath, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" class="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#1734a1] hover:bg-blue-50" aria-label="Open attachment <?= htmlspecialchars($attachment->originalName, ENT_QUOTES, 'UTF-8') ?>">
                                                        <span><?= htmlspecialchars($attachment->originalName, ENT_QUOTES, 'UTF-8') ?></span>
                                                    </a>
                                                <?php endforeach; ?>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                <?php endif; ?>
                            </article>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </section>

            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <?php foreach ($projects as $project): ?>
                    <article class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <h3 class="text-lg font-semibold text-slate-900"><?= htmlspecialchars($project->title, ENT_QUOTES, 'UTF-8') ?></h3>
                                <p class="mt-1 text-sm text-slate-500">Deadline: <?= htmlspecialchars($project->deadline, ENT_QUOTES, 'UTF-8') ?></p>
                            </div>
                            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><?= htmlspecialchars($project->status, ENT_QUOTES, 'UTF-8') ?></span>
                        </div>
                        <p class="mt-3 line-clamp-3 text-sm text-slate-600"><?= htmlspecialchars($project->description, ENT_QUOTES, 'UTF-8') ?></p>
                    </article>
                <?php endforeach; ?>
            </div>
            </div>
    <?php require_once __DIR__ . '/../partials/role-sidebar-end.php'; ?>
</div>

<script>
(() => {
    const detectFileType = (file) => {
        if (!file || !file.type) return "FILE";
        if (file.type.startsWith("video/")) return "VIDEO";
        if (file.type.startsWith("image/")) return "IMAGE";
        if (file.type === "application/pdf") return "PDF";
        return "FILE";
    };

    document.querySelectorAll(".js-cloud-upload-form").forEach((form) => {
        let uploadedSignature = "";

        form.addEventListener("submit", async (event) => {
            const fileInput = form.querySelector('input[type="file"][name="attachment"]');
            const file = fileInput?.files?.[0];
            const cloudName = form.dataset.cloudName || "";
            const uploadPreset = form.dataset.uploadPreset || "";
            const status = form.querySelector(".js-upload-status");
            const submitButton = form.querySelector("button[type=submit], button:not([type])");
            const uploadFolder = form.dataset.cloudFolder || "Contify_PHP";

            if (!file) {
                return;
            }

            if (!cloudName || !uploadPreset) {
                event.preventDefault();
                if (status) {
                    status.classList.remove("hidden");
                    status.textContent = "Cloud upload is not configured. Add CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in php_project/.env.";
                }
                return;
            }

            const currentSignature = [file.name, file.size, file.lastModified].join(":");
            if (uploadedSignature === currentSignature && form.querySelector('[name="cloud_public_id"]').value) {
                return;
            }

            event.preventDefault();
            if (status) {
                status.classList.remove("hidden");
                status.textContent = "Uploading to cloud...";
            }
            if (submitButton) submitButton.disabled = true;

            try {
                const payload = new FormData();
                payload.append("file", file);
                payload.append("upload_preset", uploadPreset);
                payload.append("resource_type", "auto");
                payload.append("folder", uploadFolder);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                    method: "POST",
                    body: payload,
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data?.error?.message || "Cloud upload failed");
                }

                form.querySelector('[name="cloud_public_id"]').value = data.public_id || "";
                form.querySelector('[name="cloud_secure_url"]').value = data.secure_url || data.url || "";
                form.querySelector('[name="cloud_stream_url"]').value = data.secure_url || data.url || "";
                form.querySelector('[name="cloud_resource_type"]').value = data.resource_type || "";
                form.querySelector('[name="cloud_file_type"]').value = detectFileType(file);
                form.querySelector('[name="cloud_mime_type"]').value = file.type || "";
                form.querySelector('[name="cloud_original_name"]').value = file.name || "upload";
                form.querySelector('[name="cloud_stored_name"]').value = file.name || "upload";
                uploadedSignature = currentSignature;

                if (status) {
                    status.textContent = "Cloud upload complete. Finalizing submission...";
                }

                form.submit();
            } catch (error) {
                if (status) {
                    status.textContent = error?.message || "Cloud upload failed";
                }
                if (submitButton) submitButton.disabled = false;
            }
        });
    });
})();
</script>
