'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { analyseCnpj, type CheckDigitStep } from './cnpj-check-digits';

export interface CnpjPlaygroundLabels {
  readonly inputLabel: string;
  readonly inputHint: string;
  readonly examples: string;
  readonly status: {
    readonly empty: string;
    readonly incomplete: string;
    readonly invalidCharacters: string;
    readonly valid: string;
    readonly invalid: string;
  };
  readonly table: {
    readonly caption: string;
    readonly character: string;
    readonly value: string;
    readonly weight: string;
    readonly product: string;
    readonly sum: string;
    readonly remainder: string;
    readonly digit: string;
  };
}

/** Publicly documented examples: the official alphanumeric sample and two numeric ones. */
const EXAMPLES = ['12.ABC.345/01DE-35', '00.000.000/0001-91', '33.000.167/0001-01'] as const;

function StepTable({
  step,
  position,
  labels,
}: {
  step: CheckDigitStep;
  position: number;
  labels: CnpjPlaygroundLabels['table'];
}) {
  const rows = [
    { label: labels.character, cells: step.terms.map((term) => term.character) },
    { label: labels.value, cells: step.terms.map((term) => String(term.value)) },
    { label: labels.weight, cells: step.terms.map((term) => String(term.weight)) },
    { label: labels.product, cells: step.terms.map((term) => String(term.product)) },
  ];

  return (
    <div className="min-w-0">
      {/* Wide tables scroll inside their own region, which must then be keyboard-focusable. */}
      <div
        role="region"
        aria-label={`${labels.caption} ${position}`}
        tabIndex={0}
        className="overflow-x-auto rounded-sm border border-rule"
      >
        <table className="w-full border-collapse font-mono text-[0.8125rem]">
          <caption className="sr-only">
            {labels.caption} {position}
          </caption>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.label} className={cn(index > 0 && 'border-t border-rule')}>
                <th
                  scope="row"
                  className="bg-paper-sunken px-3 py-2 text-left font-medium whitespace-nowrap text-ink-soft"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-2.5 py-2 text-right tabular-nums">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm text-ink-soft">
        <div className="flex gap-2">
          <dt>{labels.sum}:</dt>
          <dd className="font-mono">{step.sum}</dd>
        </div>
        <div className="flex gap-2">
          <dt>{labels.remainder}:</dt>
          <dd className="font-mono">{step.remainder}</dd>
        </div>
        <div className="flex gap-2">
          <dt>
            {labels.digit} {position}:
          </dt>
          <dd className="font-mono font-semibold text-ink">{step.digit}</dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * An interactive island: the only JavaScript-driven widget on the page. All logic lives in
 * `cnpj-check-digits.ts`, which is pure and unit-tested; this file only renders its result.
 */
export function CnpjPlayground({ labels }: { labels: CnpjPlaygroundLabels }) {
  const [value, setValue] = useState<string>(EXAMPLES[0]);
  const inputId = useId();
  const hintId = useId();
  const statusId = useId();
  const analysis = analyseCnpj(value);

  let message: string;
  let tone: 'neutral' | 'valid' | 'invalid' = 'neutral';
  switch (analysis.status) {
    case 'empty':
      message = labels.status.empty;
      break;
    case 'incomplete':
      message = `${analysis.missing} ${labels.status.incomplete}`;
      break;
    case 'invalid-characters':
      message = labels.status.invalidCharacters;
      tone = 'invalid';
      break;
    case 'valid':
      message = `${analysis.formatted} — ${labels.status.valid}`;
      tone = 'valid';
      break;
    case 'invalid':
      message = `${labels.status.invalid} ${analysis.expected}.`;
      tone = 'invalid';
      break;
  }

  return (
    <div className="min-w-0 rounded-sm border border-rule bg-paper-raised p-5 sm:p-7">
      <label htmlFor={inputId} className="label text-ink-muted">
        {labels.inputLabel}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-describedby={`${hintId} ${statusId}`}
        aria-invalid={tone === 'invalid'}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={24}
        className="mt-2 block h-14 w-full rounded-sm border border-rule-strong bg-paper px-4 font-mono text-lg tracking-wide uppercase focus:border-ink"
      />
      <p id={hintId} className="mt-2 text-sm text-ink-muted">
        {labels.inputHint}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 label text-ink-muted">{labels.examples}</span>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setValue(example)}
            className="inline-flex h-11 items-center rounded-sm border border-rule px-3 font-mono text-[0.8125rem] transition-colors hover:border-ink"
          >
            {example}
          </button>
        ))}
      </div>

      {/* A live region: the verdict is announced as the visitor types, not only shown. */}
      <p
        id={statusId}
        role="status"
        className={cn(
          'mt-6 border-l-2 py-1 pl-4 font-medium',
          tone === 'valid' && 'border-ink text-ink',
          tone === 'invalid' && 'border-accent text-accent-strong',
          tone === 'neutral' && 'border-rule-strong text-ink-soft',
        )}
      >
        {message}
      </p>

      {analysis.status === 'valid' || analysis.status === 'invalid' ? (
        <div className="mt-6 grid min-w-0 gap-6">
          <StepTable step={analysis.steps[0]} position={1} labels={labels.table} />
          <StepTable step={analysis.steps[1]} position={2} labels={labels.table} />
        </div>
      ) : null}
    </div>
  );
}
