import { Star } from "lucide-react";

interface Props {
  rating: number;
  size?: number;
}

const StarRating = ({ rating, size = 13 }: Props) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={
          s <= Math.round(rating ?? 0)
            ? "fill-amber-400 text-amber-400"
            : "text-gray-200 dark:text-gray-700"
        }
      />
    ))}
  </div>
);

export default StarRating;
