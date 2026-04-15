<?php
?>
<div class="min-h-screen bg-slate-100 text-slate-900">
    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div class="bg-[linear-gradient(120deg,#0f172a_0%,#1e3a8a_55%,#2563eb_100%)] px-6 py-6 text-white sm:px-8">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Stakeholder Intake</p>
                <h1 class="mt-2 text-2xl font-semibold sm:text-3xl">Create Project Request</h1>
                <p class="mt-2 max-w-3xl text-sm text-blue-100">Capture goals, audience, scope, and delivery timeline in a production-ready format for admin planning.</p>
            </div>

            <div class="grid gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600 sm:grid-cols-3 sm:px-8">
                <div>
                    <p class="font-semibold text-slate-800">1. Strategic Context</p>
                    <p>Define objective and audience.</p>
                </div>
                <div>
                    <p class="font-semibold text-slate-800">2. Delivery Scope</p>
                    <p>Specify deliverables and content types.</p>
                </div>
                <div>
                    <p class="font-semibold text-slate-800">3. Deadline & Success</p>
                    <p>Set due date and measurable outcomes.</p>
                </div>
            </div>
        </section>

        <div class="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <form method="post" action="/projects" class="space-y-8">
                <section class="space-y-5">
                    <div class="border-b border-slate-200 pb-3">
                        <h2 class="text-lg font-semibold text-slate-900">Project Context</h2>
                        <p class="mt-1 text-sm text-slate-500">Provide strategic background for the campaign or content initiative.</p>
                    </div>

                    <div>
                        <label for="title" class="mb-2 block text-sm font-medium text-slate-700">Project Title *</label>
                        <input id="title" type="text" name="title" required class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Q3 Product Launch Performance Campaign" />
                    </div>

                    <div class="grid gap-5 lg:grid-cols-2">
                        <div>
                            <label for="business_objective" class="mb-2 block text-sm font-medium text-slate-700">Business Objective *</label>
                            <textarea id="business_objective" name="business_objective" required class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" rows="4" placeholder="Increase qualified leads by 20% through multi-channel launch assets."></textarea>
                        </div>
                        <div>
                            <label for="target_audience" class="mb-2 block text-sm font-medium text-slate-700">Target Audience *</label>
                            <textarea id="target_audience" name="target_audience" required class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" rows="4" placeholder="Primary: SMB founders (25-40). Secondary: marketing managers in growth stage startups."></textarea>
                        </div>
                    </div>

                    <div>
                        <label for="project_summary" class="mb-2 block text-sm font-medium text-slate-700">Project Summary *</label>
                        <textarea id="project_summary" name="description" required class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" rows="4" placeholder="Summarize campaign context, key message, and expected business impact."></textarea>
                    </div>
                </section>

                <section class="space-y-5">
                    <div class="border-b border-slate-200 pb-3">
                        <h2 class="text-lg font-semibold text-slate-900">Scope & Deliverables</h2>
                        <p class="mt-1 text-sm text-slate-500">Specify deliverables clearly to minimize planning cycles.</p>
                    </div>

                    <div>
                        <label for="content_types" class="mb-2 block text-sm font-medium text-slate-700">Content Types *</label>
                        <input id="content_types" type="text" name="content_types" class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="VIDEO, DESIGN, COPY" />
                    </div>

                    <div>
                        <label for="deliverables" class="mb-2 block text-sm font-medium text-slate-700">Deliverables & Scope *</label>
                        <textarea id="deliverables" name="deliverables" required class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" rows="4" placeholder="Example: 3 launch videos, 10 social assets, 1 campaign landing page hero set, and copy variants."></textarea>
                    </div>

                    <div class="grid gap-5 lg:grid-cols-2">
                        <div>
                            <label for="brand_tone" class="mb-2 block text-sm font-medium text-slate-700">Brand/Tone Guidelines</label>
                            <textarea id="brand_tone" name="brand_tone" class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" rows="4"></textarea>
                        </div>
                        <div>
                            <label for="success_metrics" class="mb-2 block text-sm font-medium text-slate-700">Success Metrics</label>
                            <textarea id="success_metrics" name="success_metrics" class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" rows="4"></textarea>
                        </div>
                    </div>
                </section>

                <section class="space-y-5">
                    <div class="border-b border-slate-200 pb-3">
                        <h2 class="text-lg font-semibold text-slate-900">Deadline & Notes</h2>
                        <p class="mt-1 text-sm text-slate-500">Set timeline and attach extra references if needed.</p>
                    </div>

                    <div class="grid gap-5 lg:grid-cols-2">
                        <div>
                            <label for="deadline" class="mb-2 block text-sm font-medium text-slate-700">Deadline *</label>
                            <input id="deadline" type="date" name="deadline" required class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                        </div>
                        <div>
                            <label for="references" class="mb-2 block text-sm font-medium text-slate-700">References & Notes</label>
                            <textarea id="references" name="references" class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" rows="4"></textarea>
                        </div>
                    </div>
                </section>

                <div class="flex flex-col gap-3 sm:flex-row">
                    <button type="submit" class="rounded-xl bg-[#1734a1] px-6 py-3 font-semibold text-white hover:bg-blue-800">Submit Request</button>
                    <a href="/stakeholder/home" class="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50">Cancel</a>
                </div>
            </form>
        </div>
    </main>
</div>

