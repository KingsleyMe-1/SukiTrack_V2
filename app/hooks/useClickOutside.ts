import { useEffect, useRef, type RefObject } from "react";

export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void
): void {
  const savedHandler = useRef(handler);
  const savedRefs = useRef(refs);

  useEffect(() => {
    savedHandler.current = handler;
    savedRefs.current = refs;
  });

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      const inside = savedRefs.current.some((r) => r.current?.contains(e.target as Node));
      if (!inside) savedHandler.current();
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);
}
