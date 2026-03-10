import { Check } from "lucide-react";

interface Props {
  color: string;
  selected: boolean;
  onClick: () => void;
}

const ColorDot = ({ color, selected, onClick }: Props) => (
  <button
    onClick={onClick}
    title={color}
    className={`relative w-7 h-7 rounded-full transition-all ${
      selected
        ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110 shadow"
        : "hover:scale-105 shadow-sm"
    }`}
    style={{ backgroundColor: color.toLowerCase() }}
  >
    {selected && (
      <span className="absolute inset-0 flex items-center justify-center">
        <Check size={11} className="text-white drop-shadow" />
      </span>
    )}
  </button>
);

export default ColorDot;
