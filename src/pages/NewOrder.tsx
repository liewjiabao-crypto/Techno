import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrdersStore } from "@/store/ordersStore";
import { hasCustomerIdentifier } from "@/utils/orderMath";
import { phoneErrorMessage, sanitizeMyPhoneInput } from "@/utils/myPhone";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { QuickMenu } from "@/components/new-order/QuickMenu";
import { ItemsEditor, type DraftItem } from "@/components/new-order/ItemsEditor";
import { OrderSummary } from "@/components/new-order/OrderSummary";
import type { NewOrderDraft } from "@/types/order";

export default function NewOrder() {
  const navigate = useNavigate();
  const createOrder = useOrdersStore((s) => s.createOrder);

  const [items, setItems] = useState<DraftItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const subtotalCents = useMemo(() => items.reduce((sum, it) => sum + it.qty * it.unitPriceCents, 0), [items]);

  const phoneError = phoneErrorMessage(customerPhone);
  const canCreate = items.length > 0 && hasCustomerIdentifier({ customerName, customerPhone }) && !phoneError;

  function addPreset(name: string, unitPriceCents: number) {
    setItems((prev) => {
      const found = prev.find((p) => p.name === name && p.unitPriceCents === unitPriceCents);
      if (!found) return [...prev, { name, unitPriceCents, qty: 1 }];
      return prev.map((p) => (p === found ? { ...p, qty: p.qty + 1 } : p));
    });
  }

  function changeQty(index: number, delta: number) {
    setItems((prev) =>
      prev
        .map((it, i) => (i === index ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
        .filter((it) => it.qty > 0),
    );
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function addCustom(name: string, unitPriceCents: number) {
    addPreset(name, unitPriceCents);
  }

  function onCreate() {
    const draft: NewOrderDraft = {
      customerName,
      customerPhone,
      notes,
      items: items.map((it) => ({ name: it.name, qty: it.qty, unitPriceCents: it.unitPriceCents })),
    };
    const id = createOrder(draft);
    navigate(`/orders/${id}`);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
      <div className="grid gap-4">
        <div>
          <div className="font-[var(--font-display)] text-2xl tracking-tight">New Order</div>
          <div className="mt-1 text-sm text-[rgb(var(--muted))]">Add items, then enter customer name or phone before payment.</div>
        </div>
        <QuickMenu onAdd={addPreset} />
        <ItemsEditor items={items} onAddCustom={addCustom} onChangeQty={changeQty} onRemove={removeItem} />

        <Card className="p-4">
          <div className="font-[var(--font-display)] text-lg tracking-tight">Customer Info (Required before payment)</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <div className="text-xs text-[rgb(var(--muted))]">Name</div>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Aina" />
            </div>
            <div className="grid gap-2">
              <div className="text-xs text-[rgb(var(--muted))]">Phone</div>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(sanitizeMyPhoneInput(e.target.value))}
                placeholder="e.g. 0123456789 or +60123456789"
                inputMode="tel"
              />
              {phoneError ? <div className="text-xs text-[rgb(var(--danger))]">{phoneError}</div> : null}
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            <div className="text-xs text-[rgb(var(--muted))]">Notes (optional)</div>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Less ice, extra shot, etc." />
          </div>
        </Card>
      </div>

      <div className="grid gap-4">
        <OrderSummary
          itemsCount={items.reduce((s, it) => s + it.qty, 0)}
          subtotalCents={subtotalCents}
          canCreate={canCreate}
          onCreate={onCreate}
        />
      </div>
    </div>
  );
}
