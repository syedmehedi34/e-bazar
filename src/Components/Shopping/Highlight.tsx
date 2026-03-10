interface HighlightProps {
  text: string;
  q: string;
}

export default function Highlight({ text, q }: HighlightProps) {
  if (!q) return <>{text}</>;
  return (
    <>
      {text.split(new RegExp(`(${q})`, "gi")).map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark
            key={i}
            className="bg-amber-200 dark:bg-amber-900/40 text-inherit not-italic px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
