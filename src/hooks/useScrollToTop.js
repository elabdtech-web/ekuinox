import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useScrollToTop
 * @param {Object} options
 * @param {number} options.showAfter pixels scrolled before showing button (default 300)
 * @param {number} options.throttleMs throttle for scroll handler in ms (default 100)
 * @returns {{ visible: boolean, scrollToTop: () => void }}
 */
export default function useScrollToTop({ showAfter = 300, throttleMs = 100 } = {}) {
  const [visible, setVisible] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const now = Date.now();
      if (now - last.current < throttleMs) return;
      last.current = now;
      const y = window.scrollY || window.pageYOffset;
      setVisible(y > showAfter);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialize
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter, throttleMs]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { visible, scrollToTop };
}