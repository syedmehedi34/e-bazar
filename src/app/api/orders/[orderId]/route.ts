// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "../../../../../lib/mongodb";
import Order from "../../../../../models/Order";

/* ── GET /api/orders/[orderId] ─────────────────────────── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  await dbConnect();
  const { orderId } = await params;
  const order = await Order.findOne({ orderId }).lean();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order }, { status: 200 });
}

/* ── PATCH /api/orders/[orderId] ───────────────────────────
   Admin  → update anything
   User   → only orderStatus + returnDetails
─────────────────────────────────────────────────────────── */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role?.includes("admin");
    const { orderId } = await params;
    const body = await req.json();

    let update: Record<string, unknown> = {};

    if (isAdmin) {
      // ── Admin → full control ─────────────────────────
      update = body;
    } else {
      // ── User → limited fields only ──────────────────

      // ❌ check if data available or not
      if (!body.orderStatus && !body.returnDetails) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }

      // ✅ Allow only these two fields
      if (body.orderStatus) {
        update.orderStatus = body.orderStatus;
      }

      if (body.returnDetails) {
        update.returnDetails = {
          requestedAt: new Date(), // auto set
          reason: body.returnDetails.reason,
          description: body.returnDetails.description || "",
        };
      }
    }

    const updated = await Order.findOneAndUpdate(
      { orderId },
      { $set: update },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).lean();

    if (!updated) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Order updated successfully",
      order: updated,
    });
  } catch (error) {
    console.error("[PATCH /api/orders/[orderId]]", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 },
    );
  }
}
