import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { NewOrderDraft, Order, OrderStatus } from "@/types/order";
import { buildOrderFromDraft, calcSubtotalCents, calcTaxCents, calcTotalCents } from "@/utils/orderMath";
import { createId } from "@/utils/id";

type OrdersState = {
  orders: Order[];
  createOrder: (draft: NewOrderDraft) => string;
  updateCustomer: (id: string, next: Pick<Order, "customerName" | "customerPhone">) => void;
  updateNotes: (id: string, notes: string) => void;
  confirmPaid: (id: string) => void;
  setStatus: (id: string, status: Exclude<OrderStatus, "UNPAID">) => void;
  addItem: (id: string, item: { name: string; unitPriceCents: number }) => void;
  updateItemQty: (id: string, itemId: string, qty: number) => void;
  removeItem: (id: string, itemId: string) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
};

function recalc(order: Order): Order {
  const subtotalCents = calcSubtotalCents(order.items);
  const taxCents = calcTaxCents(subtotalCents);
  const totalCents = calcTotalCents(subtotalCents, taxCents);
  const updatedAt = new Date().toISOString();

  return { ...order, subtotalCents, taxCents, totalCents, updatedAt };
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      createOrder: (draft) => {
        const order = buildOrderFromDraft(draft);
        set((state) => ({ orders: [order, ...state.orders] }));
        return order.id;
      },
      updateCustomer: (id, next) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  customerName: next.customerName.trim(),
                  customerPhone: next.customerPhone.trim(),
                  updatedAt: new Date().toISOString(),
                }
              : o,
          ),
        }));
      },
      updateNotes: (id, notes) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, notes: notes.trim(), updatedAt: new Date().toISOString() } : o,
          ),
        }));
      },
      confirmPaid: (id) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== id) return o;
            if (o.isPaid) return o;
            const paidAt = new Date().toISOString();
            return { ...o, isPaid: true, paidAt, status: o.status === "UNPAID" ? "ACCEPTED" : o.status, updatedAt: paidAt };
          }),
        }));
      },
      setStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id && o.isPaid ? { ...o, status, updatedAt: new Date().toISOString() } : o,
          ),
        }));
      },
      addItem: (id, item) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== id) return o;
            const next: Order = {
              ...o,
              items: [
                ...o.items,
                { id: createId("item"), name: item.name.trim(), qty: 1, unitPriceCents: item.unitPriceCents },
              ],
            };
            return recalc(next);
          }),
        }));
      },
      updateItemQty: (id, itemId, qty) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== id) return o;
            const next: Order = { ...o, items: o.items.map((it) => (it.id === itemId ? { ...it, qty } : it)) };
            return recalc(next);
          }),
        }));
      },
      removeItem: (id, itemId) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== id) return o;
            const next: Order = { ...o, items: o.items.filter((it) => it.id !== itemId) };
            return recalc(next);
          }),
        }));
      },
      deleteOrder: (id) => {
        set((state) => ({ orders: state.orders.filter((o) => o.id !== id) }));
      },
      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id);
      },
    }),
    {
      name: "beverage_admin_orders_v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
