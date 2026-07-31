export type ClassValue = string | false | null | undefined;

/** Minimal `cn` — shadcn/ui-compatible signature, zero dependencies. */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
