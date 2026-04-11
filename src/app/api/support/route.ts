// src/app/api/support/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "../../../../lib/mongodb";
import SupportTicket from "../../../../models/SupportTicket";

// ── ticketId generator ─────────────────────────────────────────────
const genTicketId = () => {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `TKT-${date}-${rand}`;
};

/* ── GET /api/support ──────────────────────────────────────────────
   User  → own tickets only
   Admin → all tickets (with filters)
──────────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const isAdmin = session.user.role?.includes("admin");

  const filter: Record<string, unknown> = {};

  if (!isAdmin) {
    // User sees only their own tickets
    filter.userId = session.user.id;
  } else {
    // Admin filters
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const assigned = searchParams.get("assignedTo");

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assigned) filter.assignedTo = assigned;
    if (search) {
      filter.$or = [
        { ticketId: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }
  }

  const tickets = await SupportTicket.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ tickets }, { status: 200 });
}

/* ── POST /api/support ─────────────────────────────────────────────
   User opens a new ticket
──────────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    subject,
    category,
    priority,
    orderId,
    productId,
    message,
    attachments,
  } = body;

  if (!subject?.trim())
    return NextResponse.json(
      { message: "Subject is required" },
      { status: 400 },
    );
  if (!category)
    return NextResponse.json(
      { message: "Category is required" },
      { status: 400 },
    );
  if (!message?.trim())
    return NextResponse.json(
      { message: "Message is required" },
      { status: 400 },
    );

  const ticket = await SupportTicket.create({
    ticketId: genTicketId(),
    userId: session.user.id,
    userName: session.user.name ?? "User",
    userEmail: session.user.email ?? "",
    subject: subject.trim(),
    category,
    priority: priority ?? "medium",
    orderId: orderId ?? null,
    productId: productId ?? null,
    status: "open",
    messages: [
      {
        senderType: "user",
        senderId: session.user.id,
        senderName: session.user.name ?? "User",
        message: message.trim(),
        attachments: attachments ?? [],
      },
    ],
  });

  return NextResponse.json(
    { message: "Ticket created", ticket },
    { status: 201 },
  );
}
