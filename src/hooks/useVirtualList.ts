import { useEffect, useState } from "react";
import type { DonationItem } from "@/types/interfaces";

interface UseVirtualListProps {
  items: DonationItem[];
  itemHeight: number;
  buffer: number;
  containerRef: React.RefObject<HTMLElement | null>;
}

export function useVirtualList({
  items,
  itemHeight,
  buffer,
  containerRef,
}: UseVirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + buffer, items.length);
  const visibleItems = items.slice(startIndex, endIndex);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.getBoundingClientRect().height);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [containerRef]);

  return {
    visibleItems,
    startIndex,
    setScrollTop,
  };
}
