"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import {
  MessageSquare,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Loader2,
  User,
  ShoppingBag,
  Tag,
  Package,
  CreditCard,
  AlertCircle,
  Star,
  Filter,
  UserCheck,
  Paperclip,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface ITicketMessage {
  senderType: "user" | "admin";
  senderId: string;
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}
interface ITicket {
  _id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  orderId?: string;
  productId?: string;
  messages: ITicketMessage[];
  assignedTo?: string;
  assignedName?: string;
  resolutionNote?: string;
  satisfactionRating?: number;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Config ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "order", label: "Order", icon: ShoppingBag },
  { value: "payment", label: "Payment", icon: CreditCard },
  { value: "product", label: "Product", icon: Package },
  { value: "account", label: "Account", icon: User },
  { value: "return", label: "Return", icon: RefreshCw },
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
    label: "Waiting User",
    icon: AlertTriangle,
    cls: "bg-orange-50 dark:bg-orange-500/10 text-orange-500",
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

const MODAL_ID = "admin-support-modal";

// ── Helper ─────────────────────────────────────────────────────────
const catCfg = (v: string) =>
  CATEGORIES.find((c) => c.value === v) ?? CATEGORIES[6];
const priCfg = (v: string) =>
  PRIORITIES.find((p) => p.value === v) ?? PRIORITIES[0];
const timeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
};

