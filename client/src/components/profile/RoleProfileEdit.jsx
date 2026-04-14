import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleProfileEdit({ roleConfig, initialProfile, basePath, onSave }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const previewImage = useMemo(() => {
    if (!form.profileImage) return "";
    return form.profileImage;
  }, [form.profileImage]);

  useEffect(() => {
    setForm(initialProfile);
  }, [initialProfile]);

  const handleInputChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, profileImage: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const requiredFields = roleConfig.formSections
      .flatMap((section) => section.fields)
      .filter((field) => field.required)
      .map((field) => field.key);

    const missing = requiredFields.find((key) => !String(form[key] || "").trim());
    if (missing) {
      return "Please fill all required fields.";
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      await onSave(form);
      navigate(basePath);
    } catch {
      setError("Unable to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{roleConfig.roleLabel} Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Create or update your profile details.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(basePath)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <label className="text-sm font-medium text-slate-700">Profile Image</label>
          <div className="mt-3 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-200">
              {previewImage ? (
                <img src={previewImage} alt="Profile preview" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
          </div>
        </div>

        {roleConfig.formSections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{section.title}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-slate-700">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={4}
                      value={form[field.key] || ""}
                      onChange={handleInputChange(field.key)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      value={form[field.key] || ""}
                      onChange={handleInputChange(field.key)}
                      className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-slate-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
