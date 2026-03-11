"use client";

import React, { useEffect, useState, useMemo } from "react";

type CountdownProps = {
  targetDate: string | Date;
  onComplete?: () => void;
  className?: string;
  accentColor?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const pad = (n: number) => n.toString().padStart(2, "0");

const getTimeLeft = (target: Date): TimeLeft => {
  const now = new Date();
  let diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds };
};

const units = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
] as const;

export default function Countdown({
  targetDate,
  onComplete,
  className = "",
  accentColor = "#f59e0b",
}: CountdownProps) {
  const target = useMemo(
    () => (typeof targetDate === "string" ? new Date(targetDate) : targetDate),
    [targetDate],
  );

  const invalidDate = Number.isNaN(target.getTime());

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    invalidDate
      ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
      : getTimeLeft(target),
  );

  useEffect(() => {
    if (invalidDate) return;
    setTimeLeft(getTimeLeft(target));
    let finished = false;
    const id = setInterval(() => {
      const t = getTimeLeft(target);
      setTimeLeft(t);
      if (
        !finished &&
        t.days === 0 &&
        t.hours === 0 &&
        t.minutes === 0 &&
        t.seconds === 0
      ) {
        finished = true;
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target, onComplete, invalidDate]);

  if (invalidDate)
    return <div className="text-red-400 text-sm">Invalid date</div>;

  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 ${className}`}
      aria-live="polite"
    >
      {units.map(({ key, label }, i) => (
        <React.Fragment key={key}>
          {/* Box */}
          <div className="flex flex-col items-center">
            <div
              className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-2xl
                         flex items-center justify-center
                         bg-white/10 dark:bg-black/20 backdrop-blur-sm
                         border border-white/20"
            >
              {/* Top shine */}
              <div className="absolute inset-x-0 top-0 h-px bg-white/30 rounded-t-2xl" />

              <span
                className="text-2xl sm:text-3xl font-extrabold tabular-nums rubik"
                style={{ color: key === "seconds" ? accentColor : "white" }}
              >
                {key === "days"
                  ? String(timeLeft.days).padStart(2, "0")
                  : pad(timeLeft[key])}
              </span>
            </div>
            <span className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
              {label}
            </span>
          </div>

          {/* Separator — not after last */}
          {i < units.length - 1 && (
            <span className="text-xl font-bold text-white/30 mb-5 select-none">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
