import React, { useState } from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import ProfileLayout from "../../components/profile/ProfileLayout";
import EditorProfileSettings from "../../components/profile/editor/EditorProfileSettings";

export default function EditorProfileEdit() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <ProfileLayout
            title="Edit Profile"
            basePath="/editor/profile"
            roleKey="editor"
            tabs={[
              { to: "/editor/profile", label: "Profile" },
              { to: "/editor/profile/edit", label: "Edit Profile" },
              { to: "/editor/messages", label: "Messages" },
              { to: "/editor/finance", label: "Finance" },
              { to: "/editor", label: "Dashboard" },
            ]}
          >
            <EditorProfileSettings />
          </ProfileLayout>
        </div>
      </main>
    </div>
  );
}


