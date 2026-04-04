import { Navigate, Routes, Route } from "react-router-dom";

// Public Pages
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";
import RoleSelection from "../pages/public/RoleSelection";
import ForgotPassword from "../pages/public/ForgotPassword";

// Editor
import EditorDashboard from "../pages/editor/EditorDashboard";
import MyContent from "../pages/editor/MyContent";
import EditorMessages from "../pages/editor/EditorMessages";
import EditorProfile from "../pages/editor/EditorProfile";
import EditorProfileEdit from "../pages/editor/EditorProfileEdit";
import EditorFinance from "../pages/editor/EditorFinance";
import EditorProjects from "../pages/editor/EditorProjects";
import EditorProjectContent from "../pages/editor/EditorProjectContent";
import EditorContentViewer from "../pages/editor/EditorContentViewer";
import EditorVersionHistory from "../pages/editor/EditorVersionHistory";
import EditorNotifications from "../pages/editor/EditorNotifications";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminMessages from "../pages/admin/AdminMessages";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminProfileEdit from "../pages/admin/AdminProfileEdit";
import AdminFinance from "../pages/admin/AdminFinance";
import AdminContent from "../pages/admin/AdminContent";
import AdminProjects from "../pages/admin/AdminProjects";
import AdminProjectDetail from "../pages/admin/AdminProjectDetail";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminAuditLog from "../pages/admin/AdminAuditLog";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminStreaming from "../pages/admin/AdminStreaming";

// Stakeholder
import StakeholderDashboard from "../pages/stakeholder/StakeholderDashboard";
import ViewContent from "../pages/stakeholder/ViewContent";
import StakeholderMessages from "../pages/stakeholder/StakeholderMessages";
import StakeholderProfile from "../pages/stakeholder/StakeholderProfile";
import StakeholderProfileEdit from "../pages/stakeholder/StakeholderProfileEdit";
import StakeholderFinance from "../pages/stakeholder/StakeholderFinance";
import StakeholderHome from "../pages/stakeholder/StakeholderHome";
import StakeholderProjectView from "../pages/stakeholder/StakeholderProjectView";
import StakeholderContentViewer from "../pages/stakeholder/StakeholderContentViewer";
import StakeholderNotifications from "../pages/stakeholder/StakeholderNotifications";
import StakeholderStreaming from "../pages/stakeholder/StakeholderStreaming";
import EditorStreaming from "../pages/editor/EditorStreaming";

function normalizeRole(value) {
  return (value || "").toString().trim().toLowerCase();
}

function getDashboardPathForRole(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return "/admin/dashboard";
  }

  if (normalizedRole === "stakeholder") {
    return "/stakeholder/home";
  }

  return "/editor/dashboard";
}

function RoleDashboardRedirect() {
  const role = localStorage.getItem("userRole") || localStorage.getItem("selectedRole");
  const target = getDashboardPathForRole(role);
  return <Navigate to={target} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/roles" element={<RoleSelection />} />
      <Route path="/signup" element={<Navigate to="/roles" replace />} />
      <Route path="/signup/:roleName" element={<Signup />} />

      {/* Role-based */}
      <Route path="/dashboard" element={<RoleDashboardRedirect />} />
      <Route path="/editor/dashboard" element={<EditorDashboard />} />
      <Route path="/projects" element={<EditorProjects />} />
      <Route path="/projects/:id/content" element={<EditorProjectContent />} />
      <Route path="/content/:id/view" element={<EditorContentViewer />} />
      <Route path="/content/:id/versions" element={<EditorVersionHistory />} />
      <Route path="/notifications" element={<EditorNotifications />} />
      <Route path="/editor/streaming" element={<EditorStreaming />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/projects" element={<AdminProjects />} />
      <Route path="/admin/projects/:id" element={<AdminProjectDetail />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/audit-log" element={<AdminAuditLog />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/streaming" element={<AdminStreaming />} />

      <Route path="/stakeholder/home" element={<StakeholderHome />} />
      <Route path="/stakeholder/projects/:id" element={<StakeholderProjectView />} />
      <Route path="/stakeholder/content/:id" element={<StakeholderContentViewer />} />
      <Route path="/stakeholder/notifications" element={<StakeholderNotifications />} />
      <Route path="/stakeholder/streaming" element={<StakeholderStreaming />} />

      {/* Legacy aliases */}
      <Route path="/editor" element={<Navigate to="/editor/dashboard" replace />} />
      <Route path="/editor/content" element={<MyContent />} />
      <Route path="/editor/messages" element={<EditorMessages />} />
      <Route path="/editor/profile" element={<EditorProfile />} />
      <Route path="/editor/profile/edit" element={<EditorProfileEdit />} />
      <Route path="/editor/finance" element={<EditorFinance />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/messages" element={<AdminMessages />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/profile/edit" element={<AdminProfileEdit />} />
      <Route path="/admin/finance" element={<AdminFinance />} />
      <Route path="/admin/content" element={<AdminContent />} />
      <Route path="/stakeholder" element={<Navigate to="/stakeholder/home" replace />} />
      <Route path="/editor-home" element={<Navigate to="/dashboard" replace />} />
      <Route path="/stakeholder-dashboard" element={<StakeholderDashboard />} />
      <Route path="/stakeholder/content" element={<ViewContent />} />
      <Route path="/stakeholder/messages" element={<StakeholderMessages />} />
      <Route path="/stakeholder/profile" element={<StakeholderProfile />} />
      <Route path="/stakeholder/profile/edit" element={<StakeholderProfileEdit />} />
      <Route path="/stakeholder/finance" element={<StakeholderFinance />} />
      <Route path="/role-dashboard" element={<RoleDashboardRedirect />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
