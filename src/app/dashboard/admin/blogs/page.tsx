"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { useFetchBlog } from "@/hook/useFetchBlog";
import { toast } from "react-toastify";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  X,
  Save,
  Loader2,
  FileText,
  Calendar,
  User,
  Tag,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  RefreshCw,
  Upload,
  ImageIcon,
  // Image as ImageIconLucide,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface BlogContent {
  paragraph: string;
}
interface BlogComment {
  user: string;
  comment: string;
  date: string;
}
interface Blog {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  image: string;
  shortDescription: string;
  content: BlogContent[];
  comments: BlogComment[];
  createdAt: string;
  imagePublicId: string;
}
type SortField = "title" | "date" | "author";
type ModalMode = "view" | "add" | "edit";

// ── Shared styles ──────────────────────────────────────────────────
const inp = `w-full px-3 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800
  border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
  placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all`;
const lbl =
  "block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5";

const MODAL_ID = "blog-modal";
const openModal = () =>
  (document.getElementById(MODAL_ID) as HTMLDialogElement)?.showModal();
const closeModal = () =>
  (document.getElementById(MODAL_ID) as HTMLDialogElement)?.close();

const emptyForm = () => ({
  title: "",
  category: "",
  author: "",
  date: "",
  image: "",
  imagePublicId: "",
  shortDescription: "",
  rawContent: "",
});

// ── Highlight match ────────────────────────────────────────────────
const Highlight = ({ text, q }: { text: string; q: string }) => {
  if (!q.trim()) return <>{text}</>;
  const parts = text.split(
    new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
  );
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark
            key={i}
            className="bg-teal-200 dark:bg-teal-500/30 text-teal-900 dark:text-teal-200 rounded px-0.5"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
};

