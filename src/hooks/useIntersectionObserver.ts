import { useEffect, useRef } from "react";

// 利用 IntersectionObserver 監聽下方元素進入 viewport 時載入下一頁
export function useIntersectionObserver(callback: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // hook 只做事件觸發，不做條件判斷（hook 外部做）
          callback();
        }
      },
      { threshold: 1.0 } // 被觀察元素有多少比例進入 viewport 時，才會觸發 callback，1.0 代表完全進入
    );

    observer.observe(ref.current);

    return () => observer.disconnect(); // 清掉全部觀察（最保險）
  }, [callback]);

  return ref;
}
