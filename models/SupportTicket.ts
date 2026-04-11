// models/SupportTicket.ts
import mongoose, { Schema, Document } from "mongoose";

// ── Sub-types ──────────────────────────────────────────────────────
export interface ITicketMessage {
  senderType: "user" | "admin";
  senderId: string;
  senderName: string;
  message: string;
  attachments: string[];
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  ticketId: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category:
    | "order"
    | "payment"
    | "product"
    | "account"
    | "return"
    | "shipping"
    | "other";
  priority: "low" | "medium" | "high" | "urgent";
  orderId?: string;
  productId?: string;
  status: "open" | "in_progress" | "waiting_user" | "resolved" | "closed";
  messages: ITicketMessage[];
  assignedTo?: string;
  assignedName?: string;
  resolvedAt?: Date;
  resolutionNote?: string;
  satisfactionRating?: 1 | 2 | 3 | 4 | 5;
  satisfactionNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Message sub-schema ─────────────────────────────────────────────
const TicketMessageSchema = new Schema<ITicketMessage>(
  {
    senderType: { type: String, enum: ["user", "admin"], required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    attachments: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

// ── Main schema ────────────────────────────────────────────────────
const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    // ticketId — unique index defined only here via schema option, NOT via schema.index()
    ticketId: { type: String, unique: true, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },

    subject: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "order",
        "payment",
        "product",
        "account",
        "return",
        "shipping",
        "other",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    orderId: { type: String, default: null },
    productId: { type: String, default: null },

    status: {
      type: String,
      enum: ["open", "in_progress", "waiting_user", "resolved", "closed"],
      default: "open",
    },

    messages: { type: [TicketMessageSchema], default: [] },
    assignedTo: { type: String, default: null },
    assignedName: { type: String, default: null },

    resolvedAt: { type: Date, default: null },
    resolutionNote: { type: String, default: null, trim: true },

    satisfactionRating: { type: Number, min: 1, max: 5, default: null },
    satisfactionNote: { type: String, default: null, trim: true },
  },
  { timestamps: true },
);

// ── Indexes ────────────────────────────────────────────────────────
// NOTE: ticketId index is already created by unique:true above — do NOT add it here again
SupportTicketSchema.index({ userId: 1 });
SupportTicketSchema.index({ status: 1 });
SupportTicketSchema.index({ priority: 1 });
SupportTicketSchema.index({ assignedTo: 1 });
SupportTicketSchema.index({ createdAt: -1 });

export default mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);
