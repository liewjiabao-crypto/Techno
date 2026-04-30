## 1. Architecture Design

```mermaid
flowchart LR
  A["React UI (Vite)"] --> B["State Layer (Context + Reducer)"]
  B --> C["Local Persistence (localStorage)"]
  A --> D["Router (React Router)"]
```

## 2. Technology Description
- Frontend: React@18 + TypeScript + tailwindcss@3 + vite
- Initialization Tool: create-vite
- Backend: None (admin-only local tool)
- Data: localStorage (orders, settings); optional seed data on first run

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | Dashboard: order list, filters, open order detail |
| /new | New order: build items, customer info, create order |
| /orders/:id | Order detail: confirm payment, set status, view receipt |

## 4. API Definitions
No backend APIs. All actions are handled client-side:
- Create order
- Update customer info
- Confirm paid
- Update status
- Persist/load from localStorage

## 5. Data Model

### 5.1 Data Model Definition
```mermaid
erDiagram
  ORDER ||--o{ ORDER_ITEM : contains
  ORDER {
    string id
    string customerName
    string customerPhone
    boolean isPaid
    string status
    number subtotalCents
    number taxCents
    number totalCents
    string notes
    datetime createdAt
    datetime updatedAt
    datetime paidAt
  }
  ORDER_ITEM {
    string id
    string orderId
    string name
    number qty
    number unitPriceCents
    number lineTotalCents
  }
```

### 5.2 Storage Schema (localStorage)
- Key: `beverage_admin_orders_v1`
- Value: JSON array of `ORDER` objects (each includes nested `ORDER_ITEM[]`)

## 6. Key Implementation Notes
- Guardrails:
  - Customer name or phone is required before enabling “Proceed to Payment”
  - “Confirm Paid” can only be done once (stores `paidAt`)
  - Status changes are allowed only after payment is confirmed
- Status enum:
  - `ACCEPTED` → `MAKING` → `COMPLETED`
  - UI shows friendly labels: “Order Accepted”, “Start Making”, “Completed”
