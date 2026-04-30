import { describe, expect, it } from "vitest";
import { buildOrderFromDraft, calcSubtotalCents, hasCustomerIdentifier } from "@/utils/orderMath";

describe("orderMath", () => {
  it("calculates subtotal in cents", () => {
    const subtotal = calcSubtotalCents([
      { qty: 2, unitPriceCents: 500 },
      { qty: 1, unitPriceCents: 1200 },
    ]);
    expect(subtotal).toBe(2200);
  });

  it("requires customer identifier (name or phone)", () => {
    expect(hasCustomerIdentifier({ customerName: "", customerPhone: "" })).toBe(false);
    expect(hasCustomerIdentifier({ customerName: "  ", customerPhone: "" })).toBe(false);
    expect(hasCustomerIdentifier({ customerName: "Aina", customerPhone: "" })).toBe(true);
    expect(hasCustomerIdentifier({ customerName: "", customerPhone: "0123" })).toBe(true);
  });

  it("builds a new unpaid order with computed totals", () => {
    const order = buildOrderFromDraft({
      customerName: "Aina",
      customerPhone: "",
      notes: "Less ice",
      items: [
        { name: "Latte", qty: 1, unitPriceCents: 1100 },
        { name: "Espresso", qty: 2, unitPriceCents: 600 },
      ],
    });

    expect(order.isPaid).toBe(false);
    expect(order.status).toBe("UNPAID");
    expect(order.subtotalCents).toBe(2300);
    expect(order.totalCents).toBe(2300);
    expect(order.paidAt).toBeNull();
  });
});

