import React from "react";
import RoleSidebar from "../navigation/RoleSidebar";

export default function AdminSidebar({ width = 280, open = true, onClose }) {
  return <RoleSidebar role="admin" width={width} open={open} onClose={onClose} allowScroll={false} />;
}
