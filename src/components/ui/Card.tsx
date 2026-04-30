import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))] shadow-[0_0_0_1px_rgba(0,0,0,0),0_16px_60px_-46px_rgba(0,0,0,.85)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
