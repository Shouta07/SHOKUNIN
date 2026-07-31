import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  interactive,
  selected,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  selected?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border bg-surface",
        selected ? "border-ink" : "border-line",
        interactive &&
          "cursor-pointer transition-colors duration-150 hover:border-subtle",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-[15px] font-semibold text-ink", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-1 text-[13px] leading-relaxed text-muted", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-t border-line-2 px-5 py-4", className)}
      {...props}
    />
  );
}
