"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: "left" | "right" | "top" | "bottom";
}

export function Tooltip({ children, content, side = "right" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sideClasses = {
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
  };

  useEffect(() => {
    if (isVisible) {
      // Set timeout to hide tooltip after 1 second
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isVisible]);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => {
        setIsVisible(false);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      }}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-[9999] pointer-events-none whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium transition-opacity ${
            sideClasses[side]
          }`}
          style={{
            background: "var(--surface-1)",
            color: "var(--surface-foreground-0)",
            border: "1px solid var(--surface-border-alpha-1)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
