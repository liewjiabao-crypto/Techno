import { Card } from "@/components/ui/Card";
import { formatCents } from "@/utils/money";

export function ReceiptCard(props: {
  items: Array<{ id: string; name: string; qty: number; unitPriceCents: number }>;
  totalCents: number;
}) {
  const { items, totalCents } = props;

  return (
    <Card className="p-4">
      <div className="font-[var(--font-display)] text-lg tracking-tight">Receipt</div>
      <div className="mt-3 grid gap-2">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between text-sm">
            <div className="min-w-0">
              <div className="truncate">{it.name}</div>
              <div className="text-xs text-[rgb(var(--muted))]">
                {it.qty} × {formatCents(it.unitPriceCents)}
              </div>
            </div>
            <div className="text-right">{formatCents(it.qty * it.unitPriceCents)}</div>
          </div>
        ))}
        <div className="mt-2 border-t border-[rgb(var(--border))] pt-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[rgb(var(--muted))]">Total</span>
            <span className="font-medium">{formatCents(totalCents)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

