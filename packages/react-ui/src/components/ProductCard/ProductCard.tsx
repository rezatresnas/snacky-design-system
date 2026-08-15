import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { DiscountTag } from '../Badge/Badge.js';
import { SoldOutBadge } from '../Badge/Badge.js';
import { IconButton } from '../IconButton/IconButton.js';
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
            {ratingIcon && <span className="snacky-product-card__rating-icon">{ratingIcon}</span>}
            {rating} ({ratingCount})
          </span>
          <div className="snacky-product-card__actions snacky-product-card__actions--details">
            <IconButton variant="secondary" icon={favoriteIcon ?? '♥'} selected={favorited} onClick={onFavoriteClick} ariaLabel="Favorite" />
            <IconButton variant="secondary" icon={shareIcon ?? '⤴'} onClick={onShareClick} ariaLabel="Share" />
            <IconButton variant="secondary" icon={chatIcon ?? '💬'} onClick={onChatClick} ariaLabel="Chat with seller" />
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
          {ratingIcon && <span className="snacky-product-card__rating-icon">{ratingIcon}</span>}
          {rating}
        </span>
        <IconButton
          variant="primary"
          icon={cartIcon ?? '+'}
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
