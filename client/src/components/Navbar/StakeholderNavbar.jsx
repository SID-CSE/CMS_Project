import React from "react";
import RoleNavbar from "../navigation/RoleNavbar";

export default function StakeholderNavbar({ onMenuClick, sidebarOpen = true }) {
  return <RoleNavbar role="stakeholder" onMenuClick={onMenuClick} sidebarOpen={sidebarOpen} />;
}