// ── Badge ──────────────────────────────────────────────────────────
const Badge = ({
  cls,
  label,
  icon: Icon,
}: {
  cls: string;
  label: string;
  icon?: React.ElementType;
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cls}`}
  >
    {Icon && <Icon size={9} />}
    {label}
  </span>
);

type SortField = "createdAt" | "updatedAt" | "priority" | "status";

// ── Main Page ──────────────────────────────────────────────────────
const AdminSupportPage = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fPriority, setFPriority] = useState("");
  const [fCategory, setFCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Modal / thread
  const [selected, setSelected] = useState<ITicket | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [resNote, setResNote] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);
  const [showMetaEdit, setShowMetaEdit] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  // ── Open / Close Modal ───────────────────────────────────────
  const openModal = useCallback(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);

  const closeModal = useCallback(() => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    // Reset states after close
    setTimeout(() => {
      setSelected(null);
      setReply("");
      setShowMetaEdit(false);
    }, 300);
  }, []);

  // ── Fetch ────────────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fStatus) params.set("status", fStatus);
      if (fPriority) params.set("priority", fPriority);
      if (fCategory) params.set("category", fCategory);
      if (search) params.set("search", search);
      const res = await fetch(`/api/support?${params}`);
      const data = await res.json();
      setTickets(data.tickets ?? []);
    } catch {
      toast.error("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [fStatus, fPriority, fCategory, search]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // ── Stats ────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      progress: tickets.filter((t) => t.status === "in_progress").length,
      waiting: tickets.filter((t) => t.status === "waiting_user").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      urgent: tickets.filter(
        (t) =>
          t.priority === "urgent" && !["resolved", "closed"].includes(t.status),
      ).length,
    }),
    [tickets],
  );

  // ── Sort ─────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    const PORDER: Record<string, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };
    return [...tickets].sort((a, b) => {
      let av: string | number = a[sortField] ?? "";
      let bv: string | number = b[sortField] ?? "";
      if (sortField === "priority") {
        av = PORDER[a.priority] ?? 0;
        bv = PORDER[b.priority] ?? 0;
      }
      return av < bv
        ? sortDir === "asc"
          ? -1
          : 1
        : av > bv
          ? sortDir === "asc"
            ? 1
            : -1
          : 0;
    });
  }, [tickets, sortField, sortDir]);

  const toggleSort = (f: SortField) => {
    if (sortField === f) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(f);
      setSortDir("desc");
    }
  };

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
    setShowMetaEdit(false);
    setEditStatus(ticket.status);
    setEditPriority(ticket.priority);
    setResNote(ticket.resolutionNote ?? "");

    // Open modal after state update
    setTimeout(openModal, 10);
  };

  // Sync dialog when selected changes (extra safety)
  useEffect(() => {
    if (selected) {
      openModal();
    } else {
      closeModal();
    }
  }, [selected, openModal, closeModal]);

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
        toast.error(data.message || "Failed to send reply");
        return;
      }
      setSelected(data.ticket);
      setReply("");
      fetchTickets();
      toast.success("Reply sent!");
    } catch {
      toast.error("Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  // ── Save meta (status, priority, resolutionNote) ─────────────
  const handleSaveMeta = async () => {
    if (!selected) return;
    setSavingMeta(true);
    try {
      const res = await fetch(`/api/support/${selected.ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          priority: editPriority,
          resolutionNote: resNote || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update");
        return;
      }
      setSelected(data.ticket);
      setShowMetaEdit(false);
      toast.success("Ticket updated!");
      fetchTickets();
    } catch {
      toast.error("Failed to update.");
    } finally {
      setSavingMeta(false);
    }
  };

  const hasFilter = fStatus || fPriority || fCategory || search;

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Support Tickets
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage customer support requests
            </p>
          </div>
          <div className="flex items-center gap-2">
            {stats.urgent > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 animate-pulse">
                <AlertTriangle size={12} /> {stats.urgent} urgent
              </span>
            )}
            <button
              onClick={fetchTickets}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-teal-500 hover:border-teal-300 transition-all"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "text-gray-700 dark:text-gray-300",
              bg: "bg-gray-100 dark:bg-gray-800",
            },
            {
              label: "Open",
              value: stats.open,
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-500/10",
            },
            {
              label: "In Progress",
              value: stats.progress,
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-500/10",
            },
            {
              label: "Waiting",
              value: stats.waiting,
              color: "text-orange-500",
              bg: "bg-orange-50 dark:bg-orange-500/10",
            },
            {
              label: "Resolved",
              value: stats.resolved,
              color: "text-teal-600 dark:text-teal-400",
              bg: "bg-teal-50 dark:bg-teal-500/10",
            },
            {
              label: "Urgent",
              value: stats.urgent,
              color: "text-red-600 dark:text-red-400",
              bg: "bg-red-50 dark:bg-red-500/10",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`rounded-2xl border border-gray-100 dark:border-gray-800 p-4 ${bg}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                {label}
              </p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search ticket ID, user, subject…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                showFilters || fStatus || fPriority || fCategory
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              <Filter size={14} /> Filters
              {(fStatus || fPriority || fCategory) && (
                <span className="w-2 h-2 rounded-full bg-white opacity-80" />
              )}
            </button>
            {hasFilter && (
              <button
                onClick={() => {
                  setSearch("");
                  setFStatus("");
                  setFPriority("");
                  setFCategory("");
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 transition-colors"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-3 gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div>
                <label className={lbl}>Status</label>
                <select
                  value={fStatus}
                  onChange={(e) => setFStatus(e.target.value)}
                  className={inp}
                >
                  <option value="">All</option>
                  {Object.entries(STATUS_CFG).map(([v, { label }]) => (
                    <option key={v} value={v}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Priority</label>
                <select
                  value={fPriority}
                  onChange={(e) => setFPriority(e.target.value)}
                  className={inp}
                >
                  <option value="">All</option>
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Category</label>
                <select
                  value={fCategory}
                  onChange={(e) => setFCategory(e.target.value)}
                  className={inp}
                >
                  <option value="">All</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        {loading && tickets.length === 0 ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <MessageSquare
              size={40}
              className="text-gray-300 dark:text-gray-700"
            />
            <p className="text-gray-500 font-medium">No tickets found</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    {(
                      [
                        { label: "Ticket", field: null },
                        {
                          label: "User",
                          field: null,
                          hidden: "hidden md:table-cell",
                        },
                        {
                          label: "Category",
                          field: null,
                          hidden: "hidden lg:table-cell",
                        },
                        { label: "Priority", field: "priority" as SortField },
                        { label: "Status", field: "status" as SortField },
                        { label: "Updated", field: "updatedAt" as SortField },
                      ] as {
                        label: string;
                        field: SortField | null;
                        hidden?: string;
                      }[]
                    ).map(({ label, field, hidden }) => (
                      <th
                        key={label}
                        className={`text-left px-4 py-3.5 first:pl-5 ${hidden ?? ""}`}
                      >
                        {field ? (
                          <button
                            onClick={() => toggleSort(field)}
                            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-teal-600 transition-colors"
                          >
                            {label}
                            <span className="flex flex-col ml-1 opacity-40">
                              <ChevronUp
                                size={10}
                                className={
                                  sortField === field && sortDir === "asc"
                                    ? "opacity-100 text-teal-500"
                                    : ""
                                }
                              />
                              <ChevronDown
                                size={10}
                                className={
                                  sortField === field && sortDir === "desc"
                                    ? "opacity-100 text-teal-500"
                                    : ""
                                }
                              />
                            </span>
                          </button>
                        ) : (
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {label}
                          </span>
                        )}
                      </th>
                    ))}
                    <th className="px-4 py-3.5 text-right">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Messages
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {sorted.map((ticket) => {
                    const sc = STATUS_CFG[ticket.status] ?? STATUS_CFG.open;
                    const cc = catCfg(ticket.category);
                    const pc = priCfg(ticket.priority);
                    const StIcon = sc.icon;
                    const CatIcon = cc.icon;
                    const unread =
                      ticket.messages[ticket.messages.length - 1]
                        ?.senderType === "user";
                    return (
                      <tr
                        key={ticket._id}
                        onClick={() => openThread(ticket)}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                          unread && ticket.status !== "resolved"
                            ? "bg-blue-50/30 dark:bg-blue-500/5"
                            : ""
                        }`}
                      >
                        {/* Ticket */}
                        <td className="pl-5 pr-4 py-3.5">
                          <div className="flex items-center gap-2">
                            {unread && ticket.status !== "resolved" && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            )}
                            <div>
                              <p className="text-xs font-bold font-mono text-gray-900 dark:text-white">
                                {ticket.ticketId}
                              </p>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 line-clamp-1 mt-0.5">
                                {ticket.subject}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* User */}
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">
                            {ticket.userName}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">
                            {ticket.userEmail}
                          </p>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                            <CatIcon size={12} className="text-gray-400" />
                            {cc.label}
                          </span>
                          {ticket.orderId && (
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                              {ticket.orderId}
                            </p>
                          )}
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-3.5">
                          <Badge cls={pc.cls} label={pc.label} />
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <Badge cls={sc.cls} label={sc.label} icon={StIcon} />
                        </td>

                        {/* Updated */}
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-gray-500">
                            {timeAgo(ticket.updatedAt)}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(ticket.createdAt).toLocaleDateString(
                              "en-BD",
                              { day: "numeric", month: "short" },
                            )}
                          </p>
                        </td>

                        {/* Messages count */}
                        <td className="px-4 py-3.5 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                              unread && ticket.status !== "resolved"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                            }`}
                          >
                            <MessageSquare size={10} /> {ticket.messages.length}
                          </span>
                          {ticket.satisfactionRating && (
                            <div className="flex items-center justify-end gap-0.5 mt-1">
                              {[1, 2, 3, 4, 5].map((v) => (
                                <Star
                                  key={v}
                                  size={9}
                                  className={
                                    v <= ticket.satisfactionRating!
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {sorted.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {tickets.length}
                </span>{" "}
                tickets
              </p>
            </div>
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
              const StIcon = sc.icon;
              const CatIcon = cc.icon;
              const isClosed = ["resolved", "closed"].includes(selected.status);

              return (
                <>
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-mono font-bold text-gray-400">
                            {selected.ticketId}
                          </p>
                          <Badge cls={sc.cls} label={sc.label} icon={StIcon} />
                          <Badge cls={pc.cls} label={pc.label} />
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 line-clamp-1">
                          {selected.subject}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User size={10} /> {selected.userName} ·{" "}
                            {selected.userEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <CatIcon size={10} /> {cc.label}
                          </span>
                          {selected.orderId && (
                            <span className="flex items-center gap-1 font-mono">
                              <ShoppingBag size={10} /> {selected.orderId}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setShowMetaEdit((s) => !s)}
                          title="Edit status/priority"
                          className={`p-2 rounded-lg transition-colors ${
                            showMetaEdit
                              ? "bg-teal-500 text-white"
                              : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {showMetaEdit ? (
                            <ToggleRight size={15} />
                          ) : (
                            <ToggleLeft size={15} />
                          )}
                        </button>
                        <button
                          onClick={closeModal}
                          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Meta edit panel */}
                    {showMetaEdit && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={lbl}>Status</label>
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className={inp}
                            >
                              {Object.entries(STATUS_CFG).map(
                                ([v, { label }]) => (
                                  <option key={v} value={v}>
                                    {label}
                                  </option>
                                ),
                              )}
                            </select>
                          </div>
                          <div>
                            <label className={lbl}>Priority</label>
                            <select
                              value={editPriority}
                              onChange={(e) => setEditPriority(e.target.value)}
                              className={inp}
                            >
                              {PRIORITIES.map((p) => (
                                <option key={p.value} value={p.value}>
                                  {p.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className={lbl}>
                            Resolution Note (internal)
                          </label>
                          <textarea
                            rows={2}
                            value={resNote}
                            onChange={(e) => setResNote(e.target.value)}
                            placeholder="Internal note on how this was resolved…"
                            className={`${inp} resize-none`}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowMetaEdit(false)}
                            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveMeta}
                            disabled={savingMeta}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-500 hover:bg-teal-400 disabled:opacity-50 transition-all"
                          >
                            {savingMeta ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={12} />
                            )}{" "}
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="max-h-[45vh] overflow-y-auto p-5 space-y-4">
                    {selected.messages.map((msg, i) => {
                      const isUser = msg.senderType === "user";
                      return (
                        <div
                          key={i}
                          className={`flex gap-3 ${isUser ? "" : "flex-row-reverse"}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                              isUser
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                : "bg-teal-500 text-white"
                            }`}
                          >
                            {isUser ? (
                              <User size={14} />
                            ) : (
                              <UserCheck size={14} />
                            )}
                          </div>
                          <div
                            className={`max-w-[80%] flex flex-col gap-1 ${
                              isUser ? "items-start" : "items-end"
                            }`}
                          >
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isUser
                                  ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                                  : "bg-teal-500 text-white rounded-tr-sm"
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

                    {/* Satisfaction rating */}
                    {selected.satisfactionRating && (
                      <div className="flex items-center gap-2 justify-center py-2">
                        <span className="text-xs text-gray-400">
                          Customer rated:
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((v) => (
                            <Star
                              key={v}
                              size={14}
                              className={
                                v <= selected.satisfactionRating!
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resolution note */}
                    {selected.resolutionNote && (
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                          Internal Resolution Note
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {selected.resolutionNote}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Reply */}
                  {!isClosed ? (
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
                          placeholder="Reply to customer… (Enter to send)"
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
                  ) : (
                    <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 text-center">
                      <p className="text-xs text-gray-400">
                        This ticket is{" "}
                        <span className="font-semibold">{selected.status}</span>
                        .
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

export default AdminSupportPage;
