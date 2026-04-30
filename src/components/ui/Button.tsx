import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border px-3 py-2 text-sm font-semibold tracking-tight transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--violet))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]",
          "disabled:pointer-events-none disabled:opacity-45",
          size === "sm" && "h-9 px-3",
          size === "md" && "h-10 px-4",
          size === "lg" && "h-11 px-5 text-base",
          variant === "primary" &&
            "border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(236,72,153,.18),rgba(168,85,247,.10))] text-[rgb(var(--text))] shadow-[0_0_0_1px_rgba(255,255,255,.35),0_14px_40px_-26px_rgba(168,85,247,.65)] hover:shadow-[0_0_0_1px_rgba(255,255,255,.45),0_18px_48px_-28px_rgba(236,72,153,.6)]",
          variant === "secondary" &&
            "border-[rgb(var(--border))] bg-[rgb(var(--panel2))] text-[rgb(var(--text))] hover:bg-[rgba(255,255,255,.65)] dark:hover:bg-[rgba(255,255,255,.08)]",
          variant === "ghost" && "border-transparent bg-transparent text-[rgb(var(--text))] hover:bg-[rgba(255,255,255,.35)] dark:hover:bg-[rgba(255,255,255,.08)]",
          variant === "danger" &&
            "border-[rgba(244,63,94,.65)] bg-[rgba(244,63,94,.14)] text-[rgb(var(--text))] hover:bg-[rgba(244,63,94,.20)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
