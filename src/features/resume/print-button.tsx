'use client';

/** Opens the browser's print dialog, which is also how the résumé is saved as a PDF. */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-12 items-center rounded-sm border border-rule-strong px-5 text-[0.9375rem] font-medium transition-colors duration-200 ease-editorial hover:border-ink hover:bg-ink hover:text-paper print:hidden"
    >
      {label}
    </button>
  );
}
