import manifest from '@/content/images.json';
import { asset } from '@/lib/config';

type Entry = { w: number; h: number; c: string };
const images = manifest as Record<string, Entry>;

export const imageMeta = (name: string): Entry => images[name] ?? { w: 1600, h: 1000, c: '#d6d3cc' };
/** True for photos bundled with the site (vs. uploaded files / URLs). */
export const isBundledImage = (name: string | null | undefined) => !!name && Object.prototype.hasOwnProperty.call(images, name);
export const imageSrc = (name: string, size: 800 | 1600 = 1600) => asset(`/images/${name}-${size}.webp`);

type Props = {
  name: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Use a fixed aspect box (object-cover) instead of the photo's own ratio. */
  fill?: boolean;
};

/** Responsive photo with intrinsic size (no layout shift) and a colour placeholder. */
export function Img({ name, alt, className = '', sizes = '(min-width: 1024px) 50vw, 100vw', priority, fill }: Props) {
  const m = imageMeta(name);
  const small = Math.min(1, 800 / Math.max(m.w, m.h));
  const w800 = Math.round(m.w * small);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc(name, 800)}
      srcSet={`${imageSrc(name, 800)} ${w800}w, ${imageSrc(name, 1600)} ${m.w}w`}
      sizes={sizes}
      width={m.w}
      height={m.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      style={{ backgroundColor: m.c }}
      className={`${fill ? 'h-full w-full object-cover' : 'h-auto w-full'} ${className}`}
    />
  );
}
