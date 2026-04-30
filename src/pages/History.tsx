import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Search } from "lucide-react";
import { useOrdersStore } from "@/store/ordersStore";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { formatCents } from "@/utils/money";
import { statusLabel } from "@/utils/orderMath";
import type { OrderStatus } from "@/types/order";

type StatusFilter = "ALL" | OrderStatus;

function toneForStatus(status: OrderStatus) {
  switch (status) {
    case "UNPAID":
      return "danger";
    case "ACCEPTED":
      return "amber";
    case "MAKING":
      return "cyan";
    case "COMPLETED":
      return "lime";
  }
}

export default function History() {
  const navigate = useNavigate();
  const orders = useOrdersStore((s) => s.orders);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== "ALL" && o.status !== status) return false;
      if (!query) return true;
      const hay = `${o.id} ${o.customerName} ${o.customerPhone}`.toLowerCase();
      return hay.includes(query);
    });
  }, [orders, q, status]);

  const stats = useMemo(() => {
    const totalCents = filtered.reduce((s, o) => s + o.totalCents, 0);
    const paidCount = filtered.filter((o) => o.isPaid).length;
    return { totalCents, paidCount, count: filtered.length };
  }, [filtered]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-[var(--font-display)] text-2xl tracking-tight">Order History</div>
          <div className="mt-1 text-sm text-[rgb(var(--muted))]">Review past orders across all statuses.</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{stats.count} orders</Badge>
          <Badge tone="lime">{stats.paidCount} paid</Badge>
          <Badge tone="cyan">{formatCents(stats.totalCents)}</Badge>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--muted))]" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name / phone / order id…" className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[rgb(var(--muted))]" />
            <Select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} className="w-[210px]">
              <option value="ALL">All status</option>
              <option value="UNPAID">Unpaid</option>
              <option value="ACCEPTED">Order Accepted</option>
              <option value="MAKING">Start Making</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid gap-3">
        {filtered.map((o) => (
          <Card
            key={o.id}
            className="cursor-pointer p-4 transition hover:bg-[rgba(255,255,255,.35)] dark:hover:bg-[rgba(255,255,255,.06)]"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/orders/${o.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/orders/${o.id}`);
            }}
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="truncate font-[var(--font-display)] text-lg tracking-tight">{o.customerName || o.customerPhone || "Walk-in"}</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge tone={o.isPaid ? "lime" : "danger"}>{o.isPaid ? "Paid" : "Unpaid"}</Badge>
                  <Badge tone={toneForStatus(o.status)}>{statusLabel(o.status)}</Badge>
                </div>
                <div className="mt-2 text-xs text-[rgb(var(--muted))]">
                  {new Date(o.createdAt).toLocaleString()} • {o.id}
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="text-[rgb(var(--muted))]">Total</div>
                <div className="text-base font-semibold">{formatCents(o.totalCents)}</div>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="font-[var(--font-display)] text-xl tracking-tight">No history found</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">Try a different search or status filter.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

