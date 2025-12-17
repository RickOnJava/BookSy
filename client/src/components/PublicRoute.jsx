// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return null;

  return token ? <Navigate to="/" replace /> : children;
}
