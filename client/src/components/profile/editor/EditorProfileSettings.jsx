import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";

import apiClient from "../../../services/apiClient";
import {
  changeMyPassword,
  getEditorStats,
  getMyProfile,
  updateEditorProfile,
  updateMyAvatar,
  updateMyProfile,
  updateNotificationPrefs,
} from "../../../services/userService";
import SkillTagInput from "./SkillTagInput";

const PROFILE_SCHEMA = z.object({
  displayName: z.string().min(1, "Display name is required").max(120),
  bio: z.string().max(200, "Bio can be up to 200 characters").optional().or(z.literal("")),
  timezone: z.string().min(1, "Timezone is required"),
  language: z.string().min(1),
  skills: z.array(z.string().min(1)).default([]),
  behance: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  linkedIn: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  personalSite: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  notificationsEmail: z.boolean().default(true),
  notificationsWhatsapp: z.boolean().default(false),
  notificationsInApp: z.boolean().default(true),
});

const PASSWORD_SCHEMA = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const TAB_OPTIONS = [
  { key: "basic", label: "Basic Info" },
  { key: "skills", label: "Skills & Portfolio" },
  { key: "security", label: "Password" },
  { key: "notifications", label: "Notifications" },
];

const TIMEZONES = ["Asia/Kolkata", "UTC", "America/New_York", "Europe/London", "Asia/Singapore"];

function Toast({ toast }) {
  if (!toast) return null;
  const tone = toast.type === "error" ? "bg-red-600" : "bg-emerald-600";
  return (
    <div className={`fixed right-6 top-20 z-50 rounded-xl px-4 py-3 text-sm text-white shadow-xl ${tone}`}>
      {toast.message}
    </div>
  );
}

async function cropResizeToSquare(file, size = 200) {
  const imageBitmap = await createImageBitmap(file);
  const sourceSize = Math.min(imageBitmap.width, imageBitmap.height);
  const sx = (imageBitmap.width - sourceSize) / 2;
  const sy = (imageBitmap.height - sourceSize) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageBitmap, sx, sy, sourceSize, sourceSize, 0, 0, size, size);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  if (!blob) {
    throw new Error("Unable to process image");
  }

  const previewUrl = URL.createObjectURL(blob);
  return { blob, previewUrl };
}

async function uploadAvatarWithPresignedUrl(blob) {
  try {
    const ext = "jpg";
    const fileName = `avatar-${Date.now()}.${ext}`;
    const signed = await apiClient.post("/uploads/avatar/presign", {
      fileName,
      contentType: "image/jpeg",
    });

    const payload = signed?.data || signed;
    const uploadUrl = payload?.uploadUrl;
    const publicUrl = payload?.publicUrl;

    if (!uploadUrl || !publicUrl) {
      throw new Error("Invalid pre-signed upload response");
    }

    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": "image/jpeg" },
    });

    if (!response.ok) {
      throw new Error("Avatar upload failed");
    }

    return publicUrl;
  } catch {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Avatar upload fallback failed"));
      reader.readAsDataURL(blob);
    });
  }
}

