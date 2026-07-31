import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] font-medium " +
  "transition-[background-color,border-color,color,transform] duration-150 " +
  "disabled:pointer-events-none disabled:opacity-40 active:scale-[0.99] whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-fg hover:bg-brand-strong",
  secondary: "bg-surface text-ink border border-line hover:bg-canvas",
  ghost: "bg-transparent text-muted hover:text-ink hover:bg-line-2",
  danger: "bg-critical text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-[15px]",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", full, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        full && "w-full",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
