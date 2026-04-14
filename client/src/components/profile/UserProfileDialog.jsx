import React from "react";

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default function UserProfileDialog({ open, profile, onClose }) {
  if (!open || !profile) return null;

  const displayName = profile.displayName || `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.email || "User";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/60 p-4" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-4">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={displayName} className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-200" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold text-slate-600">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{displayName}</h2>
              <p className="text-sm text-slate-500">{profile.role || "User"}</p>
              <p className="text-sm text-slate-500">{profile.email || ""}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">Close</button>
        </div>

        <div className="grid gap-3 p-6 md:grid-cols-2">
          <Field label="Username" value={profile.username} />
          <Field label="Location" value={profile.location} />
          <Field label="Team" value={profile.team} />
          <Field label="Company" value={profile.company} />
          <Field label="Designation" value={profile.designation} />
          <Field label="Specialization" value={profile.specialization} />
          <Field label="Skills" value={profile.skills} />
          <Field label="Current Focus" value={profile.currentFocus} />
          <Field label="Responsibilities" value={profile.responsibilities} />
          <Field label="Priorities" value={profile.priorities} />
          <Field label="Bio" value={profile.bio} />
          <Field label="Portfolio Notes" value={profile.portfolioNotes} />
          <Field label="Governance Notes" value={profile.governanceNotes} />
          <Field label="Decision Notes" value={profile.decisionNotes} />
        </div>
      </div>
    </div>
  );
}
