import React, { useMemo, useState } from "react";

const icons = {
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

const STATUS_LABELS = {
  submitted: "Submitted",
  considering: "Considering",
  accepted: "Hired",
  rejected: "Rejected",
  active: "Active",
  system: "System",
};

function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function statusTone(status) {
  if (status === "accepted" || status === "active") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "considering" || status === "submitted") return "bg-blue-50 text-blue-700 ring-blue-100";
  if (status === "rejected") return "bg-red-50 text-red-700 ring-red-100";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export default function RoleMessagesLayout({
  roleLabel,
  listTitle,
  contacts,
  helperText,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKey, setSelectedKey] = useState(contacts?.[0]?.key || null);
  const [draftMessage, setDraftMessage] = useState("");
  const [conversationMap, setConversationMap] = useState(() => {
    const map = {};
    (contacts || []).forEach((contact) => {
      map[contact.key] = contact.messages || [];
    });
    return map;
  });

  const filteredContacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((contact) => `${contact.name} ${contact.email} ${contact.subtitle}`.toLowerCase().includes(query));
  }, [contacts, searchTerm]);

  const selectedContact = useMemo(() => {
    return contacts.find((contact) => contact.key === selectedKey) || null;
  }, [contacts, selectedKey]);

  const visibleMessages = useMemo(() => {
    if (!selectedContact) return [];
    return conversationMap[selectedContact.key] || [];
  }, [conversationMap, selectedContact]);

  const handleSendMessage = () => {
    if (!selectedContact) return;
    const text = draftMessage.trim();
    if (!text) return;

    const newMessage = {
      id: `local-${Date.now()}`,
      sender: "self",
      text,
      timestamp: new Date().toISOString(),
    };

    setConversationMap((prev) => ({
      ...prev,
      [selectedContact.key]: [...(prev[selectedContact.key] || []), newMessage],
    }));
    setDraftMessage("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="text-sm font-semibold text-slate-900">{listTitle}</div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400">
          {icons.search}
          <input
            type="text"
            placeholder="Search contacts"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="mt-4 space-y-2">
          {!filteredContacts.length ? (
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">No matching conversations.</p>
          ) : (
            filteredContacts.map((contact) => {
              const active = contact.key === selectedKey;
              const label = STATUS_LABELS[contact.status] || "Pending";

              return (
                <button
                  key={contact.key}
                  type="button"
                  onClick={() => setSelectedKey(contact.key)}
                  className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                    active
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{contact.email}</p>
                      <p className="mt-1 text-xs text-slate-500">{contact.subtitle}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${statusTone(contact.status)}`}>
                      {label}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        {!selectedContact ? (
          <div className="p-6 text-sm text-slate-500">Select a conversation to start messaging.</div>
        ) : (
          <>
            <header className="border-b border-slate-200 px-6 py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedContact.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{selectedContact.email}</p>
                  <p className="mt-1 text-sm text-slate-500">{selectedContact.subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedContact.tags || []).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">{helperText}</p>
            </header>

            <div className="space-y-4 px-6 py-5">
              <div className="max-h-[360px] space-y-3 overflow-y-auto rounded-2xl bg-slate-50 p-4">
                {visibleMessages.length ? (
                  visibleMessages.map((message) => {
                    const mine = message.sender === "self";
                    return (
                      <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] ${mine ? "items-end" : "items-start"}`}>
                          <div
                            className={`rounded-2xl px-4 py-2 text-sm ${
                              mine ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
                            }`}
                          >
                            {message.text}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-400">{formatTime(message.timestamp)}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-slate-500">No messages yet. Start the conversation.</div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Message ${selectedContact.name}`}
                  className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800"
                  aria-label="Send message"
                >
                  {icons.send}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
