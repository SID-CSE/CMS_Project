import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import projectService from '../../services/projectService';
import StakeholderSidebar from '../../components/Sidebar/StakeholderSidebar';
import StakeholderNavbar from '../../components/Navbar/StakeholderNavbar';

const CONTENT_TYPE_OPTIONS = [
  { value: 'VIDEO', label: 'Video', hint: 'Ads, explainers, reels, interviews' },
  { value: 'IMAGE', label: 'Image', hint: 'Social creatives, banners, key visuals' },
  { value: 'DESIGN', label: 'Design', hint: 'Brand systems, decks, collateral' },
  { value: 'COPY', label: 'Copy', hint: 'Scripts, captions, campaign text' },
  { value: 'OTHER', label: 'Other', hint: 'Custom deliverables and mixed scope' },
];

const DEFAULT_DEADLINE = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const todayDate = () => new Date().toISOString().slice(0, 10);

function buildStructuredDescription(formData) {
  const sections = [
    ['Project Summary', formData.projectSummary],
    ['Business Objective', formData.businessObjective],
    ['Target Audience', formData.targetAudience],
    ['Deliverables & Scope', formData.deliverables],
    ['Success Metrics', formData.successMetrics],
    ['Brand/Tone Guidelines', formData.brandTone],
    ['References & Notes', formData.references],
  ].filter(([, value]) => value && value.trim());

  return sections
    .map(([heading, value]) => `${heading}:\n${value.trim()}`)
    .join('\n\n');
}

export default function CreateProjectRequest() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    projectSummary: '',
    businessObjective: '',
    targetAudience: '',
    deliverables: '',
    successMetrics: '',
    brandTone: '',
    references: '',
    contentTypes: ['VIDEO'],
    deadline: DEFAULT_DEADLINE,
  });

  const handleContentTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter((t) => t !== type)
        : [...prev.contentTypes, type],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.contentTypes.length === 0) {
      setError('Select at least one content type to define project scope.');
      return;
    }

    if (formData.deadline < todayDate()) {
      setError('Target deadline cannot be in the past.');
      return;
    }

    setLoading(true);

    try {
      const description = buildStructuredDescription(formData);
      const result = await projectService.createProjectRequest({
        clientId: userId,
        title: formData.title,
        description,
        contentTypes: formData.contentTypes,
        deadline: formData.deadline,
      });

      if (result.ok) {
        setSuccess('Project request created successfully!');
        setTimeout(() => navigate('/stakeholder/home'), 2000);
      } else {
        setError(result.message || 'Failed to create project request');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      <main
        className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-70' : 'lg:pl-0'}`}
      >
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[linear-gradient(120deg,#0f172a_0%,#1e3a8a_55%,#2563eb_100%)] px-6 py-6 text-white sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Stakeholder Intake</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Create Project Request</h1>
              <p className="mt-2 max-w-3xl text-sm text-blue-100">
                Capture goals, audience, scope, and delivery timeline in a production-ready format for admin planning.
              </p>
            </div>
            <div className="grid gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600 sm:grid-cols-3 sm:px-8">
              <div>
                <p className="font-semibold text-slate-800">1. Strategic Context</p>
                <p>Define objective and audience.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">2. Delivery Scope</p>
                <p>Specify deliverables and content types.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">3. Deadline & Success</p>
                <p>Set due date and measurable outcomes.</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <section className="space-y-5">
                  <div className="border-b border-slate-200 pb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Project Context</h2>
                    <p className="mt-1 text-sm text-slate-500">Provide strategic background for the campaign or content initiative.</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Q3 Product Launch Performance Campaign"
                    />
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Business Objective *</label>
                      <textarea
                        required
                        value={formData.businessObjective}
                        onChange={(e) => setFormData((prev) => ({ ...prev, businessObjective: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        rows="4"
                        placeholder="Increase qualified leads by 20% through multi-channel launch assets."
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Target Audience *</label>
                      <textarea
                        required
                        value={formData.targetAudience}
                        onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        rows="4"
                        placeholder="Primary: SMB founders (25-40). Secondary: marketing managers in growth stage startups."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Project Summary *</label>
                    <textarea
                      required
                      value={formData.projectSummary}
                      onChange={(e) => setFormData((prev) => ({ ...prev, projectSummary: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      rows="4"
                      placeholder="Summarize campaign context, key message, and expected business impact."
                    />
                  </div>
                </section>

                <section className="space-y-5">
                  <div className="border-b border-slate-200 pb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Scope & Deliverables</h2>
                    <p className="mt-1 text-sm text-slate-500">Specify deliverables clearly to minimize planning cycles.</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Content Types *</label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {CONTENT_TYPE_OPTIONS.map((type) => {
                        const selected = formData.contentTypes.includes(type.value);
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => handleContentTypeChange(type.value)}
                            className={`rounded-xl border px-4 py-3 text-left transition ${
                              selected
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <p className="text-sm font-semibold text-slate-900">{type.label}</p>
                            <p className="mt-1 text-xs text-slate-500">{type.hint}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Deliverables & Scope *</label>
                    <textarea
                      required
                      value={formData.deliverables}
                      onChange={(e) => setFormData((prev) => ({ ...prev, deliverables: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      rows="4"
                      placeholder="Example: 3 launch videos, 10 social assets, 1 campaign landing page hero set, and copy variants."
                    />
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Brand/Tone Guidelines</label>
                      <textarea
                        value={formData.brandTone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, brandTone: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        rows="4"
                        placeholder="Confident, data-backed, and modern. Avoid hype language."
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">References & Notes</label>
                      <textarea
                        value={formData.references}
                        onChange={(e) => setFormData((prev) => ({ ...prev, references: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        rows="4"
                        placeholder="Share links, competitor examples, or brand assets."
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-5">
                  <div className="border-b border-slate-200 pb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Timeline & Success Criteria</h2>
                    <p className="mt-1 text-sm text-slate-500">Define when delivery is needed and how outcomes will be judged.</p>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Target Deadline *</label>
                      <input
                        type="date"
                        required
                        min={todayDate()}
                        value={formData.deadline}
                        onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Success Metrics *</label>
                      <textarea
                        required
                        value={formData.successMetrics}
                        onChange={(e) => setFormData((prev) => ({ ...prev, successMetrics: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        rows="3"
                        placeholder="CTR, watch-through rate, qualified leads, conversion targets, brand lift indicators."
                      />
                    </div>
                  </div>
                </section>

                <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Submitting Request...' : 'Submit Project Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/stakeholder/home')}
                    className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Request Quality Checklist</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>- Objective is measurable and business-linked</li>
                  <li>- Audience details are specific</li>
                  <li>- Deliverables have quantity and format</li>
                  <li>- Deadline is realistic for production</li>
                  <li>- Success metrics are trackable</li>
                </ul>
              </section>

              <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">Submission Snapshot</h3>
                <dl className="mt-3 space-y-2 text-sm text-slate-700">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-slate-500">Content Types</dt>
                    <dd className="text-right font-medium">{formData.contentTypes.length}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-slate-500">Deadline</dt>
                    <dd className="text-right font-medium">{formData.deadline || 'Not set'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-slate-500">Title Completeness</dt>
                    <dd className="text-right font-medium">{formData.title.trim().length >= 10 ? 'Good' : 'Add more detail'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-slate-500">Scope Detail</dt>
                    <dd className="text-right font-medium">{formData.deliverables.trim().length >= 30 ? 'Strong' : 'Needs detail'}</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
