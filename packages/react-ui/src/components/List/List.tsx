import { cx } from '../../utils/cx.js';
import { Button } from '../Button/Button.js';
import './List.css';

export type OrderStatus = 'waiting' | 'process' | 'processCod' | 'shipped' | 'received' | 'cancelled';

const STATUS_LABEL: Record<OrderStatus, string> = {
  waiting: 'Waiting for Payment',
  process: 'Order Processing',
  processCod: 'Order Processing',
  shipped: 'Order Shipped',
  received: 'Order Received',
  cancelled: 'Order Cancelled',
};

const STATUS_ACTION: Partial<Record<OrderStatus, string>> = {
  shipped: 'Track Shipment',
  received: 'Buy Again',
  cancelled: 'Buy Again',
};

export interface OrderListItemProps {
  productImage: string;
  /** The first/representative product in the order, shown next to the status. */
  productName: string;
  status: OrderStatus;
  /** e.g. "2 products" */
  itemsSummary: string;
  /** e.g. "Rp 8,000" */
  total: string;
  /** Waiting status only, e.g. "Dec 30, 11:00" */
  paymentDeadline?: string;
  /** Overrides the status-derived CTA label (Track Shipment / Buy Again). */
  actionLabel?: string;
  onAction?: () => void;
  /** Card click, e.g. to open order detail. */
  onClick?: () => void;
  className?: string;
}

/**
 * Snacky Order List Item - order summary card. Layout, CTA, and the COD chip
 * / payment-deadline banner are all driven by `status`, matching the real
 * per-status variants (Waiting/Process/Process COD/Shipped/Received/Cancelled).
 */
export function OrderListItem({
  productImage,
  productName,
  status,
  itemsSummary,
  total,
  paymentDeadline,
  actionLabel,
  onAction,
  onClick,
  className,
}: OrderListItemProps) {
  const action = actionLabel ?? STATUS_ACTION[status];
  const isCod = status === 'processCod';

  return (
    <div
      className={cx('snacky-order-item', className)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      <div className="snacky-order-item__top">
        <div className="snacky-order-item__thumb-box">
          <img className="snacky-order-item__thumb" src={productImage} alt="" />
        </div>
        <div className="snacky-order-item__info">
          <span
            className={cx('snacky-order-item__status', status === 'cancelled' && 'snacky-order-item__status--cancelled')}
          >
            {STATUS_LABEL[status]}
          </span>
          <span className="snacky-order-item__name">{productName}</span>
        </div>
      </div>

      <div className="snacky-order-item__details">
        <span className="snacky-order-item__count">{itemsSummary}</span>
        <span className={cx('snacky-order-item__total', isCod && 'snacky-order-item__total--cod')}>
          Order Total: <b>{total}</b>
        </span>
        {isCod && <span className="snacky-order-item__cod">COD</span>}
      </div>

      {status === 'waiting' && paymentDeadline && (
        <div className="snacky-order-item__deadline">Pay before {paymentDeadline}</div>
      )}

      {action && (
        <div className="snacky-order-item__action-row">
          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              onAction?.();
            }}
          >
            {action}
          </Button>
        </div>
      )}
    </div>
  );
}

export interface NotificationListItemProps {
  title: string;
  message: string;
  unread?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Snacky Notification List Item - accent-tinted background for unread items. */
export function NotificationListItem({ title, message, unread = false, onClick, className }: NotificationListItemProps) {
  return (
    <div
      className={cx('snacky-notif-item', unread && 'snacky-notif-item--unread', className)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      <span className="snacky-notif-item__title">{title}</span>
      <span className="snacky-notif-item__message">{message}</span>
    </div>
  );
}
