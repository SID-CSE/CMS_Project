import React from "react";
import RoleNavbar from "../navigation/RoleNavbar";

export default function EditorNavbar({ onMenuClick, sidebarOpen = true }) {
  return <RoleNavbar role="editor" onMenuClick={onMenuClick} sidebarOpen={sidebarOpen} />;
}
