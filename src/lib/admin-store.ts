import type { ComboPlanKey } from "./storefront-data";

// ─── Types ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  comboPlan?: ComboPlanKey | undefined;
};

export type Order = {
  id: string;
  items: OrderItem[];
  customer: {
    name: string;
    mobile: string;
    address: string;
    pin: string;
    landmark: string;
    window: string;
    notes?: string;
  };
  deliveryDate: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

// ─── Order helpers ───────────────────────────────────────────────────────────

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MHP-${ts}-${rand}`;
}

// ─── Status display helpers ──────────────────────────────────────────────────

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  preparing: {
    label: "Preparing",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
  },
  "out-for-delivery": {
    label: "Out for Delivery",
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
  },
};
