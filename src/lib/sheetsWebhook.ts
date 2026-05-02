import type { Order } from "@/types/order";

type SheetEvent = "order_created" | "order_updated" | "order_paid" | "order_status_changed" | "order_deleted";

export async function pushToGoogleSheet(event: SheetEvent, order: Order) {
  const url = import.meta.env.VITE_SHEETS_WEBHOOK_URL as string | undefined;
  if (!url) return;

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "content-type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ event, sentAt: new Date().toISOString(), order }),
  });
}