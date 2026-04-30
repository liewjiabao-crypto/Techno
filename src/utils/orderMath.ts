import type { NewOrderDraft, Order, OrderItem, OrderStatus } from "@/types/order";
import { createId } from "@/utils/id";

export const TAX_RATE = 0;

export function calcSubtotalCents(items: Array<Pick<OrderItem, "qty" | "unitPriceCents">>) {
  return items.reduce((sum, item) => sum + item.qty * item.unitPriceCents, 0);
}

export function calcTaxCents(subtotalCents: number) {
  return Math.round(subtotalCents * TAX_RATE);
}

export function calcTotalCents(subtotalCents: number, taxCents: number) {
  return subtotalCents + taxCents;
}

export function hasCustomerIdentifier(draft: Pick<NewOrderDraft, "customerName" | "customerPhone">) {
  return Boolean(draft.customerName.trim() || draft.customerPhone.trim());
}

export function statusLabel(status: OrderStatus) {
  switch (status) {
    case "UNPAID":
      return "Unpaid";
    case "ACCEPTED":
      return "Order Accepted";
    case "MAKING":
      return "Start Making";
    case "COMPLETED":
      return "Completed";
  }
}

export function buildOrderFromDraft(draft: NewOrderDraft): Order {
  const now = new Date().toISOString();
  const items: OrderItem[] = draft.items.map((i) => ({
    id: createId("item"),
    name: i.name.trim(),
    qty: i.qty,
    unitPriceCents: i.unitPriceCents,
  }));
  const subtotalCents = calcSubtotalCents(items);
  const taxCents = calcTaxCents(subtotalCents);
  const totalCents = calcTotalCents(subtotalCents, taxCents);

  return {
    id: createId("order"),
    customerName: draft.customerName.trim(),
    customerPhone: draft.customerPhone.trim(),
    isPaid: false,
    status: "UNPAID",
    items,
    notes: draft.notes.trim(),
    subtotalCents,
    taxCents,
    totalCents,
    createdAt: now,
    updatedAt: now,
    paidAt: null,
  };
}

export function canSetStatus(order: Pick<Order, "isPaid">) {
  return order.isPaid;
}
