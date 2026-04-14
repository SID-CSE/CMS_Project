import React from "react";
import RoleNavbar from "../navigation/RoleNavbar";

export default function AdminNavbar({
  onMenuClick,
  onNotificationClick,
  notifications = [],
  sidebarOpen = true,
}) {
  return (
    <RoleNavbar
      role="admin"
      onMenuClick={onMenuClick}
      onNotificationClick={onNotificationClick}
      notifications={notifications}
      sidebarOpen={sidebarOpen}
    />
  );
}
