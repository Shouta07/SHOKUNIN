import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Eyebrow: section label above a heading ── */
export function Eyebrow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.14em] text-subtle",
        className,
      )}
      {...props}
    />
  );
}

/* ── Badge ── */
type Tone = "neutral" | "brand" | "positive" | "warning" | "critical";
const tones: Record<Tone, string> = {
  neutral: "bg-line-2 text-muted",
  brand: "bg-brand-soft text-brand",
  positive: "bg-positive/10 text-positive",
  warning: "bg-warning/10 text-warning",
  critical: "bg-critical/10 text-critical",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/* ── Field: label + control + hint, consistent vertical rhythm ── */
export function Field({
  label,
  hint,
  required,
  optional,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline gap-2">
        <label
          htmlFor={htmlFor}
          className="text-[13px] font-medium text-ink"
        >
          {label}
        </label>
        {required && (
          <span className="text-[11px] font-medium text-critical">必須</span>
        )}
        {optional && <span className="text-[11px] text-subtle">任意</span>}
      </div>
      {hint && <p className="text-[12px] leading-snug text-muted">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="text-[12px] font-medium text-critical">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Input / Textarea / Select ── */
const control =
  "w-full rounded-[var(--radius-control)] border border-line bg-surface px-3.5 text-[15px] text-ink " +
  "placeholder:text-subtle transition-colors focus:border-ink focus:outline-none " +
  "aria-[invalid=true]:border-critical";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(control, "h-11", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(control, "resize-none py-3 leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(control, "h-11 cursor-pointer appearance-none pr-9", className)}
    {...props}
  />
));
Select.displayName = "Select";

/* ── Steps: linear progress through a flow ── */
export function Steps({
  total,
  current,
  className,
}: {
  total: number;
  current: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex gap-1.5", className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-[3px] flex-1 rounded-full transition-colors duration-300",
            i < current ? "bg-ink" : "bg-line",
          )}
        />
      ))}
    </div>
  );
}

/* ── Meter: single-value progress with label ── */
export function Meter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-line-2", className)}>
      <div
        className="h-full rounded-full bg-ink transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ── LiveDot: status indicator ── */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 rounded-full bg-critical animate-pulse-dot",
        className,
      )}
    />
  );
}

/* ── Row: a bordered list row (Notion-style density) ── */
export function Row({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "tap flex w-full items-center gap-4 border-b border-line px-1 py-4 text-left",
        "transition-colors hover:bg-line-2/60",
        className,
      )}
      {...props}
    />
  );
}
