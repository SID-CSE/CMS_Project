import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import ContentKanban from "../../components/content/ContentKanban";
import { contentRoles, createContentDraft, loadAuditLog, loadContentItems, updateContentStatus } from "../../components/content/contentStorage";

export default function AdminContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [items, setItems] = useState(loadContentItems("admin"));
  const [auditLog, setAuditLog] = useState(loadAuditLog("admin"));

  useEffect(() => {
    setItems(loadContentItems("admin"));
    setAuditLog(loadAuditLog("admin"));
  }, []);

  const refresh = () => {
    setItems(loadContentItems("admin"));
    setAuditLog(loadAuditLog("admin"));
  };

  const handleAdvance = (item) => {
    const nextStatus = contentRoles.admin.nextStep[item.status];
    if (!nextStatus) return;
    const result = updateContentStatus("admin", item.id, nextStatus, "Admin");
    setItems(result.items);
    setAuditLog(result.audit);
  };

  const handleReject = (item) => {
    const result = updateContentStatus("admin", item.id, "Rejected", "Admin");
    setItems(result.items);
    setAuditLog(result.audit);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <ContentKanban
            roleConfig={contentRoles.admin}
            items={items}
            auditLog={auditLog}
            onAdvance={handleAdvance}
            onReject={handleReject}
            onCreateDraft={() => refresh()}
          />
        </div>
      </main>
    </div>
  );
}


