"use client";

import { useEffect, useState } from "react";

// August 24, 2026, 12:00 PM EDT (fixed UTC-4 offset)
const TARGET_ISO = "2026-08-24T12:00:00-04:00";

type TimeLeft = {
  days: number;
  hours: number;
  mins: number;
  secs: number;
};

function getTimeLeft(): TimeLeft | null {
  const diff = new Date(TARGET_ISO).getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins: Math.floor((diff % 3_600_000) / 60_000),
    secs: Math.floor((diff % 60_000) / 1000),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="countdown" aria-label="Countdown to launch">
      <div className="countdown-unit">
        <span className="countdown-value">{timeLeft.days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-value">{pad(timeLeft.hours)}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-value">{pad(timeLeft.mins)}</span>
        <span className="countdown-label">Mins</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-value">{pad(timeLeft.secs)}</span>
        <span className="countdown-label">Secs</span>
      </div>
    </div>
  );
}
