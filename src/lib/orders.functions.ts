import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  getProductById,
  getProductPrice,
  getOfferDiscount,
  storefrontConfig,
  type ComboPlanKey,
} from "./storefront-data";
import type { Order, OrderItem, OrderStatus } from "./admin-store";

// ─── Server-side public client (guest checkout insert) ───────────────────────

function createPublicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

// ─── Validation ──────────────────────────────────────────────────────────────

const comboPlanSchema = z.enum(["daily", "weekly", "monthly"]);

const createOrderSchema = z.object({
  id: z.string().min(4).max(40),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
        comboPlan: comboPlanSchema.optional(),
      }),
    )
    .min(1)
    .max(30),
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    mobile: z.string().trim().min(6).max(20),
    address: z.string().trim().min(1).max(500),
    pin: z.string().trim().min(4).max(10),
    landmark: z.string().trim().max(200).default(""),
    window: z.string().trim().max(120).default(""),
    notes: z.string().trim().max(500).optional(),
  }),
  deliveryDate: z.string().min(1),
});

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    items: (row.items as unknown as OrderItem[]) ?? [],
    customer: {
      name: row.customer_name,
      mobile: row.customer_mobile,
      address: row.customer_address,
      pin: row.customer_pin,
      landmark: row.customer_landmark,
      window: row.delivery_window,
      notes: row.notes ?? undefined,
    },
    deliveryDate: row.delivery_date,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    status: row.status as OrderStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Public: place an order ──────────────────────────────────────────────────

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createOrderSchema.parse(data))
  .handler(async ({ data }) => {
    // Prices are recomputed server-side; client totals are never trusted.
    const items: OrderItem[] = [];
    for (const line of data.items) {
      const product = getProductById(line.productId);
      if (!product) continue;
      const comboPlan = line.comboPlan as ComboPlanKey | undefined;
      items.push({
        productId: product.id,
        productName: product.name,
        quantity: line.quantity,
        unitPrice: getProductPrice(product, comboPlan),
        comboPlan,
      });
    }

    if (items.length === 0) {
      throw new Error("No valid items in this order.");
    }

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const discount = getOfferDiscount(subtotal);
    const deliveryFee = storefrontConfig.deliveryFee ?? 0;
    const total = Math.max(subtotal - discount + deliveryFee, 0);

    const supabase = createPublicClient();
    const { error } = await supabase.from("orders").insert({
      id: data.id,
      items: items as unknown as Database["public"]["Tables"]["orders"]["Insert"]["items"],
      customer_name: data.customer.name,
      customer_mobile: data.customer.mobile,
      customer_address: data.customer.address,
      customer_pin: data.customer.pin,
      customer_landmark: data.customer.landmark,
      delivery_window: data.customer.window,
      notes: data.customer.notes ?? null,
      delivery_date: data.deliveryDate,
      subtotal,
      discount,
      delivery_fee: deliveryFee,
      total,
      status: "pending",
    });

    if (error) {
      console.error("[orders] insert failed", error);
      throw new Error("Could not save your order. Please try again.");
    }

    return { id: data.id, items, subtotal, discount, deliveryFee, total };
  });

// ─── Admin helpers ───────────────────────────────────────────────────────────

async function assertAdmin(
  supabase: Awaited<ReturnType<typeof createPublicClient>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden: admin access required.");
}

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load orders.");
    return (data ?? []).map(rowToOrder);
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().min(1),
        status: z.enum([
          "pending",
          "confirmed",
          "preparing",
          "out-for-delivery",
          "delivered",
          "cancelled",
        ]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("Could not update the order.");
    return { ok: true };
  });

export const removeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("orders").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete the order.");
    return { ok: true };
  });

export const getIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: Boolean(data) };
  });
