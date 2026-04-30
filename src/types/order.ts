export type OrderStatus = "UNPAID" | "ACCEPTED" | "MAKING" | "COMPLETED";

export type OrderItem = {
  id: string;
  name: string;
  qty: number;
  unitPriceCents: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  isPaid: boolean;
  status: OrderStatus;
  items: OrderItem[];
  notes: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
};

export type NewOrderDraft = {
  customerName: string;
  customerPhone: string;
  items: Array<Pick<OrderItem, "name" | "qty" | "unitPriceCents">>;
  notes: string;
};
