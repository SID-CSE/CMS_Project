import React, { useState } from "react";
import { getUserProfile } from "../../services/userService";
import UserProfileDialog from "./UserProfileDialog";

export default function UserIdentityLink({ userId, name, role, profileImage, className = "" }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const displayName = name || "Unknown user";

  const openProfile = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const fullProfile = await getUserProfile(userId);
      setProfile(fullProfile);
      setOpen(true);
    } catch {
      setProfile({
        id: userId,
        displayName,
        role,
        profileImage,
      });
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openProfile}
        disabled={!userId || loading}
        className={`inline-flex items-center gap-2 rounded-lg px-1 py-0.5 text-left transition hover:bg-slate-100 disabled:cursor-default ${className}`}
      >
        {profileImage ? (
          <img src={profileImage} alt={displayName} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
            {displayName.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="text-sm font-medium text-slate-700 underline-offset-2 hover:underline">{displayName}</span>
      </button>
      <UserProfileDialog open={open} profile={profile} onClose={() => setOpen(false)} />
    </>
  );
}
