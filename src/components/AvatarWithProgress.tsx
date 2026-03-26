"use client";

import { usePalette } from "@/contexts/PaletteContext";

export function AvatarWithProgress({ progress = 0.75, size = 34 }: { progress?: number; size?: number }) {
  const { ctaColor } = usePalette();
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ctaColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${progress * circumference} ${circumference}`}
        />
      </svg>
      <div
        className="absolute inset-0 m-auto overflow-hidden rounded-full"
        style={{ width: size - strokeWidth * 2 - 6, height: size - strokeWidth * 2 - 6 }}
      >
        <div className="h-full w-full bg-gradient-to-br from-violet-400 to-fuchsia-500" />
      </div>
    </div>
  );
}
