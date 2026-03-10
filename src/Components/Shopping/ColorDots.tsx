const OVERRIDES: Record<string, string> = {
  white: "#f4f4f5",
  black: "#18181b",
};

interface ColorDotsProps {
  colors: string[];
  max?: number;
}

export default function ColorDots({ colors, max = 6 }: ColorDotsProps) {
  if (!colors?.length) return null;
  const shown = colors.slice(0, max);
  const rest = colors.length - max;
  return (
    <div className="flex items-center gap-1">
      {shown.map((c, i) => (
        <span
          key={i}
          title={c}
          className="w-3 h-3 rounded-full border border-white dark:border-zinc-700 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600 shrink-0"
          style={{ background: OVERRIDES[c.toLowerCase()] ?? c }}
        />
      ))}
      {rest > 0 && (
        <span className="text-[10px] text-zinc-400 ml-0.5">+{rest}</span>
      )}
    </div>
  );
}
