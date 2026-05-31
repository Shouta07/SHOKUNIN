"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "lg" | "md";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "lg", className = "", children, ...props }, ref) => {
    const base =
      "touch-target rounded-xl font-bold transition-all focus:outline-none active:scale-95";
    const variants = {
      primary:
        "bg-[var(--color-accent)] text-[#0a0a1a] hover:brightness-110",
      secondary:
        "dq-window text-[var(--color-text)] hover:brightness-110",
      danger: "bg-red-800 text-white hover:bg-red-700",
    };
    const sizes = {
      lg: "px-6 py-4 text-lg min-h-[56px]",
      md: "px-4 py-3 text-base min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
