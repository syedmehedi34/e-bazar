// src/app/api/support/[ticketId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "../../../../../lib/mongodb";
import SupportTicket from "../../../../../models/SupportTicket";

/* ── GET /api/support/[ticketId] ──────────────────────────── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { ticketId } = await params;

    const ticket = await SupportTicket.findOne({ ticketId }).lean();
    if (!ticket)
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 },
      );

    const isAdmin = session.user.role?.includes("admin");
    const ticketUserId = (ticket as { userId: string }).userId;

    if (!isAdmin && ticketUserId !== session.user.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    return NextResponse.json({ ticket }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/support/[ticketId]]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── PATCH /api/support/[ticketId] ────────────────────────────
   User  → reply, satisfactionRating (after resolved)
   Admin → reply, status, priority, assignedTo, resolutionNote
──────────────────────────────────────────────────────────── */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { ticketId } = await params;

    const ticket = await SupportTicket.findOne({ ticketId });
    if (!ticket)
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 },
      );

    const isAdmin = session.user.role?.includes("admin");

    if (!isAdmin && ticket.userId !== session.user.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await req.json();

    // ── Add reply message ────────────────────────────────────
    if (body.message?.trim()) {
      ticket.messages.push({
        senderType: isAdmin ? "admin" : "user",
        senderId: session.user.id,
        senderName: session.user.name ?? (isAdmin ? "Support" : "User"),
        message: body.message.trim(),
        attachments: body.attachments ?? [],
        createdAt: new Date(),
      });

      if (!isAdmin) {
        if (ticket.status === "waiting_user") ticket.status = "in_progress";
      } else {
        if (ticket.status === "open") ticket.status = "in_progress";
        if (!["resolved", "closed"].includes(ticket.status))
          ticket.status = "waiting_user";
      }
    }

    // ── Admin-only updates ───────────────────────────────────
    if (isAdmin) {
      if (body.status) {
        ticket.status = body.status;
        if (body.status === "resolved" && !ticket.resolvedAt)
          ticket.resolvedAt = new Date();
      }
      if (body.priority) ticket.priority = body.priority;
      if (body.resolutionNote !== undefined)
        ticket.resolutionNote = body.resolutionNote || null;
      if (body.assignedTo) {
        ticket.assignedTo = body.assignedTo;
        ticket.assignedName = body.assignedName ?? "Admin";
      }
    }

    // ── User satisfaction rating ─────────────────────────────
    if (!isAdmin && body.satisfactionRating) {
      if (ticket.status !== "resolved")
        return NextResponse.json(
          { message: "Can only rate resolved tickets" },
          { status: 400 },
        );
      ticket.satisfactionRating = body.satisfactionRating;
      if (body.satisfactionNote)
        ticket.satisfactionNote = body.satisfactionNote;
    }

    await ticket.save();
    return NextResponse.json(
      { message: "Ticket updated", ticket },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PATCH /api/support/[ticketId]]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