export default function EditorProfileSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "basic";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [stats, setStats] = useState({ tasksCompleted: 0, onTimeRate: 0 });
  const [toast, setToast] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(PROFILE_SCHEMA),
    defaultValues: {
      displayName: "",
      bio: "",
      timezone: "Asia/Kolkata",
      language: "en",
      skills: [],
      behance: "",
      linkedIn: "",
      personalSite: "",
      notificationsEmail: true,
      notificationsWhatsapp: false,
      notificationsInApp: true,
    },
    mode: "onChange",
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm({
    resolver: zodResolver(PASSWORD_SCHEMA),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const bioLength = watch("bio")?.length || 0;
  const skills = watch("skills") || [];

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        const [profile, editorStats] = await Promise.all([getMyProfile(), getEditorStats()]);
        if (!active) return;

        setAvatarUrl(profile.avatarUrl || "");
        setStats({
          tasksCompleted: editorStats.tasksCompleted || 0,
          onTimeRate: editorStats.onTimeRate || 0,
        });

        reset({
          displayName: profile.displayName || profile.fullName || "",
          bio: profile.bio || "",
          timezone: profile.timezone || "Asia/Kolkata",
          language: profile.language || "en",
          skills: profile.skills || [],
          behance: profile.portfolioLinks?.behance || "",
          linkedIn: profile.portfolioLinks?.linkedIn || "",
          personalSite: profile.portfolioLinks?.personalSite || "",
          notificationsEmail: Boolean(profile.notificationPrefs?.email ?? true),
          notificationsWhatsapp: Boolean(profile.notificationPrefs?.whatsapp ?? false),
          notificationsInApp: Boolean(profile.notificationPrefs?.inApp ?? true),
        });
      } catch {
        setToast({ type: "error", message: "Unable to load profile" });
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [reset]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const onSave = async (values) => {
    try {
      setSaving(true);
      await Promise.all([
        updateMyProfile({
          displayName: values.displayName,
          bio: values.bio,
          timezone: values.timezone,
          language: values.language,
        }),
        updateEditorProfile({
          skills: values.skills,
          portfolioLinks: {
            behance: values.behance,
            linkedIn: values.linkedIn,
            personalSite: values.personalSite,
          },
        }),
        updateNotificationPrefs({
          email: values.notificationsEmail,
          whatsapp: values.notificationsWhatsapp,
          inApp: values.notificationsInApp,
        }),
      ]);

      reset(values);
      setToast({ type: "success", message: "Profile changes saved" });
    } catch (error) {
      setToast({ type: "error", message: error.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSave = async (values) => {
    try {
      await changeMyPassword(values);
      resetPassword();
      setToast({ type: "success", message: "Password updated" });
    } catch (error) {
      setToast({ type: "error", message: error.message || "Password update failed" });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setAvatarUploading(true);
      const { blob, previewUrl } = await cropResizeToSquare(file, 200);
      setAvatarUrl(previewUrl);

      const publicUrl = await uploadAvatarWithPresignedUrl(blob);
      await updateMyAvatar(publicUrl);
      setAvatarUrl(publicUrl);
      setToast({ type: "success", message: "Avatar updated" });
    } catch (error) {
      setToast({ type: "error", message: error.message || "Avatar upload failed" });
    } finally {
      event.target.value = "";
      setAvatarUploading(false);
    }
  };

  const activeTabConfig = useMemo(() => TAB_OPTIONS.find((tab) => tab.key === activeTab) || TAB_OPTIONS[0], [activeTab]);

  const tabClass = (key) =>
    `rounded-xl px-3 py-2 text-sm font-medium transition ${
      activeTab === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`;

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading profile...</div>;
  }

  return (
    <>
      <Toast toast={toast} />
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="group relative h-20 w-20 overflow-hidden rounded-full border border-slate-300 bg-slate-100"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-xl font-semibold text-slate-500">E</span>
                )}
                <span className="absolute inset-0 hidden place-items-center bg-slate-900/55 text-xs font-medium text-white group-hover:grid">
                  Change
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onAvatarFileChange}
                className="hidden"
              />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Editor Profile</h3>
                <p className="text-sm text-slate-500">Upload a square avatar. Image is cropped and resized to 200x200.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm">
              <div>
                <p className="text-slate-500">Tasks completed</p>
                <p className="text-xl font-semibold text-slate-900">{stats.tasksCompleted}</p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="text-slate-500">On-time rate</p>
                <p className="text-xl font-semibold text-slate-900">{stats.onTimeRate}%</p>
              </div>
            </div>
          </div>
          {(avatarUploading || saving) && <p className="mt-3 text-xs text-slate-500">Processing your changes...</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSearchParams({ tab: tab.key })}
              className={tabClass(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTabConfig.key === "security" ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="text-base font-semibold text-slate-900">Change Password</h4>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Current password</label>
                <input
                  type="password"
                  {...registerPassword("currentPassword")}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">New password</label>
                <input
                  type="password"
                  {...registerPassword("newPassword")}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Confirm password</label>
                <input
                  type="password"
                  {...registerPassword("confirmPassword")}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                    type="button"
                    onClick={handlePasswordSubmit(onPasswordSave)}
                  disabled={passwordSubmitting}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {passwordSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
              </div>
          </section>
        ) : (
          <form onSubmit={handleSubmit(onSave)} className="space-y-6">
            {activeTabConfig.key === "basic" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-base font-semibold text-slate-900">Basic Info</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Display Name</label>
                    <input
                      {...register("displayName")}
                      className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                    />
                    {errors.displayName && <p className="mt-1 text-xs text-red-600">{errors.displayName.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Timezone</label>
                    <select
                      {...register("timezone")}
                      className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                    >
                      {TIMEZONES.map((zone) => (
                        <option value={zone} key={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Bio</label>
                    <textarea
                      rows={4}
                      {...register("bio")}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-700"
                    />
                    <div className="mt-1 flex items-center justify-between">
                      {errors.bio ? <p className="text-xs text-red-600">{errors.bio.message}</p> : <span />}
                      <p className="text-xs text-slate-500">{bioLength}/200</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTabConfig.key === "skills" && (
              <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">Skills</h4>
                  <p className="text-sm text-slate-500">Add skills to make task assignment easier.</p>
                  <div className="mt-3">
                    <SkillTagInput value={skills} onChange={(next) => setValue("skills", next, { shouldDirty: true })} />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Behance</label>
                    <input
                      {...register("behance")}
                      placeholder="https://behance.net/username"
                      className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                    />
                    {errors.behance && <p className="mt-1 text-xs text-red-600">{errors.behance.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">LinkedIn</label>
                    <input
                      {...register("linkedIn")}
                      placeholder="https://linkedin.com/in/username"
                      className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                    />
                    {errors.linkedIn && <p className="mt-1 text-xs text-red-600">{errors.linkedIn.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Personal Site</label>
                    <input
                      {...register("personalSite")}
                      placeholder="https://yourdomain.com"
                      className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                    />
                    {errors.personalSite && <p className="mt-1 text-xs text-red-600">{errors.personalSite.message}</p>}
                  </div>
                </div>
              </section>
            )}

            {activeTabConfig.key === "notifications" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-base font-semibold text-slate-900">Notification Preferences</h4>
                <div className="mt-4 space-y-3">
                  <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                    <span className="text-sm text-slate-700">Email alerts</span>
                    <input type="checkbox" {...register("notificationsEmail")} className="h-4 w-4" />
                  </label>
                  <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                    <span className="text-sm text-slate-700">WhatsApp alerts</span>
                    <input type="checkbox" {...register("notificationsWhatsapp")} className="h-4 w-4" />
                  </label>
                  <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                    <span className="text-sm text-slate-700">In-app alerts</span>
                    <input type="checkbox" {...register("notificationsInApp")} className="h-4 w-4" />
                  </label>
                </div>
              </section>
            )}

            {isDirty && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </>
  );
}
