import React, { useEffect, useState } from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import ContentKanban from "../../components/content/ContentKanban";
import { contentRoles, createContentDraft, loadAuditLog, loadContentItems, updateContentStatus } from "../../components/content/contentStorage";

export default function MyContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [items, setItems] = useState(loadContentItems("editor"));
  const [auditLog, setAuditLog] = useState(loadAuditLog("editor"));

  useEffect(() => {
    setItems(loadContentItems("editor"));
    setAuditLog(loadAuditLog("editor"));
  }, []);

  const handleAdvance = (item) => {
    const nextStatus = contentRoles.editor.nextStep[item.status];
    if (!nextStatus) return;
    const result = updateContentStatus("editor", item.id, nextStatus, "Editor");
    setItems(result.items);
    setAuditLog(result.audit);
  };

  const handleReject = (item) => {
    const result = updateContentStatus("editor", item.id, "Rejected", "Editor");
    setItems(result.items);
    setAuditLog(result.audit);
  };

  const handleCreateDraft = (draft) => {
    const nextItems = createContentDraft("editor", draft);
    setItems(nextItems);
    setAuditLog(loadAuditLog("editor"));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <ContentKanban
            roleConfig={contentRoles.editor}
            items={items}
            auditLog={auditLog}
            onAdvance={handleAdvance}
            onReject={handleReject}
            onCreateDraft={handleCreateDraft}
          />
        </div>
      </main>
    </div>
  );
}


