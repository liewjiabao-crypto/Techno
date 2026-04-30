import { ReceiptText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCents } from "@/utils/money";

export function OrderSummary(props: {
  itemsCount: number;
  subtotalCents: number;
  canCreate: boolean;
  onCreate: () => void;
}) {
  const { itemsCount, subtotalCents, canCreate, onCreate } = props;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-[var(--font-display)] text-lg tracking-tight">
          <ReceiptText className="h-5 w-5" />
          Summary
        </div>
        <Badge tone={canCreate ? "lime" : "danger"}>{canCreate ? "Ready" : "Needs info"}</Badge>
      </div>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[rgb(var(--muted))]">Items</span>
          <span>{itemsCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[rgb(var(--muted))]">Subtotal</span>
          <span>{formatCents(subtotalCents)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[rgb(var(--border))] pt-3">
          <span className="text-[rgb(var(--muted))]">Total</span>
          <span className="font-medium">{formatCents(subtotalCents)}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <Button size="lg" disabled={!canCreate} onClick={onCreate}>
          Create Order (Unpaid)
        </Button>
        <div className="text-xs text-[rgb(var(--muted))]">
          After creating, confirm payment on the order page, then manually set status to Accepted → Making → Completed.
        </div>
      </div>
    </Card>
  );
}

