"use client";

import { useEffect } from "react";

// Satpam lapisan gerak (taste-skill step 9):
// - menandai <html class="js"> supaya aturan [data-reveal] hanya
//   aktif saat JS benar-benar jalan (aman tanpa JS).
// - IntersectionObserver memicu data-reveal="in" satu kali per elemen.
export function MotionRoot() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (!("IntersectionObserver" in window)) {
      for (const t of targets) t.setAttribute("data-reveal", "in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    for (const t of targets) io.observe(t);
    return () => io.disconnect();
  }, []);

  return null;
}
