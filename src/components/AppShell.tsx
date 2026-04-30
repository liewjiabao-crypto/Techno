import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, Plus, BookOpen, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { useAdminStore } from "@/store/adminStore";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useTheme();
  const lock = useAdminStore((s) => s.lock);

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_520px_at_10%_0%,rgba(236,72,153,.22),transparent_60%),radial-gradient(900px_520px_at_90%_10%,rgba(168,85,247,.18),transparent_62%),radial-gradient(820px_520px_at_55%_100%,rgba(52,211,153,.16),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:radial-gradient(rgba(121,52,96,.18)_1px,transparent_1px)] [background-size:18px_18px]" />
      <header className="relative border-b border-[rgb(var(--border))] bg-[rgba(255,255,255,.70)] backdrop-blur dark:bg-[rgba(53,26,48,.55)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-[var(--font-display)] text-lg tracking-tight">
              Beverage Counter
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--panel2))] hover:text-[rgb(var(--text))]",
                    isActive && "bg-[rgb(var(--panel2))] text-[rgb(var(--text))]",
                  )
                }
              >
                Orders
              </NavLink>
              <NavLink
                to="/new"
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--panel2))] hover:text-[rgb(var(--text))]",
                    isActive && "bg-[rgb(var(--panel2))] text-[rgb(var(--text))]",
                  )
                }
              >
                New Order
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--panel2))] hover:text-[rgb(var(--text))]",
                    isActive && "bg-[rgb(var(--panel2))] text-[rgb(var(--text))]",
                  )
                }
              >
                <BookOpen className="h-4 w-4" />
                History
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" className="hidden md:inline-flex" onClick={lock}>
              <Lock className="h-4 w-4" />
              Lock
            </Button>
            <Button variant="secondary" className="hidden md:inline-flex" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Theme
            </Button>
            <Button variant="secondary" className="md:hidden" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/new">
              <Button>
                <Plus className="h-4 w-4" />
                New
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
