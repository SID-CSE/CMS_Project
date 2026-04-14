import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPathForRole } from "../services/authService";

function normalizeRole(role) {
  return (role || "").toString().trim().toUpperCase();
}

export default function RoleRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  const currentRole = normalizeRole(user.role);
  const allowed = allowedRoles.map(normalizeRole);
  if (!allowed.includes(currentRole)) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />;
  }

  return children;
}