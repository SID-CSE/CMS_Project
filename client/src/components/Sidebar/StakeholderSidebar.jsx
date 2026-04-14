import React from "react";
import RoleSidebar from "../navigation/RoleSidebar";

export default function StakeholderSidebar({ width = 280, open = true, onClose }) {
  return <RoleSidebar role="stakeholder" width={width} open={open} onClose={onClose} />;
}
