/**
 * Marks content that has not been confirmed by the site owner yet.
 *
 * The site never invents personal facts. A field that is not verified is stored as
 * `pending('what is missing')`; components skip it in production and show a dashed
 * marker in development, and `collectPending` lists every open item (see docs/CONTENT.md).
 */
export interface Pending {
  readonly pending: true;
  readonly note: string;
}

export type Maybe<T> = T | Pending;

export function pending(note: string): Pending {
  return { pending: true, note };
}

export function isPending(value: unknown): value is Pending {
  return (
    typeof value === 'object' &&
    value !== null &&
    'pending' in value &&
    (value as { pending: unknown }).pending === true
  );
}

/** Returns the value when it is confirmed, otherwise `undefined`. */
export function confirmed<T>(value: Maybe<T>): T | undefined {
  return isPending(value) ? undefined : value;
}

export interface PendingItem {
  readonly path: string;
  readonly note: string;
}

/** Walks a content object and returns every pending field with its dotted path. */
export function collectPending(value: unknown, path = ''): PendingItem[] {
  if (isPending(value)) return [{ path, note: value.note }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectPending(item, `${path}[${index}]`));
  }
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, item]) =>
      collectPending(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}
