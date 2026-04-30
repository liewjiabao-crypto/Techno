import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { useOrdersStore } from "@/store/ordersStore";
import { statusLabel } from "@/utils/orderMath";
import { formatCents } from "@/utils/money";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { OrderStatus } from "@/types/order";

type PaidFilter = "ALL" | "PAID" | "UNPAID";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const orders = useOrdersStore((s) => s.orders);
  const setStatus = useOrdersStore((s) => s.setStatus);

  const [q, setQ] = useState("");
  const [paidFilter, setPaidFilter] = useState<PaidFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return orders.filter((o) => {
      if (paidFilter === "PAID" && !o.isPaid) return false;
      if (paidFilter === "UNPAID" && o.isPaid) return false;
      if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
      if (!query) return true;
      const hay = `${o.id} ${o.customerName} ${o.customerPhone}`.toLowerCase();
      return hay.includes(query);
    });
  }, [orders, paidFilter, q, statusFilter]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-[var(--font-display)] text-2xl tracking-tight">Orders</div>
          <div className="mt-1 text-sm text-[rgb(var(--muted))]">Create, confirm paid, then progress status manually.</div>
        </div>
        <Link to="/new" className="md:self-center">
          <Button size="lg">Create Order</Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--muted))]" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name / phone / order id…" className="pl-9" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
            <Select value={paidFilter} onChange={(e) => setPaidFilter(e.target.value as PaidFilter)}>
              <option value="ALL">All payments</option>
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
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
        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="font-[var(--font-display)] text-xl tracking-tight">No orders found</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">Try adjusting filters or create a new order.</div>
          </Card>
        ) : (
          filtered.map((o) => (
            <Card
              key={o.id}
              className="group cursor-pointer p-4 transition hover:bg-[rgba(255,255,255,.02)]"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/orders/${o.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/orders/${o.id}`);
              }}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate font-[var(--font-display)] text-lg tracking-tight">
                      {o.customerName || o.customerPhone || "Walk-in"}
                    </div>
                    <Badge tone={o.isPaid ? "lime" : "danger"}>{o.isPaid ? "Paid" : "Unpaid"}</Badge>
                    <Badge tone={toneForStatus(o.status)}>{statusLabel(o.status)}</Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[rgb(var(--muted))]">
                    <span>Order: {o.id}</span>
                    <span>Created: {new Date(o.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-2 md:w-[360px] md:flex-row md:items-center md:justify-end">
                  <div className="text-right text-sm">
                    <div className="text-[rgb(var(--muted))]">Total</div>
                    <div className="text-base">{formatCents(o.totalCents)}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2 md:justify-end">
                    {o.isPaid ? (
                      <Select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as Exclude<OrderStatus, "UNPAID">)} className="w-full md:w-[190px]" >
                        <option value="ACCEPTED">Order Accepted</option>
                        <option value="MAKING">Start Making</option>
                        <option value="COMPLETED">Completed</option>
                      </Select>
                    ) : (
                      <Select value="UNPAID" disabled className="w-full md:w-[190px]">
                        <option value="UNPAID">Unpaid</option>
                      </Select>
                    )}
                    <div className="hidden md:flex items-center gap-2 text-sm text-[rgb(var(--muted))] transition group-hover:text-[rgb(var(--text))]">
                      Open <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
