import React from "react";
import { Link } from "react-router-dom";
import { initialsFromProfile, profileIsEmpty } from "./profileStorage";

const accentStyles = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  violet: "bg-violet-50 text-violet-700 border-violet-100",
};

function profileImageOrFallback(profile) {
  if (profile?.profileImage) return profile.profileImage;
  return "";
}

export default function RoleProfileView({ roleConfig, profile, basePath }) {
  const accent = accentStyles[roleConfig.accent] || accentStyles.blue;
  const currentProfile = profile || {};
  const image = profileImageOrFallback(currentProfile);
  const fullName = `${currentProfile.firstName || currentProfile.name || ""} ${currentProfile.lastName || ""}`.trim() || `${roleConfig.roleLabel} User`;
  const emptyState = profileIsEmpty(currentProfile, roleConfig.defaultProfile);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {image ? (
              <img src={image} alt={fullName} className="h-20 w-20 rounded-full object-cover ring-2 ring-slate-200" />
            ) : (
              <div className={`flex h-20 w-20 items-center justify-center rounded-full border text-xl font-semibold ${accent}`}>
                {initialsFromProfile(profile)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{fullName}</h1>
              <p className="mt-1 text-sm text-slate-500">{currentProfile.email || "No email added"}</p>
              <p className="mt-1 text-sm text-slate-500">{currentProfile.location || "Location not provided"}</p>
            </div>
          </div>

          <Link
            to={`${basePath}/edit`}
            className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {emptyState ? "Create Profile" : "Edit Profile"}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {roleConfig.infoSections.map((section) => (
          <div key={section.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{section.label}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
              {currentProfile[section.key] || "Not provided yet."}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Professional Bio</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{currentProfile.bio || "No bio available."}</p>
      </section>
    </div>
  );
}
