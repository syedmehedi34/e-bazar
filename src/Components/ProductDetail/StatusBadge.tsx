interface Props {
  status: string;
  stock: number;
}

const StatusBadge = ({ status, stock }: Props) => {
  const map: Record<string, { label: string; cls: string }> = {
    active: {
      label: `In Stock (${stock})`,
      cls: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800",
    },
    "out-of-stock": {
      label: "Out of Stock",
      cls: "text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800",
    },
    inactive: {
      label: "Unavailable",
      cls: "text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    },
    discontinued: {
      label: "Discontinued",
      cls: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800",
    },
  };

  const s = map[status] ?? map["active"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}
    >
      {status === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      )}
      {s.label}
    </span>
  );
};

export default StatusBadge;
