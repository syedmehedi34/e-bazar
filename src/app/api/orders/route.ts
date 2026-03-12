import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { initiateSSLCommerz } from "@/lib/sslcommerz";
import { initiateStripe } from "@/lib/stripe";
import dbConnect from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `EB-${date}-${random}`;
}

// ═══════════════════════════════════════════════════════
//  POST — Create a new order
// ═══════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const { items, deliveryAddress, paymentMethod, pricing, note } = body;

  if (!items?.length)
    return NextResponse.json({ error: "No items" }, { status: 400 });
  if (!deliveryAddress)
    return NextResponse.json({ error: "No address" }, { status: 400 });
  if (!paymentMethod)
    return NextResponse.json({ error: "No payment method" }, { status: 400 });

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  const order = await Order.create({
    orderId: generateOrderId(),
    userId,
    items,
    deliveryAddress,
    paymentMethod,
    pricing,
    note: note ?? null,
    paymentStatus: paymentMethod === "cod" ? "cod_pending" : "pending",
    orderStatus: "processing",
  });

  if (paymentMethod === "cod") {
    return NextResponse.json(
      { orderId: order.orderId, redirect: null },
      { status: 201 },
    );
  }

  if (paymentMethod === "sslcommerz") {
    const gatewayUrl = await initiateSSLCommerz(order);
    return NextResponse.json(
      { orderId: order.orderId, redirect: gatewayUrl },
      { status: 201 },
    );
  }

  if (paymentMethod === "stripe") {
    const gatewayUrl = await initiateStripe(order);
    return NextResponse.json(
      { orderId: order.orderId, redirect: gatewayUrl },
      { status: 201 },
    );
  }

  return NextResponse.json(
    { error: "Unknown payment method" },
    { status: 400 },
  );
}

// ═══════════════════════════════════════════════════════
//  GET — Fetch orders (scope + search + filter + date)
// ═══════════════════════════════════════════════════════
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role?.includes("admin");

    const { searchParams } = new URL(req.url);

    // Scope params (admin only)
    const orderId = searchParams.get("orderId");
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    // Search across multiple fields
    const search = searchParams.get("search");

    // Enum filters
    const orderStatus = searchParams.get("orderStatus");
    const paymentStatus = searchParams.get("paymentStatus");
    const paymentMethod = searchParams.get("paymentMethod");

    // Date filters
    const date = searchParams.get("date"); // exact single date  e.g. "2025-06-15"
    const createdAtFrom = searchParams.get("createdAtFrom"); // range start         e.g. "2025-01-01"
    const createdAtTo = searchParams.get("createdAtTo"); // range end           e.g. "2025-12-31"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    // ── Auth guard ───────────────────────────────────────────────
    // Non-admin users can only see their own orders
    if (!isAdmin) {
      if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      query.userId = session.user.id;
    } else {
      // Admin: apply scope params if provided
      if (orderId) query.orderId = orderId;
      if (userId) query.userId = userId;
      if (productId) query["items.productId"] = productId;
    }

    // ── Search ───────────────────────────────────────────────────
    // Wrap existing scope conditions in $and so search $or doesn't override them
    if (search) {
      const regex = new RegExp(search, "i");
      const searchOr = [
        { orderId: regex },
        { userId: regex },
        { "items.productId": regex },
        { "items.title": regex },
      ];

      if (Object.keys(query).length > 0) {
        // Combine scope + search safely using $and
        query.$and = [{ ...query }, { $or: searchOr }];
        delete query.orderId;
        delete query.userId;
        delete query["items.productId"];
      } else {
        query.$or = searchOr;
      }
    }

    // ── Enum filters ─────────────────────────────────────────────
    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    // ── Date filter ──────────────────────────────────────────────
    // Priority: exact `date` > range `createdAtFrom`/`createdAtTo`
    if (date) {
      // Match the full day: from 00:00:00.000 to 23:59:59.999
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: start, $lte: end };
    } else if (createdAtFrom || createdAtTo) {
      // Date range filter
      query.createdAt = {};
      if (createdAtFrom) query.createdAt.$gte = new Date(createdAtFrom);
      if (createdAtTo) {
        const toDate = new Date(createdAtTo);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    // ── Execute query ────────────────────────────────────────────
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      message: "Orders fetched successfully",
      orders,
      total: orders.length,
    });
  } catch (error) {
    console.error("[GET /api/orders] Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
