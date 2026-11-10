import { Fragment } from 'react';
import { tokenizeRichText } from '@/lib/rich-text';

/** Renders a content string with its inline `code` and *emphasis* marks. */
export function RichText({ children }: { children: string }) {
  return (
    <>
      {tokenizeRichText(children).map((token, index) => {
        if (token.type === 'code') {
          return (
            <code
              key={index}
              className="rounded-xs bg-paper-sunken px-1.5 py-0.5 font-mono text-[0.875em] break-words"
            >
              {token.value}
            </code>
          );
        }
        if (token.type === 'emphasis') return <em key={index}>{token.value}</em>;
        return <Fragment key={index}>{token.value}</Fragment>;
      })}
    </>
  );
}
