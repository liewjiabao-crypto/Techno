import { CheckCircle2, CircleDashed, CookingPot } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import type { OrderStatus } from "@/types/order";

function stepTone(status: OrderStatus, step: Exclude<OrderStatus, "UNPAID">) {
  if (status === "UNPAID") return "neutral";
  const rank = { ACCEPTED: 1, MAKING: 2, COMPLETED: 3 } as const;
  return rank[status] >= rank[step] ? "lime" : "neutral";
}

export function StatusCard(props: { isPaid: boolean; status: OrderStatus; onSetStatus: (status: Exclude<OrderStatus, "UNPAID">) => void }) {
  const { isPaid, status, onSetStatus } = props;

  return (
    <Card className="p-4">
      <div className="font-[var(--font-display)] text-lg tracking-tight">Status</div>
      <div className="mt-2 text-sm text-[rgb(var(--muted))]">Manually move the order forward after payment.</div>

      <div className="mt-4 grid gap-3">
        <div className="grid gap-2">
          <div className="text-xs text-[rgb(var(--muted))]">Current status</div>
          {isPaid ? (
            <Select value={status} onChange={(e) => onSetStatus(e.target.value as Exclude<OrderStatus, "UNPAID">)}>
              <option value="ACCEPTED">Order Accepted</option>
              <option value="MAKING">Start Making</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          ) : (
            <Select value="UNPAID" disabled>
              <option value="UNPAID">Unpaid</option>
            </Select>
          )}
        </div>

        <div className="grid gap-2 rounded-2xl border border-[rgb(var(--border))] bg-[rgba(255,255,255,.02)] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CircleDashed className="h-4 w-4 text-[rgb(var(--muted))]" />
              <span className="text-[rgb(var(--muted))]">Order Accepted</span>
            </div>
            <Badge tone={stepTone(status, "ACCEPTED")}>{stepTone(status, "ACCEPTED") === "lime" ? "Done" : "Next"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CookingPot className="h-4 w-4 text-[rgb(var(--muted))]" />
              <span className="text-[rgb(var(--muted))]">Start Making</span>
            </div>
            <Badge tone={stepTone(status, "MAKING")}>{stepTone(status, "MAKING") === "lime" ? "Done" : "Pending"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-[rgb(var(--muted))]" />
              <span className="text-[rgb(var(--muted))]">Completed</span>
            </div>
            <Badge tone={stepTone(status, "COMPLETED")}>{stepTone(status, "COMPLETED") === "lime" ? "Done" : "Pending"}</Badge>
          </div>
        </div>

        {!isPaid ? (
          <div className="rounded-2xl border border-[rgba(245,158,11,.35)] bg-[rgba(245,158,11,.10)] p-3 text-sm">
            Status is locked until payment is confirmed.
          </div>
        ) : null}
      </div>
    </Card>
  );
}

