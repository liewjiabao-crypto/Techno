import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "lime" | "amber" | "cyan" | "danger";

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-tight",
        tone === "neutral" && "border-[rgb(var(--border))] bg-[rgb(var(--panel2))] text-[rgb(var(--text))]",
        tone === "lime" && "border-[rgba(132,204,22,.45)] bg-[rgba(132,204,22,.14)] text-[rgb(var(--text))]",
        tone === "amber" && "border-[rgba(245,158,11,.45)] bg-[rgba(245,158,11,.14)] text-[rgb(var(--text))]",
        tone === "cyan" && "border-[rgba(34,211,238,.45)] bg-[rgba(34,211,238,.14)] text-[rgb(var(--text))]",
        tone === "danger" && "border-[rgba(244,63,94,.55)] bg-[rgba(244,63,94,.14)] text-[rgb(var(--text))]",
        className,
      )}
    >
      {children}
    </span>
  );
}
