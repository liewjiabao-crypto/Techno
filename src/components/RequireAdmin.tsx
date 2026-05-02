import { Navigate, useLocation } from "react-router-dom";
import { useAdminStore } from "@/store/adminStore";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { isAllowedAdminEmail, supabase } from "@/lib/supabase";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const isAuthed = useAdminStore((s) => s.isAuthed);
  const location = useLocation();
  const { isReady, session, user } = useSupabaseSession();

  if (!isReady) return null;

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAllowedAdminEmail(user?.email)) {
    supabase.auth.signOut();
    return <Navigate to="/login" replace />;
  }

  return children;
}