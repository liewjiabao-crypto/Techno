import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAdminStore((s) => s.login);

  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState("");

  const from = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from || "/";
  }, [location.state]);

  return (
    <div className="mx-auto grid max-w-xl gap-4 pt-8">
      <div className="text-center">
        <div className="font-[var(--font-display)] text-3xl tracking-tight">Admin Check</div>
        <div className="mt-1 text-sm text-[rgb(var(--muted))]">Enter your Admin ID to start taking orders.</div>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-[var(--font-display)] text-lg tracking-tight">
            <ShieldCheck className="h-5 w-5" />
            Admin ID
          </div>
          <Badge tone="amber">Required</Badge>
        </div>

        <div className="mt-4 grid gap-2">
          <Input
            value={adminId}
            onChange={(e) => {
              setAdminId(e.target.value);
              setError("");
            }}
            placeholder="e.g. ADMIN-001"
            autoFocus
          />
          {error ? <div className="text-sm text-[rgb(var(--danger))]">{error}</div> : null}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              const ok = login(adminId);
              if (!ok) {
                setError("Invalid Admin ID.");
                return;
              }
              navigate(from, { replace: true });
            }}
          >
            Continue
          </Button>
        </div>

        <div className="mt-4 text-xs text-[rgb(var(--muted))]">
          This is a local admin tool. For stronger security, connect to a backend authentication service.
        </div>
      </Card>
    </div>
  );
}

