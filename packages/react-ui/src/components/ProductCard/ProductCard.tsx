import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { DiscountTag } from '../Badge/Badge.js';
import { SoldOutBadge } from '../Badge/Badge.js';
import { IconButton } from '../IconButton/IconButton.js';
// Real icons as the fallback for every icon slot. These used to default to
// emoji/text glyphs, which meant a caller who omitted the prop silently got
// an emoji instead of the design system's own set, the exact thing the docs
// tell integrators never to do. Sizes match index.html's verified preview:
// 20px in the details actions, 16px in the list card's cart button.
import { cartAdd as CartAddIcon, chat as ChatIcon, heart as HeartOutlineIcon, share as ShareIcon } from '../../icons/outline.js';
import { heart as HeartSolidIcon, star as StarIcon } from '../../icons/solid.js';
import './ProductCard.css';

interface BaseProductCardProps {
  productName: string;
  imageUrl: string;
  price: string;
  rating: number;
  onClick?: () => void;
  className?: string;
}

export interface ProductCardListProps extends BaseProductCardProps {
  variant?: 'list';
  originalPrice?: string;
  discountLabel?: string;
  onAddToCart: () => void;
  cartIcon?: ReactNode;
  ratingIcon?: ReactNode;
}

export interface ProductCardDetailsProps extends BaseProductCardProps {
  variant: 'details';
  originalPrice?: string;
  discountLabel?: string;
  ratingCount: number;
  favorited: boolean;
  onFavoriteClick: () => void;
  onShareClick: () => void;
  onChatClick: () => void;
  sold?: boolean;
  ratingIcon?: ReactNode;
  favoriteIcon?: ReactNode;
  shareIcon?: ReactNode;
  chatIcon?: ReactNode;
}

export type ProductCardProps = ProductCardListProps | ProductCardDetailsProps;

/**
 * Snacky Product Card - `list` (default) for horizontal carousels/2-column
 * grids, `details` for the product detail page with rating count and
 * Favorite/Share/Chat actions.
 */
export function ProductCard(props: ProductCardProps) {
  if (props.variant === 'details') {
    const { productName, imageUrl, price, rating, originalPrice, discountLabel, ratingCount, favorited, onFavoriteClick, onShareClick, onChatClick, sold, ratingIcon, favoriteIcon, shareIcon, chatIcon, onClick, className } = props;
    return (
      <div className={cx('snacky-product-card', 'snacky-product-card--details', className)}>
        <div className="snacky-product-card__image-wrap" onClick={onClick}>
          <img className="snacky-product-card__image" src={imageUrl} alt={productName} />
          {sold && (
            <span className="snacky-product-card__discount">
              <SoldOutBadge />
            </span>
          )}
        </div>
        <p className="snacky-product-card__name">{productName}</p>
        <div className="snacky-product-card__price-row">
          <span className="snacky-product-card__price">{price}</span>
          {originalPrice && <span className="snacky-product-card__original-price">{originalPrice}</span>}
          {discountLabel && <DiscountTag label={discountLabel} />}
        </div>
        <div className="snacky-product-card__footer-row">
          <span className="snacky-product-card__rating">
            <span className="snacky-product-card__rating-icon">{ratingIcon ?? <StarIcon width={16} height={16} />}</span>
            {rating} ({ratingCount})
          </span>
          <div className="snacky-product-card__actions snacky-product-card__actions--details">
            {/* Solid heart when favorited, outline when not, mirroring index.html's fav-s/fav-o swap. */}
            <IconButton variant="secondary" icon={favoriteIcon ?? (favorited ? <HeartSolidIcon width={20} height={20} /> : <HeartOutlineIcon width={20} height={20} />)} selected={favorited} onClick={onFavoriteClick} ariaLabel="Favorite" />
            <IconButton variant="secondary" icon={shareIcon ?? <ShareIcon width={20} height={20} />} onClick={onShareClick} ariaLabel="Share" />
            <IconButton variant="secondary" icon={chatIcon ?? <ChatIcon width={20} height={20} />} onClick={onChatClick} ariaLabel="Chat with seller" />
          </div>
        </div>
      </div>
    );
  }

  const { productName, imageUrl, price, rating, originalPrice, discountLabel, onAddToCart, cartIcon, ratingIcon, onClick, className } = props;
  return (
    <div
      className={cx('snacky-product-card', 'snacky-product-card--list', className)}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      <div className="snacky-product-card__image-wrap">
        <img className="snacky-product-card__image" src={imageUrl} alt={productName} />
        {discountLabel && (
          <span className="snacky-product-card__discount">
            <DiscountTag label={discountLabel} />
          </span>
        )}
      </div>
      <p className="snacky-product-card__name">{productName}</p>
      <div className="snacky-product-card__price-row">
        <span className="snacky-product-card__price">{price}</span>
        {originalPrice && <span className="snacky-product-card__original-price">{originalPrice}</span>}
      </div>
      <div className="snacky-product-card__footer-row">
        <span className="snacky-product-card__rating">
          <span className="snacky-product-card__rating-icon">{ratingIcon ?? <StarIcon width={16} height={16} />}</span>
          {rating}
        </span>
        <IconButton
          variant="primary"
          icon={cartIcon ?? <CartAddIcon width={16} height={16} />}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          ariaLabel="Add to cart"
        />
      </div>
    </div>
  );
}
