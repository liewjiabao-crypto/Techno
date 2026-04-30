import { MENU_ITEMS } from "@/data/menu";
import { formatCents } from "@/utils/money";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function QuickMenu({ onAdd }: { onAdd: (name: string, unitPriceCents: number) => void }) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-[var(--font-display)] text-lg tracking-tight">Quick Menu</div>
        <div className="text-xs text-[rgb(var(--muted))]">Tap to add</div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {MENU_ITEMS.map((m) => (
          <button
            key={m.name}
            type="button"
            onClick={() => onAdd(m.name, m.unitPriceCents)}
            className="group rounded-2xl border border-[rgb(var(--border))] bg-[rgba(255,255,255,.02)] p-3 text-left transition hover:bg-[rgba(255,255,255,.04)]"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">{m.name}</div>
              {m.tag ? <Badge tone={m.tag === "hot" ? "amber" : "cyan"}>{m.tag.toUpperCase()}</Badge> : null}
            </div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">{formatCents(m.unitPriceCents)}</div>
            <div className="mt-2 text-xs text-[rgb(var(--muted))] transition group-hover:text-[rgb(var(--text))]">Add</div>
          </button>
        ))}
      </div>
    </Card>
  );
}

