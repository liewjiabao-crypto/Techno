import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { phoneErrorMessage, sanitizeMyPhoneInput } from "@/utils/myPhone";

export function CustomerCard(props: {
  customerName: string;
  customerPhone: string;
  notes: string;
  onChangeCustomer: (next: { customerName: string; customerPhone: string }) => void;
  onChangeNotes: (notes: string) => void;
  onDelete: () => void;
}) {
  const { customerName, customerPhone, notes, onChangeCustomer, onChangeNotes, onDelete } = props;
  const phoneError = phoneErrorMessage(customerPhone);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-[var(--font-display)] text-lg tracking-tight">Customer</div>
          <div className="mt-1 text-sm text-[rgb(var(--muted))]">Name or phone should be present before payment.</div>
        </div>
        <Button variant="danger" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <div className="text-xs text-[rgb(var(--muted))]">Name</div>
          <Input value={customerName} onChange={(e) => onChangeCustomer({ customerName: e.target.value, customerPhone })} />
        </div>
        <div className="grid gap-2">
          <div className="text-xs text-[rgb(var(--muted))]">Phone</div>
          <Input
            value={customerPhone}
            onChange={(e) => onChangeCustomer({ customerName, customerPhone: sanitizeMyPhoneInput(e.target.value) })}
            inputMode="tel"
            placeholder="e.g. 0123456789 or +60123456789"
          />
          {phoneError ? <div className="text-xs text-[rgb(var(--danger))]">{phoneError}</div> : null}
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        <div className="text-xs text-[rgb(var(--muted))]">Notes</div>
        <Textarea value={notes} onChange={(e) => onChangeNotes(e.target.value)} />
      </div>
    </Card>
  );
}
