import React, { useMemo, useState } from "react";
import UserIdentityLink from "../profile/UserIdentityLink";

const icons = {
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  refresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9A9 9 0 0 1 15 4.3L23 10" />
      <path d="M20.49 15A9 9 0 0 1 9 19.7L1 14" />
    </svg>
  ),
};

function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

function avatarFromName(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export default function RoleMessagesLayout({
  roleLabel,
  listTitle,
  threads = [],
  selectedThreadId,
  selectedThread,
  messages = [],
  availableContacts = [],
  projects = [],
  currentUserId,
  currentUserName = "",
  helperText,
  loading = false,
  sending = false,
  draftMessage = "",
  selectedProjectId = "",
  composerPlaceholder = "Type a message",
  onDraftChange,
  onSelectThread,
  onStartConversation,
  onSelectProject,
  onSend,
  onRefresh,
  onMarkRead,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [newContactId, setNewContactId] = useState("");

  const filteredThreads = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) return threads;
    return threads.filter((thread) => {
      const counterpartName = thread.counterpart?.name || "";
      const projectTitle = thread.projectTitle || "";
      const lastMessage = thread.lastMessage || "";
      return `${counterpartName} ${projectTitle} ${lastMessage}`.toLowerCase().includes(value);
    });
  }, [searchTerm, threads]);

  const activeThread = selectedThread || threads.find((thread) => thread.counterpartId === selectedThreadId) || null;
  const unreadTotal = threads.reduce((sum, thread) => sum + Number(thread.unreadCount || 0), 0);

  const handleStartConversation = () => {
    if (!newContactId) return;
    onStartConversation?.(newContactId);
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="overflow-hidden rounded-4xl bg-[#111b21] text-white shadow-2xl ring-1 ring-black/10 lg:w-[360px] lg:min-w-[340px] xl:w-[390px]">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">{roleLabel} inbox</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Messages</h2>
              <p className="mt-1 text-sm text-slate-300">{helperText}</p>
              {currentUserName ? (
                <p className="mt-2 text-xs font-medium text-slate-400">Signed in as {currentUserName}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-slate-200 transition hover:bg-white/12"
              aria-label="Refresh messages"
            >
              {icons.refresh}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/8 px-4 py-3 text-slate-300 ring-1 ring-white/8">
            {icons.search}
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search conversations"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
            />
          </div>

          {availableContacts.length > 0 ? (
            <div className="mt-4 rounded-2xl bg-white/6 p-3 ring-1 ring-white/8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Start new chat</p>
              <div className="mt-2 flex gap-2">
                <select
                  value={newContactId}
                  onChange={(event) => setNewContactId(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#1f2c34] px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="">Select contact</option>
                  {availableContacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} ({contact.role || "User"})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleStartConversation}
                  className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Chat
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{listTitle}</span>
            <span>{unreadTotal} unread</span>
          </div>
        </div>

        <div className="max-h-[calc(100vh-290px)] overflow-y-auto px-3 py-3">
          {loading ? (
            <div className="space-y-3 p-2">
              <div className="h-16 rounded-2xl bg-white/8" />
              <div className="h-16 rounded-2xl bg-white/8" />
              <div className="h-16 rounded-2xl bg-white/8" />
            </div>
          ) : filteredThreads.length ? (
            filteredThreads.map((thread) => {
              const active = thread.counterpartId === selectedThreadId;
              return (
                <button
                  key={`${thread.counterpartId}-${thread.projectId || "general"}`}
                  type="button"
                  onClick={() => onSelectThread?.(thread)}
                  className={`mb-2 flex w-full items-start gap-3 rounded-3xl px-3 py-3 text-left transition ${
                    active ? "bg-[#202c33] shadow-lg" : "hover:bg-white/6"
                  }`}
                >
                  {thread.counterpart?.profileImage ? (
                    <img
                      src={thread.counterpart.profileImage}
                      alt={thread.counterpart?.name || "User"}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-sm font-semibold text-white">
                      {avatarFromName(thread.counterpart?.name || thread.projectTitle || "?")}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{thread.counterpart?.name || thread.projectTitle || "Conversation"}</p>
                        <p className="truncate text-xs text-slate-300">{thread.projectTitle || thread.counterpart?.role || "General chat"}</p>
                      </div>
                      <div className="text-[11px] text-slate-400">{formatTime(thread.lastMessageAt)}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="truncate text-sm text-slate-300">{thread.lastMessage || "No messages yet"}</p>
                      {thread.unreadCount > 0 ? (
                        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                          {thread.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="rounded-3xl bg-white/6 p-4 text-sm text-slate-300 ring-1 ring-white/8">No matching conversations.</div>
          )}
        </div>
      </aside>

      <section className="overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-slate-200 lg:flex-1">
        {!activeThread ? (
          <div className="flex min-h-160 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_45%),linear-gradient(180deg,#f8fafc_0%,#edf7f3_100%)] p-8 text-center">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white shadow-lg">{roleLabel.slice(0, 2).toUpperCase()}</div>
              <h3 className="mt-5 text-2xl font-semibold text-slate-900">Pick a conversation</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Messages are loaded from the backend. Select a thread on the left or start a new chat to continue.
              </p>
            </div>
          </div>
        ) : (
          <>
            <header className="border-b border-slate-200 bg-white px-6 py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {activeThread.counterpart?.profileImage ? (
                    <img
                      src={activeThread.counterpart.profileImage}
                      alt={activeThread.counterpart?.name || "User"}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-sm font-semibold text-white">
                      {avatarFromName(activeThread.counterpart?.name || activeThread.projectTitle || "?")}
                    </div>
                  )}
                  <div>
                    {activeThread.counterpart?.name ? (
                      <UserIdentityLink
                        userId={activeThread.counterpartId}
                        name={activeThread.counterpart?.name}
                        role={activeThread.counterpart?.role}
                        profileImage={activeThread.counterpart?.profileImage}
                        className="-ml-1"
                      />
                    ) : (
                      <h3 className="text-lg font-semibold text-slate-900">{activeThread.projectTitle || "Conversation"}</h3>
                    )}
                    <p className="mt-1 text-sm text-slate-500">{activeThread.counterpart?.email || activeThread.counterpart?.role || "Open project discussion"}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeThread.projectTitle ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{activeThread.projectTitle}</span>
                      ) : null}
                      {activeThread.counterpart?.role ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{activeThread.counterpart.role}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onRefresh ? (
                    <button
                      type="button"
                      onClick={onRefresh}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Refresh
                    </button>
                  ) : null}
                  {onMarkRead ? (
                    <button
                      type="button"
                      onClick={() => onMarkRead(activeThread)}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">{helperText}</p>
            </header>

            <div className="flex min-h-130 flex-col bg-[linear-gradient(180deg,#ece5dd_0%,#f8faf8_100%)]">
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="space-y-3">
                  {messages.length ? (
                    messages.map((message) => {
                      const mine = message.senderId === currentUserId;
                      return (
                        <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[78%] rounded-3xl px-4 py-3 shadow-sm ${mine ? "bg-[#d9fdd3] text-slate-900" : "bg-white text-slate-800"}`}>
                            <p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p>
                            <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-slate-500">
                              {message.projectTitle ? <span className="truncate">{message.projectTitle}</span> : null}
                              <span>{formatDate(message.createdAt)} {formatTime(message.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full min-h-80 items-center justify-center text-sm text-slate-500">No messages in this thread yet.</div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 bg-[#f0f2f5] px-5 py-4">
                <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
                  {projects.length > 0 ? (
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Project context</span>
                      <select
                        value={selectedProjectId}
                        onChange={(event) => onSelectProject?.(event.target.value)}
                        className="block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                      >
                        <option value="">General</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title || `Project ${project.id}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}

                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Message</span>
                    <textarea
                      rows={2}
                      value={draftMessage}
                      onChange={(event) => onDraftChange?.(event.target.value)}
                      placeholder={composerPlaceholder}
                      className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => onSend?.(activeThread)}
                    disabled={sending || !draftMessage.trim()}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="mr-2">{icons.send}</span>
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
