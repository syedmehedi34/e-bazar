import { Star } from "lucide-react";

interface StarsProps {
  rating: number;
  size?: number;
}

export default function Stars({ rating, size = 10 }: StarsProps) {
  return (
    <span className="flex gap-px">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-100 text-zinc-100 dark:fill-zinc-800 dark:text-zinc-800"
          }
        />
      ))}
    </span>
  );
}
