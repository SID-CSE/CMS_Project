import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import RoleMessagesLayout from "../../components/messaging/RoleMessagesLayout";
import { useAuth } from "../../context/AuthContext";
import projectService from "../../services/projectService";
import { getContacts, getInboxThreads, getThreadMessages, markThreadRead, sendMessage } from "../../services/messageService";

export default function AdminMessages() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, userId } = useAuth();
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!userId) return;

      setLoading(true);
      const [threadsResult, contactsResult, projectsResult] = await Promise.all([
        getInboxThreads(),
        getContacts("EDITOR,STAKEHOLDER"),
        projectService.getAllProjects(),
      ]);

      if (!active) return;

      setThreads(threadsResult || []);
      setContacts(contactsResult || []);
      setProjects(projectsResult.ok ? projectsResult.data || [] : []);

      const firstThread = (threadsResult || [])[0] || null;
      if (firstThread) {
        setSelectedThread(firstThread);
        setSelectedProjectId(firstThread.projectId || "");
        const threadMessages = await getThreadMessages(firstThread.counterpartId, firstThread.projectId || "");
        if (active) setMessages(threadMessages || []);
        await markThreadRead(firstThread.counterpartId, firstThread.projectId || "");
      } else {
        setSelectedThread(null);
        setSelectedProjectId("");
        setMessages([]);
      }

      setLoading(false);
    };

    load().catch(() => {
      if (active) {
        setThreads([]);
        setContacts([]);
        setProjects([]);
        setMessages([]);
        setSelectedThread(null);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };

  }, [userId]);

  const refreshInbox = async () => {
    const [threadsResult, contactsResult, projectsResult] = await Promise.all([
      getInboxThreads(),
      getContacts("EDITOR,STAKEHOLDER"),
      projectService.getAllProjects(),
    ]);
    setThreads(threadsResult || []);
    setContacts(contactsResult || []);
    setProjects(projectsResult.ok ? projectsResult.data || [] : []);
  };

  const openThread = async (thread) => {
    setError("");
    setStatusMessage("");
    setSelectedThread(thread);
    setSelectedProjectId(thread.projectId || "");
    const threadMessages = await getThreadMessages(thread.counterpartId, thread.projectId || "");
    setMessages(threadMessages || []);
    await markThreadRead(thread.counterpartId, thread.projectId || "");
    await refreshInbox();
  };

  const startConversation = async (contactId) => {
    const contact = contacts.find((item) => item.id === contactId);
    if (!contact) return;

    const existingThread = threads.find((thread) => thread.counterpartId === contactId && (!selectedProjectId || thread.projectId === selectedProjectId));
    if (existingThread) {
      await openThread(existingThread);
      return;
    }

    setSelectedThread({
      counterpartId: contact.id,
      counterpart: contact,
      projectId: selectedProjectId || "",
      projectTitle: projects.find((project) => project.id === selectedProjectId)?.title || "",
      lastMessage: "",
      lastMessageAt: null,
      unreadCount: 0,
    });
    setMessages([]);
  };

  const handleSend = async (activeThread) => {
    if (!activeThread || !draftMessage.trim()) return;

    setSending(true);
    setError("");
    setStatusMessage("");

    try {
      await sendMessage({
        recipientId: activeThread.counterpartId,
        projectId: selectedProjectId || activeThread.projectId || "",
        body: draftMessage.trim(),
      });
      setDraftMessage("");
      await refreshInbox();
      const refreshedThread = (await getThreadMessages(activeThread.counterpartId, selectedProjectId || activeThread.projectId || "")) || [];
      setMessages(refreshedThread);
      setStatusMessage("Message sent.");
    } catch (sendError) {
      setError(sendError.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const currentThread = selectedThread
    ? threads.find((thread) => thread.counterpartId === selectedThread.counterpartId && (thread.projectId || "") === (selectedProjectId || selectedThread.projectId || "")) || selectedThread
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} compactProfile />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
          {statusMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{statusMessage}</div> : null}

          <RoleMessagesLayout
            roleLabel="Admin"
            listTitle="Team conversations"
            threads={threads}
            selectedThreadId={currentThread?.counterpartId || ""}
            selectedThread={currentThread || null}
            messages={messages}
            availableContacts={contacts}
            projects={projects}
            selectedProjectId={selectedProjectId}
            currentUserId={userId}
            currentUserName={user?.name || user?.username || "Admin"}
            loading={loading}
            sending={sending}
            draftMessage={draftMessage}
            composerPlaceholder="Type a message to the selected contact"
            helperText="Use this thread to provide quick decisions, unblock editors, and keep projects moving."
            onSelectThread={openThread}
            onStartConversation={startConversation}
            onSelectProject={setSelectedProjectId}
            onDraftChange={setDraftMessage}
            onSend={handleSend}
            onRefresh={refreshInbox}
            onMarkRead={(thread) => markThreadRead(thread.counterpartId, thread.projectId || "")}
          />
        </div>
      </main>
    </div>
  );
}


