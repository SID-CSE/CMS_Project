import React, { useEffect, useState } from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import ProfileLayout from "../../components/profile/ProfileLayout";
import RoleProfileEdit from "../../components/profile/RoleProfileEdit";
import { roleProfileConfig } from "../../components/profile/roleProfileConfig";
import { loadRoleProfile, saveRoleProfile } from "../../components/profile/profileStorage";

export default function EditorProfileEdit() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const config = roleProfileConfig.editor;
  const [initialProfile, setInitialProfile] = useState(config.defaultProfile);

  useEffect(() => {
    let active = true;
    loadRoleProfile("editor")
      .then((nextProfile) => {
        if (active) setInitialProfile(nextProfile);
      })
      .catch(() => {
        if (active) setInitialProfile(config.defaultProfile);
      });

    return () => {
      active = false;
    };
  }, [config.defaultProfile]);

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
            <RoleProfileEdit
              roleConfig={config}
              initialProfile={initialProfile}
              basePath="/editor/profile"
              onSave={async (profile) => saveRoleProfile("editor", profile)}
            />
          </ProfileLayout>
        </div>
      </main>
    </div>
  );
}


