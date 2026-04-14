import React from "react";
import RoleSidebar from "../navigation/RoleSidebar";

export default function EditorSidebar({ width = 280, open = true, onClose }) {
  return <RoleSidebar role="editor" width={width} open={open} onClose={onClose} />;
}
