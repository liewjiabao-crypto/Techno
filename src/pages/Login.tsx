import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginAdminId = useAdminStore((s) => s.login);

  const [adminId, setAdminId] = useState("");
  const [adminIdError, setAdminIdError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sent, setSent] = useState(false);

  const from = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from || "/";
  }, [location.state]);

  const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;

  return (
    <div className="mx-auto grid max-w-xl gap-4 pt-8">
      <div className="text-center">
        <div className="font-[var(--font-display)] text-3xl tracking-tight">Admin Login</div>
        <div className="mt-1 text-sm text-[rgb(var(--muted))]">Enter Admin ID and sign in with email to sync orders.</div>
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
              setAdminIdError("");
            }}
            placeholder="e.g. ADMIN-001"
            autoFocus
          />
          {adminIdError ? <div className="text-sm text-[rgb(var(--danger))]">{adminIdError}</div> : null}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              const ok = loginAdminId(adminId);
              if (!ok) {
                setAdminIdError("Invalid Admin ID.");
                return;
              }
              navigate(from, { replace: true });
            }}
          >
            Continue
          </Button>
        </div>

        <div className="mt-6 border-t border-[rgb(var(--border))] pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-[var(--font-display)] text-lg tracking-tight">
              <Mail className="h-5 w-5" />
              Supabase Magic Link
            </div>
            <Badge tone="amber">Required for sync</Badge>
          </div>

          <div className="mt-3 text-sm text-[rgb(var(--muted))]">
            This enables cross-device syncing and Google Sheets logging.
          </div>

          <div className="mt-4 grid gap-2">
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setSent(false);
              }}
              placeholder="e.g. liewjiabao@gmail.com"
              inputMode="email"
            />
            {emailError ? <div className="text-sm text-[rgb(var(--danger))]">{emailError}</div> : null}
            {sent ? <div className="text-sm text-[rgb(var(--muted))]">Magic link sent. Check your email.</div> : null}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOtp({
                  email: email.trim(),
                  options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
                });
                if (error) {
                  setEmailError(error.message);
                  return;
                }
                setSent(true);
              }}
            >
              Send Magic Link
            </Button>
          </div>

          <div className="mt-4 text-xs text-[rgb(var(--muted))]">
            Your admin email must exist in Supabase Auth → Users.
          </div>
        </div>
      </Card>
    </div>
  );
}