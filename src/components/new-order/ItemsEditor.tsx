import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCents } from "@/utils/money";

export type DraftItem = { name: string; qty: number; unitPriceCents: number };

export function ItemsEditor(props: {
  items: DraftItem[];
  onAddCustom: (name: string, unitPriceCents: number) => void;
  onChangeQty: (index: number, delta: number) => void;
  onRemove: (index: number) => void;
}) {
  const { items, onAddCustom, onChangeQty, onRemove } = props;

  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  function priceToCents(input: string) {
    const cleaned = input.replace(/[^\d.]/g, "");
    const asNumber = Number(cleaned);
    if (!Number.isFinite(asNumber)) return 0;
    return Math.max(0, Math.round(asNumber * 100));
  }

  function addCustom() {
    const name = customName.trim();
    const unitPriceCents = priceToCents(customPrice);
    if (!name || unitPriceCents <= 0) return;
    onAddCustom(name, unitPriceCents);
    setCustomName("");
    setCustomPrice("");
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-[var(--font-display)] text-lg tracking-tight">Order Items</div>
          <div className="mt-1 text-sm text-[rgb(var(--muted))]">Quantity and prices are editable per line.</div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Custom item" />
          <Input value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} placeholder="RM 0.00" inputMode="decimal" />
          <Button variant="secondary" onClick={addCustom}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] p-6 text-center text-sm text-[rgb(var(--muted))]">
            Add a menu item to start.
          </div>
        ) : (
          items.map((it, i) => (
            <div
              key={`${it.name}-${i}`}
              className="flex flex-col gap-2 rounded-2xl border border-[rgb(var(--border))] bg-[rgba(255,255,255,.02)] p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{it.name}</div>
                <div className="mt-1 text-xs text-[rgb(var(--muted))]">{formatCents(it.unitPriceCents)} each</div>
              </div>
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onChangeQty(i, -1)} aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-10 text-center text-sm">{it.qty}</div>
                  <Button variant="secondary" size="sm" onClick={() => onChangeQty(i, 1)} aria-label="Increase quantity">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-24 text-right text-sm">{formatCents(it.qty * it.unitPriceCents)}</div>
                <Button variant="ghost" size="sm" onClick={() => onRemove(i)}>
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
