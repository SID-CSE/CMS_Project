import React, { useEffect, useState } from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import ContentKanban from "../../components/content/ContentKanban";
import { contentRoles, loadAuditLog, loadContentItems } from "../../components/content/contentStorage";

export default function ViewContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [items, setItems] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([loadContentItems("stakeholder"), loadAuditLog("stakeholder")])
      .then(([nextItems, nextAudit]) => {
        if (!active) return;
        setItems(nextItems);
        setAuditLog(nextAudit);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
        setAuditLog([]);
      });

    return () => {
      active = false;
    };
  }, []);

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
          />
        </div>
      </main>
    </div>
  );
}


