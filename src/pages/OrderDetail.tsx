import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useOrdersStore } from "@/store/ordersStore";
import { hasCustomerIdentifier, statusLabel } from "@/utils/orderMath";
import { phoneErrorMessage } from "@/utils/myPhone";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReceiptCard } from "@/components/order-detail/ReceiptCard";
import { CustomerCard } from "@/components/order-detail/CustomerCard";
import { PaymentCard } from "@/components/order-detail/PaymentCard";
import { StatusCard } from "@/components/order-detail/StatusCard";

export default function OrderDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const order = useOrdersStore((s) => s.getOrderById(id));
  const confirmPaid = useOrdersStore((s) => s.confirmPaid);
  const setStatus = useOrdersStore((s) => s.setStatus);
  const updateCustomer = useOrdersStore((s) => s.updateCustomer);
  const updateNotes = useOrdersStore((s) => s.updateNotes);
  const deleteOrder = useOrdersStore((s) => s.deleteOrder);

  const customerDisplay = useMemo(() => {
    if (!order) return "";
    return order.customerName || order.customerPhone || "Walk-in";
  }, [order]);

  if (!order) {
    return (
      <Card className="p-10 text-center">
        <div className="font-[var(--font-display)] text-xl tracking-tight">Order not found</div>
        <div className="mt-3">
          <Link to="/">
            <Button variant="secondary">Back to orders</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
      <div className="grid gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-[var(--font-display)] text-2xl tracking-tight">{customerDisplay}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[rgb(var(--muted))]">
              <span>Order: {order.id}</span>
              <span>•</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={order.isPaid ? "lime" : "danger"}>{order.isPaid ? "Paid" : "Unpaid"}</Badge>
            <Badge tone={order.status === "COMPLETED" ? "lime" : order.status === "MAKING" ? "cyan" : order.status === "ACCEPTED" ? "amber" : "danger"}>
              {statusLabel(order.status)}
            </Badge>
          </div>
        </div>

        <ReceiptCard items={order.items} totalCents={order.totalCents} />
        <CustomerCard
          customerName={order.customerName}
          customerPhone={order.customerPhone}
          notes={order.notes}
          onChangeCustomer={(next) => updateCustomer(order.id, next)}
          onChangeNotes={(next) => updateNotes(order.id, next)}
          onDelete={() => {
            const ok = window.confirm("Delete this order?");
            if (!ok) return;
            deleteOrder(order.id);
            navigate("/");
          }}
        />
      </div>

      <div className="grid gap-4">
        <PaymentCard
          customerDisplay={customerDisplay}
          canConfirmPaid={
            hasCustomerIdentifier({ customerName: order.customerName, customerPhone: order.customerPhone }) &&
            !phoneErrorMessage(order.customerPhone)
          }
          isPaid={order.isPaid}
          paidAt={order.paidAt}
          totalCents={order.totalCents}
          onConfirmPaid={() => confirmPaid(order.id)}
        />
        <StatusCard isPaid={order.isPaid} status={order.status} onSetStatus={(next) => setStatus(order.id, next)} />
      </div>
    </div>
  );
}
