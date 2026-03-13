// app/dashboard/admin/add-product/_components/ChipInput.tsx
"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { inputCls, labelCls } from "./types";

type Props = {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
};

const ChipInput = ({ label, values, onChange, placeholder }: Props) => {
  const [input, setInput] = useState("");

  const add = () => {
    const t = input.trim();
    if (t && !values.includes(t)) onChange([...values, t]);
    setInput("");
  };

  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder ?? `Add ${label.toLowerCase()}...`}
          className={inputCls}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2.5 rounded-xl text-white bg-teal-500 hover:bg-teal-400 transition-colors shrink-0"
        >
          <Plus size={15} />
        </button>
      </div>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                         bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400
                         border border-teal-200 dark:border-teal-500/20"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="text-teal-400 hover:text-teal-600 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChipInput;
