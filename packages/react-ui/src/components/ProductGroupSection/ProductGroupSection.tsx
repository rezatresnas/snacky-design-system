import { useRef, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { angleSmallRight as AngleSmallRightIcon } from '../../icons/solid.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Section } from '../Section/Section.js';
import './ProductGroupSection.css';

export type ProductGroupLayout = 'horizontal' | 'banner' | 'grid';

export interface ProductGroupSectionProps {
  title: string;
  /**
   * `horizontal`: one scrolling row of cards (Figma Section `Group-Products-Horizontal`).
   * `banner`: the row laid over a full-bleed banner from x160, scrolling over it (`Group-Products-Banner`).
   * `grid`: two columns (`Group-Products-vertical`).
   */
  layout: ProductGroupLayout;
  /** The products, normally `ProductCard`s with `variant="list"`. */
  children: ReactNode;
  /** Shows the header chevron and, in the scrolling layouts, the trailing "See other products" card. */
  onSeeMore?: () => void;
  seeMoreLabel?: string;
  /** Required for `layout="banner"`, normally a `SquareBanner`. It sits still behind the scrolling row. */
  banner?: ReactNode;
  className?: string;
}

/**
 * Snacky Product Group Section: a titled group of product cards, the pattern
 * behind three of Figma's Section variants (8 instances across Home and product
 * detail). Section itself stays a generic shell; this packages the product
 * layouts so they can be used by name instead of rebuilt by hand.
 */
export function ProductGroupSection({
  title,
  layout,
  children,
  onSeeMore,
  seeMoreLabel = 'See other products',
  banner,
  className,
}: ProductGroupSectionProps) {
  const drag = useDragScroll();
  const seeMore = onSeeMore && layout !== 'grid' && (
    <div className="snacky-product-group__see-more">
      <IconButton size="small" icon={<AngleSmallRightIcon />} onClick={onSeeMore} ariaLabel={seeMoreLabel} />
      <span className="snacky-product-group__see-more-label">{seeMoreLabel}</span>
    </div>
  );

  return (
    <Section
      title={title}
      onAction={onSeeMore}
      className={cx('snacky-product-group', `snacky-product-group--${layout}`, className)}
    >
      {layout === 'grid' && <div className="snacky-product-group__grid">{children}</div>}
      {layout === 'horizontal' && (
        <div className="snacky-product-group__row" {...drag}>
          {children}
          {seeMore}
        </div>
      )}
      {layout === 'banner' && (
        <div className="snacky-product-group__stage">
          <div className="snacky-product-group__banner">{banner}</div>
          <div className="snacky-product-group__row" {...drag}>
            {children}
            {seeMore}
          </div>
        </div>
      )}
    </Section>
  );
}

/**
 * Lets a mouse drag the row the way a finger scrolls it; touch and trackpad
 * already scroll natively. The pointer is captured only after a 4px move, so a
 * plain tap on a card's cart button still lands, and the click that ends a real
 * drag is swallowed.
 */
function useDragScroll() {
  const state = useRef<{ x: number; left: number; moved: boolean; id: number } | null>(null);
  const justDragged = useRef(false);
  return {
    onPointerDown(e: PointerEvent<HTMLDivElement>) {
      if (e.pointerType !== 'mouse') return;
      state.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false, id: e.pointerId };
    },
    onPointerMove(e: PointerEvent<HTMLDivElement>) {
      const d = state.current;
      if (!d) return;
      const dx = e.clientX - d.x;
      if (!d.moved && Math.abs(dx) > 4) {
        d.moved = true;
        e.currentTarget.setPointerCapture(d.id);
        e.currentTarget.classList.add('snacky-product-group__row--dragging');
      }
      if (d.moved) e.currentTarget.scrollLeft = d.left - dx;
    },
    onPointerUp(e: PointerEvent<HTMLDivElement>) {
      if (state.current?.moved) {
        e.currentTarget.classList.remove('snacky-product-group__row--dragging');
        justDragged.current = true;
        setTimeout(() => {
          justDragged.current = false;
        }, 0);
      }
      state.current = null;
    },
    onPointerCancel() {
      state.current = null;
    },
    onClickCapture(e: { stopPropagation(): void; preventDefault(): void }) {
      if (justDragged.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    onDragStart(e: { preventDefault(): void }) {
      e.preventDefault();
    },
  };
}
