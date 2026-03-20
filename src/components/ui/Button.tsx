"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "lg" | "md";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "lg", className = "", children, ...props }, ref) => {
    const base =
      "touch-target rounded-xl font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-offset-2 active:scale-95";
    const variants = {
      primary: "bg-[var(--color-primary)] text-white hover:bg-blue-800 focus:ring-blue-300",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
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
