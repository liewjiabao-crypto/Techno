import { Navigate, useLocation } from "react-router-dom";
import { useAdminStore } from "@/store/adminStore";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const isAuthed = useAdminStore((s) => s.isAuthed);
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

