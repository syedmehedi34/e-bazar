"use client";

import { FileText } from "lucide-react";
import { SectionCard } from "./ui";

interface Props {
  note: string;
  setNote: (v: string) => void;
}

export function DeliveryNote({ note, setNote }: Props) {
  return (
    <SectionCard icon={FileText} title="Delivery Note" badge="Optional">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Any special instructions? (e.g. call before delivery, leave at door...)"
        rows={3}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm
                   text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                   focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none hover:border-gray-300"
      />
    </SectionCard>
  );
}
