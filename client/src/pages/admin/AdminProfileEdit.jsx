import React from "react";
import { useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import ProfileLayout from "../../components/profile/ProfileLayout";
import RoleProfileEdit from "../../components/profile/RoleProfileEdit";
import { roleProfileConfig } from "../../components/profile/roleProfileConfig";
import { readRoleProfile, saveRoleProfile } from "../../components/profile/profileStorage";

export default function AdminProfileEdit() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const config = roleProfileConfig.admin;
  const initialProfile = readRoleProfile("admin");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <ProfileLayout
            title="Edit Profile"
            basePath="/admin/profile"
            roleKey="admin"
            tabs={[
              { to: "/admin/profile", label: "Profile" },
              { to: "/admin/profile/edit", label: "Edit Profile" },
              { to: "/admin/messages", label: "Messages" },
              { to: "/admin/finance", label: "Finance" },
              { to: "/admin", label: "Dashboard" },
            ]}
          >
            <RoleProfileEdit
              roleConfig={config}
              initialProfile={initialProfile}
              basePath="/admin/profile"
              onSave={async (profile) => saveRoleProfile("admin", profile)}
            />
          </ProfileLayout>
        </div>
      </main>
    </div>
  );
}


