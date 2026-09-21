"use client";

import { useEffect, useRef, useState } from "react";

const EDGE_THRESHOLD = 8;

export default function EntryScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      setAtStart(el.scrollLeft <= EDGE_THRESHOLD);
      setAtEnd(
        el.scrollLeft + el.clientWidth >= el.scrollWidth - EDGE_THRESHOLD
      );
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="entry-scroll-wrap">
      <div
        className={
          atStart ? "entry-scroll-fade entry-scroll-fade--left is-hidden" : "entry-scroll-fade entry-scroll-fade--left"
        }
        aria-hidden="true"
      />
      <div ref={scrollRef} className="entry-scroll">
        {children}
      </div>
      <div
        className={
          atEnd ? "entry-scroll-fade entry-scroll-fade--right is-hidden" : "entry-scroll-fade entry-scroll-fade--right"
        }
        aria-hidden="true"
      />
    </div>
  );
}
