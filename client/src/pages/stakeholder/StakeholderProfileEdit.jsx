import React, { useEffect, useState } from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import ProfileLayout from "../../components/profile/ProfileLayout";
import RoleProfileEdit from "../../components/profile/RoleProfileEdit";
import { roleProfileConfig } from "../../components/profile/roleProfileConfig";
import { loadRoleProfile, saveRoleProfile } from "../../components/profile/profileStorage";

export default function StakeholderProfileEdit() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const config = roleProfileConfig.stakeholder;
  const [initialProfile, setInitialProfile] = useState(config.defaultProfile);

  useEffect(() => {
    let active = true;
    loadRoleProfile("stakeholder")
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
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <ProfileLayout
            title="Edit Profile"
            basePath="/stakeholder/profile"
            roleKey="stakeholder"
            tabs={[
              { to: "/stakeholder/profile", label: "Profile" },
              { to: "/stakeholder/profile/edit", label: "Edit Profile" },
              { to: "/stakeholder/messages", label: "Messages" },
              { to: "/stakeholder/finance", label: "Finance" },
              { to: "/stakeholder", label: "Dashboard" },
            ]}
          >
            <RoleProfileEdit
              roleConfig={config}
              initialProfile={initialProfile}
              basePath="/stakeholder/profile"
              onSave={async (profile) => saveRoleProfile("stakeholder", profile)}
            />
          </ProfileLayout>
        </div>
      </main>
    </div>
  );
}


