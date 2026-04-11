"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useFetchOrders } from "@/hook/useFetchOrders";
import { toast } from "react-toastify";
import {
  MessageSquare,
  Plus,
  Search,
  X,
  ChevronRight,
  Loader2,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Tag,
  AlertTriangle,
  Package,
  Star,
  CreditCard,
  User,
  Paperclip,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  items: { title: string }[];
  orderStatus: string;
  pricing: { total: number };
}
interface ITicketMessage {
  senderType: "user" | "admin";
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}
interface ITicket {
  _id: string;
  ticketId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  orderId?: string;
  messages: ITicketMessage[];
  satisfactionRating?: number;
  createdAt: string;
  updatedAt: string;
}

// ── Config ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "order", label: "Order Issue", icon: ShoppingBag },
  { value: "payment", label: "Payment", icon: CreditCard },
  { value: "product", label: "Product", icon: Package },
  { value: "account", label: "Account", icon: User },
  { value: "return", label: "Return/Refund", icon: RefreshCw },
  { value: "shipping", label: "Shipping", icon: Tag },
  { value: "other", label: "Other", icon: AlertCircle },
];

const PRIORITIES = [
  {
    value: "low",
    label: "Low",
    cls: "bg-gray-100 dark:bg-gray-800 text-gray-500",
  },
  {
    value: "medium",
    label: "Medium",
    cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    value: "high",
    label: "High",
    cls: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    value: "urgent",
    label: "Urgent",
    cls: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
  },
];

const STATUS_CFG: Record<
  string,
  { label: string; cls: string; icon: React.ElementType }
