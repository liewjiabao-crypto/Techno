import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCents } from "@/utils/money";

export function PaymentCard(props: {
  customerDisplay: string;
  canConfirmPaid: boolean;
  isPaid: boolean;
  paidAt: string | null;
  totalCents: number;
  onConfirmPaid: () => void;
}) {
  const { customerDisplay, canConfirmPaid, isPaid, paidAt, totalCents, onConfirmPaid } = props;
  const [confirming, setConfirming] = useState(false);

  return (
    <Card className="p-4">
      <div className="font-[var(--font-display)] text-lg tracking-tight">Payment</div>
      <div className="mt-2 text-sm text-[rgb(var(--muted))]">Confirm only after the customer is verified as paid.</div>
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-[rgb(var(--border))] bg-[rgba(255,255,255,.02)] p-3">
        <div>
          <div className="text-xs text-[rgb(var(--muted))]">Amount Due</div>
          <div className="font-medium">{formatCents(totalCents)}</div>
        </div>
        {isPaid ? <Badge tone="lime">Paid {paidAt ? new Date(paidAt).toLocaleTimeString() : ""}</Badge> : <Badge tone="danger">Unpaid</Badge>}
      </div>

      {!isPaid ? (
        confirming ? (
          <div className="mt-4 grid gap-2">
            <div className="rounded-2xl border border-[rgba(34,211,238,.35)] bg-[rgba(34,211,238,.10)] p-3 text-sm">
              Confirm paid for {customerDisplay}? This action cannot be undone.
            </div>
            {!canConfirmPaid ? (
              <div className="rounded-2xl border border-[rgba(245,158,11,.35)] bg-[rgba(245,158,11,.10)] p-3 text-sm">
                Add a customer name or phone before proceeding.
              </div>
            ) : null}
            <div className="flex gap-2">
              <Button
                size="lg"
                disabled={!canConfirmPaid}
                onClick={() => {
                  onConfirmPaid();
                  setConfirming(false);
                }}
              >
                Confirm Paid
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button size="lg" className="mt-4 w-full" disabled={!canConfirmPaid} onClick={() => setConfirming(true)}>
            Confirm Paid
          </Button>
        )
      ) : null}
    </Card>
  );
}
