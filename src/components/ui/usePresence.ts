"use client";

import { useEffect, useState } from "react";

/**
 * Drives enter/exit transitions for portalled overlays.
 * `mounted` keeps the node in the tree through the exit animation;
 * `shown` is the on-screen state to toggle transition classes against.
 */
export function usePresence(open: boolean, duration = 200) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Next frame so the initial (off-screen) styles commit before transitioning.
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(t);
  }, [open, duration]);

  return { mounted, shown };
}
