import { useState, useEffect, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  ChevronDown,
  ClipboardList,
  Clock,
  LogOut,
  Package,
  Search,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChefHat,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ORDER_STATUS_CONFIG,
  type Order,
  type OrderStatus,
} from "@/lib/admin-store";
import { listOrders, setOrderStatus, removeOrder } from "@/lib/orders.functions";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, getComboPlanLabel } from "@/lib/storefront-data";
import logoImg from "@/assets/mhp-logo.png";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="size-3.5" />,
  confirmed: <CheckCircle2 className="size-3.5" />,
  preparing: <ChefHat className="size-3.5" />,
  "out-for-delivery": <Truck className="size-3.5" />,
  delivered: <Package className="size-3.5" />,
  cancelled: <XCircle className="size-3.5" />,
};

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out-for-delivery",
  "delivered",
  "cancelled",
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Auth guard
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate({ to: "/admin" });
    }
  }, [navigate]);

  // Load orders
  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    toast.success("Logged out successfully");
    navigate({ to: "/admin" });
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    setOrders(getOrders());
    toast.success(`Order updated to ${ORDER_STATUS_CONFIG[status].label}`);
  };

  const handleDelete = (orderId: string) => {
    deleteOrder(orderId);
    setOrders(getOrders());
    toast.success("Order deleted");
  };

  // Filtering
  const filteredOrders = useMemo(() => {
    let result = orders;

    if (filterStatus !== "all") {
      result = result.filter((o) => o.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.mobile.includes(q),
      );
    }

    return result;
  }, [orders, filterStatus, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const confirmed = orders.filter(
      (o) => o.status === "confirmed" || o.status === "preparing",
    ).length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    return { total, pending, confirmed, delivered, revenue };
  }, [orders]);

  if (!isAdminAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f1a14]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0f1a14]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img
                src={logoImg}
                alt="My Healthy Platter"
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <h1 className="hidden text-sm font-semibold text-white/70 sm:block">
              Admin Dashboard
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-white/50 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          <StatsCard
            label="Total Orders"
            value={stats.total}
            icon={<ClipboardList className="size-5" />}
            color="text-white/70"
            bgColor="bg-white/[0.04]"
          />
          <StatsCard
            label="Pending"
            value={stats.pending}
            icon={<AlertCircle className="size-5" />}
            color="text-amber-400"
            bgColor="bg-amber-500/[0.08]"
          />
          <StatsCard
            label="In Progress"
            value={stats.confirmed}
            icon={<ChefHat className="size-5" />}
            color="text-blue-400"
            bgColor="bg-blue-500/[0.08]"
          />
          <StatsCard
            label="Delivered"
            value={stats.delivered}
            icon={<CheckCircle2 className="size-5" />}
            color="text-emerald-400"
            bgColor="bg-emerald-500/[0.08]"
          />
          <StatsCard
            label="Revenue"
            value={formatPrice(stats.revenue)}
            icon={<ShoppingBag className="size-5" />}
            color="text-brand-green"
            bgColor="bg-brand-green/[0.08]"
            className="col-span-2 lg:col-span-1"
          />
        </div>

        {/* Filters & Search */}
        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            <FilterButton
              active={filterStatus === "all"}
              onClick={() => setFilterStatus("all")}
              count={orders.length}
            >
              All
            </FilterButton>
            {ALL_STATUSES.map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              return (
                <FilterButton
                  key={status}
                  active={filterStatus === status}
                  onClick={() => setFilterStatus(status)}
                  count={count}
                >
                  {ORDER_STATUS_CONFIG[status].label}
                </FilterButton>
              );
            })}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />
            <Input
              placeholder="Search by name, ID, or mobile…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 border-white/[0.06] bg-white/[0.03] pl-10 text-sm text-white placeholder:text-white/25 focus:border-brand-green/30 focus:ring-brand-green/10"
            />
          </div>
        </div>

        {/* Orders table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <Package className="mb-4 size-12 text-white/10" />
              <p className="text-sm font-medium text-white/40">
                {orders.length === 0
                  ? "No orders yet"
                  : "No orders match your filters"}
              </p>
              <p className="mt-1 text-xs text-white/20">
                {orders.length === 0
                  ? "Orders placed on the website will appear here."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/30">
                      Order ID
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/30">
                      Customer
                    </TableHead>
                    <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-white/30 md:table-cell">
                      Items
                    </TableHead>
                    <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-white/30 sm:table-cell">
                      Delivery
                    </TableHead>
                    <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-white/30">
                      Total
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/30">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-white/30">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-4 text-center text-xs text-white/15">
          Showing {filteredOrders.length} of {orders.length} orders · Data
          stored locally in this browser
        </p>
      </main>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatsCard({
  label,
  value,
  icon,
  color,
  bgColor,
  className,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/[0.06] ${bgColor} p-4 sm:p-5 ${className ?? ""}`}
    >
      <div className="flex items-center gap-3">
        <div className={`${color}`}>{icon}</div>
        <span className="text-xs font-medium text-white/40">{label}</span>
      </div>
      <p className={`mt-3 text-2xl font-bold tracking-tight ${color} sm:text-3xl`}>
        {value}
      </p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? "bg-brand-green/15 text-brand-green"
          : "text-white/35 hover:bg-white/[0.04] hover:text-white/60"
      }`}
    >
      {children}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
          active ? "bg-brand-green/20 text-brand-green" : "bg-white/5 text-white/25"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function OrderRow({
  order,
  onStatusChange,
  onDelete,
}: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
}) {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const deliveryDate = new Date(order.deliveryDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const createdDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TableRow className="border-white/[0.04] hover:bg-white/[0.02]">
      {/* Order ID */}
      <TableCell className="py-4">
        <div>
          <p className="font-mono text-xs font-semibold text-white/70">
            {order.id}
          </p>
          <p className="mt-0.5 text-[10px] text-white/25">{createdDate}</p>
        </div>
      </TableCell>

      {/* Customer */}
      <TableCell>
        <div>
          <p className="text-sm font-medium text-white/80">{order.customer.name}</p>
          <p className="text-xs text-white/30">{order.customer.mobile}</p>
        </div>
      </TableCell>

      {/* Items */}
      <TableCell className="hidden max-w-[200px] md:table-cell">
        <div className="space-y-0.5">
          {order.items.map((item, idx) => (
            <p key={idx} className="truncate text-xs text-white/45">
              {item.productName} × {item.quantity}
              {item.comboPlan && (
                <span className="ml-1 text-white/25">
                  ({getComboPlanLabel(item.comboPlan)})
                </span>
              )}
            </p>
          ))}
          {order.customer.notes && (
            <p className="mt-1 truncate text-[10px] italic text-amber-400/70" title={order.customer.notes}>
              📝 {order.customer.notes}
            </p>
          )}
        </div>
      </TableCell>

      {/* Delivery */}
      <TableCell className="hidden sm:table-cell">
        <p className="text-xs text-white/50">{deliveryDate}</p>
      </TableCell>

      {/* Total */}
      <TableCell className="text-right">
        <p className="text-sm font-semibold text-white/80">
          {formatPrice(order.total)}
        </p>
        {order.discount > 0 && (
          <p className="text-[10px] text-emerald-400/60">
            -{formatPrice(order.discount)} off
          </p>
        )}
      </TableCell>

      {/* Status badge */}
      <TableCell>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}
        >
          {STATUS_ICONS[order.status]}
          {statusConfig.label}
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Select
            value={order.status}
            onValueChange={(val) => onStatusChange(order.id, val as OrderStatus)}
          >
            <SelectTrigger className="h-8 w-[140px] border-white/[0.08] bg-white/[0.03] text-xs text-white/60 hover:bg-white/[0.06]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1a2a1f] text-white">
              {ALL_STATUSES.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="text-xs text-white/70 focus:bg-white/[0.06] focus:text-white"
                >
                  {ORDER_STATUS_CONFIG[status].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(order.id)}
            className="h-8 px-2 text-red-400/40 hover:bg-red-500/10 hover:text-red-400"
          >
            <XCircle className="size-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
