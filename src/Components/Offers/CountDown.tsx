"use client";
import React, { useEffect, useState } from "react";

type CountdownProps = {
    targetDate: string | Date;
    onComplete?: () => void;
    className?: string;
    showLabels?: boolean; // label (Days/Hours...) দেখাবেকি
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
    let diff = Math.max(0, target.getTime() - now.getTime()); // milliseconds, never negative
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);
    return { days, hours, minutes, seconds };
};

export default function Countdown({
    targetDate,
    onComplete,
    className = "",
    showLabels = true,
}: CountdownProps) {
    const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;

    // validate date
    if (Number.isNaN(target.getTime())) {
        console.error("Countdown: invalid targetDate:", targetDate);
        return <div className="text-red-500">Invalid target date</div>;
    }

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target));
    useEffect(() => {
        // sync on prop change
        setTimeLeft(getTimeLeft(target));
        let finished = false;
        const id = setInterval(() => {
            const t = getTimeLeft(target);
            setTimeLeft(t);
            if (!finished && t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
                finished = true;
                if (onComplete) onComplete();
            }
        }, 1000);

        return () => clearInterval(id);
    }, [targetDate]); // re-run if targetDate changes

    return (
        <div className={`flex gap-4 items-center ${className}`} aria-live="polite">
            {/* Days */}
            <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold flex items-end gap-2">


                    {timeLeft.days}
                    {showLabels && <div className="text-sm  text-white rubik italic">Day</div>}
                </div>

            </div>

            {/* Hours */}
            <div className="text-center ">
                <div className="text-3xl md:text-4xl font-bold flex items-end gap-2">
                    {pad(timeLeft.hours)}
                    {showLabels && <div className="text-sm rubik italic">Hours</div>}
                </div>

            </div>

            {/* Minutes */}
            <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold flex items-end gap-2">
                    
                    {pad(timeLeft.minutes)}
                    {showLabels && <div className="text-sm rubik italic">Min</div>}
                </div>
                
            </div>

            {/* Seconds */}
            <div className="text-center w-20">
                <div className="text-3xl md:text-4xl font-bold flex items-end gap-2 ">
                    {pad(timeLeft.seconds)}
                    {showLabels && <div className="text-sm rubik italic ">Sec</div>}
                </div>
                
            </div>
        </div>
    );
}
