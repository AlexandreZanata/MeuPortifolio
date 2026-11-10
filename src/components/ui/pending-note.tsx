/**
 * Marks a spot where confirmed content is still missing (see `content/pending.ts`).
 * It renders only outside production builds, so an unfinished field can never reach
 * visitors as a placeholder.
 */
export function PendingNote({ label, note }: { label: string; note: string }) {
  if (process.env.NODE_ENV === 'production') return null;
  return (
    <p className="rounded-sm border border-dashed border-accent px-3 py-2 label text-accent-strong">
      {label}: {note}
    </p>
  );
}
