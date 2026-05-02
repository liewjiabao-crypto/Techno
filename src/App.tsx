import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { RequireAdmin } from "@/components/RequireAdmin";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import NewOrder from "@/pages/NewOrder";
import OrderDetail from "@/pages/OrderDetail";
import Login from "@/pages/Login";

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <RequireAdmin>
              <AppShell>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/new" element={<NewOrder />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppShell>
            </RequireAdmin>
          }
        />
      </Routes>
    </Router>
  );
}