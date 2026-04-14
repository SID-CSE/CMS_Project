import React, { useEffect, useState } from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import ContentKanban from "../../components/content/ContentKanban";
import { contentRoles, loadAuditLog, loadContentItems } from "../../components/content/contentStorage";

export default function MyContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [items, setItems] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([loadContentItems("editor"), loadAuditLog("editor")])
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
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <ContentKanban
            roleConfig={contentRoles.editor}
            items={items}
            auditLog={auditLog}
          />
        </div>
      </main>
    </div>
  );
}


