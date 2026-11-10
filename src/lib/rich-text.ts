export type RichTextToken =
  | { readonly type: 'text'; readonly value: string }
  | { readonly type: 'code'; readonly value: string }
  | { readonly type: 'emphasis'; readonly value: string };

const INLINE_MARK = /(`[^`]+`|\*[^*\s][^*]*\*)/g;

/**
 * Splits a content string into plain text, `code` and *emphasis* runs.
 *
 * This is the whole "markup language" of the content layer. It is deliberately tiny:
 * anything richer should become a typed field, not a syntax (docs/adr/0002).
 */
export function tokenizeRichText(source: string): RichTextToken[] {
  return source
    .split(INLINE_MARK)
    .filter((part) => part.length > 0)
    .map((part): RichTextToken => {
      if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
        return { type: 'code', value: part.slice(1, -1) };
      }
      if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
        return { type: 'emphasis', value: part.slice(1, -1) };
      }
      return { type: 'text', value: part };
    });
}
