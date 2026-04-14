import React, { useEffect, useState } from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import ProfileLayout from "../../components/profile/ProfileLayout";
import RoleProfileView from "../../components/profile/RoleProfileView";
import { roleProfileConfig } from "../../components/profile/roleProfileConfig";
import { loadRoleProfile } from "../../components/profile/profileStorage";

export default function StakeholderProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const config = roleProfileConfig.stakeholder;
  const [profile, setProfile] = useState(config.defaultProfile);

  useEffect(() => {
    let active = true;
    loadRoleProfile("stakeholder")
      .then((nextProfile) => {
        if (active) setProfile(nextProfile);
      })
      .catch(() => {
        if (active) setProfile(config.defaultProfile);
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
            title="Profile"
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
            <RoleProfileView roleConfig={config} profile={profile} basePath="/stakeholder/profile" />
          </ProfileLayout>
        </div>
      </main>
    </div>
  );
}


