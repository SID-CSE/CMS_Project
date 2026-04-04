import React, { useEffect, useState } from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import ContentKanban from "../../components/content/ContentKanban";
import { contentRoles, loadAuditLog, loadContentItems, updateContentStatus } from "../../components/content/contentStorage";

export default function ViewContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [items, setItems] = useState(loadContentItems("stakeholder"));
  const [auditLog, setAuditLog] = useState(loadAuditLog("stakeholder"));

  useEffect(() => {
    setItems(loadContentItems("stakeholder"));
    setAuditLog(loadAuditLog("stakeholder"));
  }, []);

  const handleAdvance = (item) => {
    const nextStatus = contentRoles.stakeholder.nextStep[item.status];
    if (!nextStatus) return;
    const result = updateContentStatus("stakeholder", item.id, nextStatus, "Stakeholder");
    setItems(result.items);
    setAuditLog(result.audit);
  };

  const handleReject = (item) => {
    const result = updateContentStatus("stakeholder", item.id, "Rejected", "Stakeholder");
    setItems(result.items);
    setAuditLog(result.audit);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <ContentKanban
            roleConfig={contentRoles.stakeholder}
            items={items}
            auditLog={auditLog}
            onAdvance={handleAdvance}
            onReject={handleReject}
          />
        </div>
      </main>
    </div>
  );
}