// ── Parse raw text → paragraphs ────────────────────────────────────
// Splits by double newline or single newline, trims, filters empty
const parseContent = (raw: string): BlogContent[] =>
  raw
    .split(/\n\n+|\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((paragraph) => ({ paragraph }));

// ── Main Page ──────────────────────────────────────────────────────
const AdminBlogsPage = () => {
  const { blogs, blogsLoading, blogsError, refetchBlogs } =
    useFetchBlog() as unknown as {
      blogs: Blog[];
      blogsLoading: boolean;
      blogsError: unknown;
      refetchBlogs: () => void;
    };

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Modal
  const [mode, setMode] = useState<ModalMode>("view");
  const [selected, setSelected] = useState<Blog | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [imgUploading, setImgUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Data ────────────────────────────────────────────────────────
  const allBlogs = useMemo(() => (blogs ?? []) as Blog[], [blogs]);

  const filtered = useMemo(() => {
    let list = [...allBlogs];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      const av = (a as never as Record<string, string>)[sortField] ?? "";
      const bv = (b as never as Record<string, string>)[sortField] ?? "";
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
    return list;
  }, [allBlogs, search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // ── Modal openers ────────────────────────────────────────────────
  const openView = (blog: Blog) => {
    setSelected(blog);
    setMode("view");
    openModal();
  };

  const openAdd = () => {
    setSelected(null);
    setForm(emptyForm());
    setMode("add");
    openModal();
  };

  const openEdit = (blog: Blog) => {
    setSelected(blog);
    setForm({
      title: blog.title,
      category: blog.category,
      author: blog.author,
      date: blog.date,
      image: blog.image,
      shortDescription: blog.shortDescription,
      rawContent: blog.content?.map((c) => c.paragraph).join("\n\n") ?? "",
      imagePublicId:
        (blog as Blog & { imagePublicId?: string }).imagePublicId ?? "",
    });
    setMode("edit");
    openModal();
  };

  // ── Image upload ─────────────────────────────────────────────────
  const handleImageUpload = async (file: File) => {
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm((p) => ({
        ...p,
        image: data.url,
        imagePublicId: data.publicId ?? "",
      }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setImgUploading(false);
    }
  };

  // ── Delete image from Cloudinary ────────────────────────────
  const deleteImageFromCloudinary = async (publicId: string) => {
    if (!publicId) return;
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
    } catch {
      // silent — image deletion is best-effort
    }
  };

  // ── Save ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.category.trim()) {
      toast.error("Category is required.");
      return;
    }
    if (!form.author.trim()) {
      toast.error("Author is required.");
      return;
    }
    if (!form.date.trim()) {
      toast.error("Date is required.");
      return;
    }
    if (!form.image.trim()) {
      toast.error("Cover image is required.");
      return;
    }
    if (!form.shortDescription.trim()) {
      toast.error("Short description is required.");
      return;
    }
    if (!form.rawContent.trim()) {
      toast.error("Content is required.");
      return;
    }

    const content = parseContent(form.rawContent);

    const payload = {
      title: form.title,
      category: form.category,
      author: form.author,
      date: form.date,
      image: form.image,
      imagePublicId: form.imagePublicId,
      shortDescription: form.shortDescription,
      content,
    };

    console.log("📝 Blog payload:", JSON.stringify(payload, null, 2));

    setSaving(true);
    try {
      // ── Cloudinary delete: if editing and image was replaced, delete the old image ──
      if (mode === "edit" && selected?.image && selected.image !== form.image) {
        const oldPublicId = (selected as Blog & { imagePublicId?: string })
          .imagePublicId;
        if (oldPublicId) deleteImageFromCloudinary(oldPublicId);
      }

      const url =
        mode === "edit" ? `/api/blogs/${selected?._id}` : "/api/blogs";
      const method = mode === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      closeModal();
      toast.success(mode === "edit" ? "Blog updated!" : "Blog published!");
      refetchBlogs();
    } catch {
      toast.error("Failed to save blog.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      // Find blog to get its image publicId before deleting
      const blog = allBlogs.find((b) => b._id === id);

      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      // ── Cloudinary delete: fires when a blog is deleted — removes cover image from Cloudinary ──
      if (blog?.imagePublicId) {
        deleteImageFromCloudinary(blog.imagePublicId);
      }

      toast.success("Blog deleted.");
      refetchBlogs();
    } catch {
      toast.error("Failed to delete blog.");
    } finally {
      setDeleting(null);
    }
  };

  // ── Derived content preview ───────────────────────────────────────
  const parsedParagraphs = useMemo(
    () => parseContent(form.rawContent),
    [form.rawContent],
  );

  // ── Loading / Error ───────────────────────────────────────────────
  if (blogsLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-800" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
          </div>
          <p className="text-sm text-gray-400">Loading blogs…</p>
        </div>
      </div>
    );

  if (blogsError)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <FileText size={32} className="text-red-400 mx-auto" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Failed to load blogs
          </p>
          <button
            onClick={() => refetchBlogs()}
            className="text-sm text-teal-500 hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw size={13} /> Try again
          </button>
        </div>
      </div>
    );

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Blogs
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage all blog posts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetchBlogs()}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-teal-500 hover:border-teal-300 transition-all"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-white transition-all shadow-sm shadow-teal-500/20"
            >
              <Plus size={15} /> Add Blog
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Blogs",
              value: allBlogs.length,
              color: "text-gray-700 dark:text-gray-300",
            },
            {
              label: "Categories",
              value: new Set(allBlogs.map((b) => b.category)).size,
              color: "text-blue-600 dark:text-blue-400",
            },
            {
              label: "Total Comments",
              value: allBlogs.reduce(
                (s, b) => s + (b.comments?.length ?? 0),
                0,
              ),
              color: "text-violet-600 dark:text-violet-400",
            },
            {
              label: "This Month",
              value: allBlogs.filter(
                (b) =>
                  new Date(b.createdAt).getMonth() === new Date().getMonth(),
              ).length,
              color: "text-teal-600 dark:text-teal-400",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                {label}
              </p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title or author…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all"
            />
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <FileText size={40} className="text-gray-300 dark:text-gray-700" />
            <p className="text-gray-500 font-medium">No blogs found</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    {(
                      [
                        { label: "Title", field: "title" as SortField },
                        {
                          label: "Author",
                          field: "author" as SortField,
                          hidden: "hidden md:table-cell",
                        },
                        {
                          label: "Date",
                          field: "date" as SortField,
                          hidden: "hidden lg:table-cell",
                        },
                        { label: "Comments", field: null },
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
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filtered.map((blog) => (
                    <tr
                      key={blog._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => openView(blog)}
                    >
                      {/* Title */}
                      <td className="pl-5 pr-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
                            {blog.image ? (
                              <Image
                                src={blog.image}
                                fill
                                alt={blog.title}
                                className="object-cover"
                              />
                            ) : (
                              <ImageIcon
                                size={16}
                                className="absolute inset-0 m-auto text-gray-400"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                              <Highlight text={blog.title} q={search} />
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                              {blog.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Author */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <User size={11} />
                          <Highlight text={blog.author ?? ""} q={search} />
                        </div>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar size={11} />
                          {blog.date}
                        </div>
                      </td>
                      {/* Comments */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MessageSquare size={11} />
                          {blog.comments?.length ?? 0}
                        </div>
                      </td>
                      {/* Actions */}
                      <td
                        className="px-4 py-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openView(blog)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600   hover:bg-teal-50  dark:hover:bg-teal-500/10  transition-all"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEdit(blog)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600   hover:bg-blue-50  dark:hover:bg-blue-500/10  transition-all"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            disabled={deleting === blog._id}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-50"
                          >
                            {deleting === blog._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {allBlogs.length}
                </span>{" "}
                blogs
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <dialog id={MODAL_ID} className="modal">
        <div
          className={`modal-box bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-0 overflow-hidden ${mode === "view" ? "max-w-2xl" : "max-w-2xl"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              {mode === "view"
                ? "Blog Details"
                : mode === "add"
                  ? "New Blog Post"
                  : "Edit Blog Post"}
            </h2>
            <button
              onClick={closeModal}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto">
            {/* ── VIEW MODE ── */}
            {mode === "view" && selected && (
              <div className="p-6 space-y-5">
                {selected.image && (
                  <div className="relative w-full h-52 rounded-xl overflow-hidden">
                    <Image
                      src={selected.image}
                      fill
                      alt={selected.title}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selected.title}
                  </h3>
                  {selected.category && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
                      {selected.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User size={11} />
                    {selected.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {selected.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={11} />
                    {selected.comments?.length ?? 0} comments
                  </span>
                </div>
                {selected.shortDescription && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic border-l-2 border-teal-400 pl-3">
                    {selected.shortDescription}
                  </p>
                )}
                <div className="space-y-3">
                  {selected.content?.map((c, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                        Paragraph {i + 1}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {c.paragraph}
                      </p>
                    </div>
                  ))}
                </div>
                {selected.tags?.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <Tag size={11} className="text-gray-400" />
                    {selected.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {selected.comments?.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <MessageSquare size={12} /> Comments (
                      {selected.comments.length})
                    </p>
                    {selected.comments.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-gray-800 dark:text-white">
                            {c.user}
                          </p>
                          <p className="text-[10px] text-gray-400">{c.date}</p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {c.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ADD / EDIT MODE — Facebook-style post editor ── */}
            {(mode === "add" || mode === "edit") && (
              <div>
                {/* Cover image area */}
                <div className="relative w-full bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  {form.image ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={form.image}
                        fill
                        alt="Cover"
                        className="object-cover"
                      />
                      {/* ── Cloudinary delete: fires when user removes the cover image in add/edit form ── */}
                      <button
                        onClick={() => {
                          deleteImageFromCloudinary(form.imagePublicId); // delete from Cloudinary
                          setForm((p) => ({
                            ...p,
                            image: "",
                            imagePublicId: "",
                          }));
                        }}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-24 gap-3">
                      <p className="text-xs text-gray-400 font-medium">
                        No cover image
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {/* Title — big, prominent */}
                  <textarea
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="Blog title..."
                    rows={2}
                    className="w-full text-xl font-bold text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 bg-transparent border-none outline-none resize-none leading-snug"
                  />

                  {/* Short description */}
                  <textarea
                    value={form.shortDescription}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        shortDescription: e.target.value,
                      }))
                    }
                    placeholder="Write a short description..."
                    rows={2}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 placeholder-gray-300 dark:placeholder-gray-600 bg-transparent border-none outline-none resize-none"
                  />

                  <div className="border-t border-gray-100 dark:border-gray-800" />

                  {/* Content area — auto paragraph detection */}
                  <div>
                    <textarea
                      value={form.rawContent}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, rawContent: e.target.value }))
                      }
                      placeholder={
                        "Write your blog content here...\n\nStart a new paragraph by pressing Enter twice.\n\nEach separate block will become its own paragraph."
                      }
                      rows={10}
                      className="w-full text-sm text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 bg-transparent border-none outline-none resize-none leading-relaxed"
                    />

                    {/* Live paragraph detection preview */}
                    {parsedParagraphs.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                          Detected:
                        </span>
                        {parsedParagraphs.map((_, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold"
                          >
                            Para {i + 1}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800" />

                  {/* Meta fields — compact row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Category</label>
                      <input
                        type="text"
                        value={form.category}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, category: e.target.value }))
                        }
                        placeholder="e.g. Technology"
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className={lbl}>Author</label>
                      <input
                        type="text"
                        value={form.author}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, author: e.target.value }))
                        }
                        placeholder="Author name"
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className={lbl}>Date</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, date: e.target.value }))
                        }
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className={lbl}>Cover Image</label>
                      <div className="flex gap-2">
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleImageUpload(f);
                          }}
                        />
                        <button
                          onClick={() => fileRef.current?.click()}
                          disabled={imgUploading}
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-teal-400 hover:text-teal-600 transition-all disabled:opacity-50 shrink-0"
                        >
                          {imgUploading ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Upload size={12} />
                          )}
                          {imgUploading ? "…" : "Upload"}
                        </button>
                        <input
                          type="text"
                          value={form.image}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, image: e.target.value }))
                          }
                          placeholder="or paste URL"
                          className={`${inp} flex-1`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
            <div>
              {mode === "view" && selected && (
                <button
                  onClick={() => openEdit(selected)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 transition-colors"
                >
                  <Edit3 size={12} /> Edit
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors"
              >
                {mode === "view" ? "Close" : "Cancel"}
              </button>
              {(mode === "add" || mode === "edit") && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-teal-500 hover:bg-teal-400 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  {mode === "add" ? "Publish" : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default AdminBlogsPage;
