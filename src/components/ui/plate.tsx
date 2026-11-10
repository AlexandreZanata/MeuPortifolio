import Image from 'next/image';
import { cn } from '@/lib/cn';

export interface PlateImageProps {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /**
   * Set it on the one plate that is visible when the page arrives. See the note on
   * `PlateImage` for what it changes.
   */
  readonly priority?: boolean;
  readonly className?: string;
}

/**
 * The drawing of a plate, without frame or caption. Plates are decorative, so they are
 * hidden from assistive technology; the caption next to them carries the meaning.
 *
 * There are two ways to show one, and the difference is deliberate:
 *
 * - By default it is a lazy `<img>`: plates further down the page cost nothing until the
 *   visitor scrolls near them.
 * - With `priority` it is drawn by reference (`<use href="plate.svg#plate">`). The file is
 *   fetched as soon as the markup is parsed, and because the drawing is vector content
 *   rather than an image element, the browser's Largest Contentful Paint stays on the
 *   page's text, which is the content that matters, instead of waiting for an ornament.
 *
 * Either way the box is sized from `width` and `height` before anything loads, so the
 * layout never shifts.
 */
export function PlateImage({ src, width, height, priority = false, className }: PlateImageProps) {
  if (priority) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        focusable="false"
        className={cn('h-auto w-full', className)}
      >
        <use href={`${src}#plate`} />
      </svg>
    );
  }
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt=""
      decoding="async"
      className={cn('h-auto w-full', className)}
    />
  );
}

export interface PlateProps extends PlateImageProps {
  /** Shown under the plate. */
  readonly caption?: string;
  /** Prefix of the caption, e.g. "Fig. 2". */
  readonly figure?: string;
  readonly imageClassName?: string;
}

/** A framed plate with its caption, as used at the top of a case study. */
export function Plate({ caption, figure, className, imageClassName, ...image }: PlateProps) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-sm border border-rule bg-paper px-[6%] py-[5%]">
        <PlateImage {...image} {...(imageClassName ? { className: imageClassName } : {})} />
      </div>
      {caption ? (
        <figcaption className="mt-3 label text-ink-muted">
          {figure ? (
            <>
              <span className="text-ink">{figure}</span>
              <span aria-hidden="true"> — </span>
            </>
          ) : null}
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
