"use client";

import { usePathname } from "next/navigation";

function sectionKey(pathname: string | null): string {
  if (!pathname) return "assets";
  if (pathname === "/projects" || pathname.startsWith("/projects/")) return "folders";
  if (pathname === "/apps") return "apps";
  if (pathname === "/spaces" || pathname.startsWith("/spaces/")) return "spaces";
  if (pathname === "/stock") return "stock";
  if (pathname === "/academy" || pathname.startsWith("/academy/")) return "academy";
  if (pathname === "/ai-suite" || pathname.startsWith("/ai-suite/")) return "ai-suite";
  if (pathname === "/video" || pathname.startsWith("/video/")) return "video";
  if (pathname === "/audio" || pathname.startsWith("/audio/")) return "audio";
  if (pathname === "/3d" || pathname.startsWith("/3d/")) return "3d";
  if (pathname === "/") return "assets";
  if (pathname === "/home" || pathname.startsWith("/home/")) return "home";
  if (pathname.startsWith("/assets/")) return "assets";
  return "assets";
}

export function PageContentTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const key = sectionKey(pathname);

  return (
    <div
      key={key}
      className={[className, "main-content-enter"].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
