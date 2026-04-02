import { Navigate, Routes, Route } from "react-router-dom";

// Public Pages
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";

// Editor
import EditorDashboard from "../pages/editor/EditorDashboard";
import MyContent from "../pages/editor/MyContent";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";

// Stakeholder
import StakeholderDashboard from "../pages/stakeholder/StakeholderDashboard";
import ViewContent from "../pages/stakeholder/ViewContent";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Role-based */}
      <Route path="/editor" element={<EditorDashboard />} />
      <Route path="/editor/content" element={<MyContent />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/stakeholder" element={<StakeholderDashboard />} />
      <Route path="/stakeholder/content" element={<ViewContent />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
