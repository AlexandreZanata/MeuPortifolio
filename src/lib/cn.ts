type ClassValue = string | false | null | undefined;

/** Joins class names, skipping falsy entries. Deliberately tiny: no merging, no conflicts. */
export function cn(...values: readonly ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