> = {
  open: {
    label: "Open",
    icon: Clock,
    cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  in_progress: {
    label: "In Progress",
    icon: RefreshCw,
    cls: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  waiting_user: {
    label: "Awaiting You",
    icon: AlertTriangle,
    cls: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    cls: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  closed: {
    label: "Closed",
    icon: X,
    cls: "bg-gray-100 dark:bg-gray-800 text-gray-500",
  },
};

const inp = `w-full px-3 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800
  border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
  placeholder-gray-400 focus:outline-none focus:border-teal-500
  focus:ring-2 focus:ring-teal-500/15 transition-all`;
const lbl =
  "block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5";

const MODAL_ID = "support-modal";

const emptyForm = () => ({
  subject: "",
  category: "order",
  priority: "medium",
  orderId: "",
  message: "",
});

// ── Main Page ──────────────────────────────────────────────────────
const UserSupportPage = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // New ticket form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  // Thread view
  const [selected, setSelected] = useState<ITicket | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [rating, setRating] = useState(0);

  // Orders for dropdown
  const { orders } = useFetchOrders() as { orders: Order[] };

  const dialogRef = useRef<HTMLDialogElement>(null);

  // ── Open / Close Modal Functions ─────────────────────────────
  const openModal = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
    // Cleanup after close animation
    setTimeout(() => {
      setSelected(null);
      setReply("");
      setRating(0);
    }, 300);
  }, []);

  // ── Fetch tickets ────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/support");
      const data = await res.json();
      setTickets(data.tickets ?? []);
    } catch {
      toast.error("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Auto open modal when selected changes
  useEffect(() => {
    if (selected) {
      openModal();
    } else {
      closeModal();
    }
  }, [selected, openModal, closeModal]);

  // ── Filtered list ────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...tickets];
    if (filterStatus) list = list.filter((t) => t.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.ticketId.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q),
      );
    }
    return list;
  }, [tickets, filterStatus, search]);

  // ── Stats ────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) =>
        ["open", "in_progress", "waiting_user"].includes(t.status),
      ).length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      awaiting: tickets.filter((t) => t.status === "waiting_user").length,
    }),
    [tickets],
  );

  // ── Open thread ──────────────────────────────────────────────
  const openThread = async (ticket: ITicket) => {
    try {
      const res = await fetch(`/api/support/${ticket.ticketId}`);
      const data = await res.json();
      setSelected(data.ticket || ticket);
    } catch {
      setSelected(ticket);
    }
    setReply("");
    setRating(ticket.satisfactionRating ?? 0);
  };

  // ── Submit new ticket ────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.subject.trim()) {
      toast.error("Subject is required.");
      return;
    }
    if (!form.message.trim()) {
      toast.error("Please describe your issue.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? "Failed.");
        return;
      }
      toast.success("Ticket submitted! We'll get back to you soon.");
      setShowForm(false);
      setForm(emptyForm());
      fetchTickets();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Send reply ───────────────────────────────────────────────
  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      const res = await fetch(`/api/support/${selected.ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? "Failed.");
        return;
      }
      setSelected(data.ticket);
      setReply("");
      fetchTickets();
    } catch {
      toast.error("Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  // ── Submit rating ────────────────────────────────────────────
  const handleRating = async (val: number) => {
    if (
      !selected ||
      selected.status !== "resolved" ||
      selected.satisfactionRating
    )
      return;

    setRating(val);
    try {
      const res = await fetch(`/api/support/${selected.ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ satisfactionRating: val }),
      });
      const data = await res.json();
      if (res.ok) {
        setSelected(data.ticket);
        toast.success("Thank you for your feedback!");
        fetchTickets();
      }
    } catch {
      toast.error("Failed to submit rating.");
    }
  };

  const catCfg = (val: string) =>
    CATEGORIES.find((c) => c.value === val) ?? CATEGORIES[6];
  const priCfg = (val: string) =>
    PRIORITIES.find((p) => p.value === val) ?? PRIORITIES[0];

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare size={13} className="text-teal-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">
                My Account
              </p>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Support
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Get help with your orders and account
            </p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-white transition-all shadow-sm shadow-teal-500/20"
          >
            <Plus size={15} /> New Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: MessageSquare,
              color: "text-gray-700 dark:text-gray-300",
              bg: "bg-gray-100 dark:bg-gray-800",
            },
            {
              label: "Active",
              value: stats.open,
              icon: Clock,
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-500/10",
            },
            {
              label: "Awaiting",
              value: stats.awaiting,
              icon: AlertTriangle,
              color: "text-orange-500",
              bg: "bg-orange-50 dark:bg-orange-500/10",
            },
            {
              label: "Resolved",
              value: stats.resolved,
              icon: CheckCircle2,
              color: "text-teal-600 dark:text-teal-400",
              bg: "bg-teal-50 dark:bg-teal-500/10",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </p>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}
                >
                  <Icon size={15} className={color} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* New ticket form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus size={14} className="text-teal-500" /> New Support Ticket
              </p>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl}>Subject *</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, subject: e.target.value }))
                  }
                  placeholder="Brief description of your issue"
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className={inp}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, priority: e.target.value }))
                  }
                  className={inp}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              {form.category === "order" && (
                <div className="sm:col-span-2">
                  <label className={lbl}>Related Order</label>
                  <select
                    value={form.orderId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, orderId: e.target.value }))
                    }
                    className={inp}
                  >
                    <option value="">Select an order (optional)</option>
                    {(orders as Order[]).map((o) => (
                      <option key={o.orderId} value={o.orderId}>
                        {o.orderId} — {o.items[0]?.title?.slice(0, 40)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="sm:col-span-2">
                <label className={lbl}>Describe your issue *</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Please provide as much detail as possible..."
                  className={`${inp} resize-none`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-teal-500 hover:bg-teal-400 disabled:opacity-50 transition-all"
              >
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                Submit Ticket
              </button>
            </div>
          </div>
        )}

        {/* Filter + Search */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search tickets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
          >
            <option value="">All Status</option>
            {Object.entries(STATUS_CFG).map(([v, { label }]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
          {(search || filterStatus) && (
            <button
              onClick={() => {
                setSearch("");
                setFilterStatus("");
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Tickets list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <MessageSquare
              size={40}
              className="text-gray-300 dark:text-gray-700"
            />
            <p className="text-gray-500 font-medium">No tickets found</p>
            {tickets.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="text-sm font-bold text-teal-500 hover:underline"
              >
                Open your first ticket
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ticket) => {
              const sc = STATUS_CFG[ticket.status] ?? STATUS_CFG.open;
              const cc = catCfg(ticket.category);
              const pc = priCfg(ticket.priority);
              const CatIcon = cc.icon;
              const StIcon = sc.icon;
              const lastMsg = ticket.messages[ticket.messages.length - 1];
              return (
                <div
                  key={ticket._id}
                  onClick={() => openThread(ticket)}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:border-teal-200 dark:hover:border-teal-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center shrink-0">
                        <CatIcon size={16} className="text-teal-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {ticket.subject}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.cls}`}
                          >
                            <StIcon size={8} />
                            {sc.label}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pc.cls}`}
                          >
                            {pc.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono">
                          {ticket.ticketId}
                        </p>
                        {lastMsg && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                            <span
                              className={
                                lastMsg.senderType === "admin"
                                  ? "text-teal-500 font-semibold"
                                  : ""
                              }
                            >
                              {lastMsg.senderType === "admin"
                                ? "Support: "
                                : "You: "}
                            </span>
                            {lastMsg.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <p className="text-[10px] text-gray-400">
                        {new Date(ticket.updatedAt).toLocaleDateString(
                          "en-BD",
                          { day: "numeric", month: "short" },
                        )}
                      </p>
                      <span className="text-xs text-gray-400">
                        {ticket.messages.length} msg
                        {ticket.messages.length !== 1 ? "s" : ""}
                      </span>
                      {ticket.status === "waiting_user" && (
                        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                      )}
                      <ChevronRight
                        size={14}
                        className="text-gray-300 group-hover:text-teal-500 transition-colors mt-1"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Thread Modal ── */}
      <dialog
        id={MODAL_ID}
        ref={dialogRef}
        className="modal backdrop:bg-black/60"
        onClose={closeModal}
      >
        <div className="modal-box max-w-2xl bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
          {selected &&
            (() => {
              const sc = STATUS_CFG[selected.status] ?? STATUS_CFG.open;
              const cc = catCfg(selected.category);
              const pc = priCfg(selected.priority);
              const CatIcon = cc.icon;
              const StIcon = sc.icon;
              const canReply = !["resolved", "closed"].includes(
                selected.status,
              );

              return (
                <>
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                          {selected.subject}
                        </p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {selected.ticketId}
                        </p>
                      </div>
                      <button
                        onClick={closeModal}
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${sc.cls}`}
                      >
                        <StIcon size={9} />
                        {sc.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${pc.cls}`}
                      >
                        {pc.label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500">
                        <CatIcon size={9} />
                        {cc.label}
                      </span>
                      {selected.orderId && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-gray-400 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                          <ShoppingBag size={9} />
                          {selected.orderId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="max-h-[50vh] overflow-y-auto p-5 space-y-4">
                    {selected.messages.map((msg, i) => {
                      const isUser = msg.senderType === "user";
                      return (
                        <div
                          key={i}
                          className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                              isUser
                                ? "bg-teal-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {isUser ? "U" : "S"}
                          </div>
                          <div
                            className={`max-w-[80%] ${
                              isUser ? "items-end" : "items-start"
                            } flex flex-col gap-1`}
                          >
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isUser
                                  ? "bg-teal-500 text-white rounded-tr-sm"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                              }`}
                            >
                              {msg.message}
                            </div>
                            <p className="text-[10px] text-gray-400 px-1">
                              {msg.senderName} ·{" "}
                              {new Date(msg.createdAt).toLocaleString("en-BD", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 px-1">
                                {msg.attachments.map((url, ai) => (
                                  <a
                                    key={ai}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-[10px] text-teal-500 hover:underline"
                                  >
                                    <Paperclip size={9} /> Attachment {ai + 1}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Resolved — rating */}
                    {selected.status === "resolved" && (
                      <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-center space-y-2">
                        <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
                          Ticket Resolved ✓
                        </p>
                        {!selected.satisfactionRating ? (
                          <>
                            <p className="text-xs text-teal-600 dark:text-teal-400">
                              How would you rate our support?
                            </p>
                            <div className="flex items-center justify-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((v) => (
                                <button
                                  key={v}
                                  onClick={() => handleRating(v)}
                                  className={`transition-all hover:scale-110 ${
                                    v <= rating
                                      ? "text-amber-400"
                                      : "text-gray-300 dark:text-gray-600"
                                  }`}
                                >
                                  <Star
                                    size={22}
                                    fill={v <= rating ? "currentColor" : "none"}
                                  />
                                </button>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((v) => (
                              <Star
                                key={v}
                                size={16}
                                className={
                                  v <= (selected.satisfactionRating ?? 0)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                            <span className="text-xs text-teal-500 ml-1 font-semibold">
                              Thank you!
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reply box */}
                  {canReply && (
                    <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
                      <div className="flex gap-3">
                        <textarea
                          rows={2}
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleReply();
                            }
                          }}
                          placeholder="Type your reply… (Enter to send)"
                          className={`${inp} resize-none flex-1`}
                        />
                        <button
                          onClick={handleReply}
                          disabled={sending || !reply.trim()}
                          className="px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-white disabled:opacity-50 transition-all flex items-center justify-center"
                        >
                          {sending ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Send size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {!canReply && (
                    <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 text-center">
                      <p className="text-xs text-gray-400">
                        This ticket is {selected.status} — no further replies
                        possible.
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
        </div>
      </dialog>
    </>
  );
};

export default UserSupportPage;
