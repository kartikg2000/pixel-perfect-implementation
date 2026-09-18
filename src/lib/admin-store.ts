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

// ─── Constants ───────────────────────────────────────────────────────────────

const ORDERS_KEY = "mhp_orders";
const AUTH_KEY = "mhp_admin_auth";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "mhp@admin2024",
};

// ─── Order helpers ───────────────────────────────────────────────────────────

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MHP-${ts}-${rand}`;
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const orders = getOrders();
  const existing = orders.find((o) => o.id === orderId);
  if (!existing) return;
  existing.status = status;
  existing.updatedAt = new Date().toISOString();
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function deleteOrder(orderId: string): void {
  const orders = getOrders().filter((o) => o.id !== orderId);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// ─── Auth helpers ────────────────────────────────────────────────────────────

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function loginAdmin(username: string, password: string): boolean {
  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(AUTH_KEY);
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
