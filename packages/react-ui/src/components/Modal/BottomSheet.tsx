import { useEffect, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './BottomSheet.css';

export interface BottomSheetProps {
  open: boolean;
  onDismiss: () => void;
  children: ReactNode;
  /** Hide the drag-handle bar, e.g. for content that supplies its own header. */
  hideHandle?: boolean;
  className?: string;
}

/**
 * Snacky Bottom Sheet - the shared modal shell every documented Modal
 * "variant" (Welcome, Success, Confirmation, Calendar, Variants Selector,
 * Payment Methods, Buyer Reviews, Driver Tracking) composes from, matching
 * `SnackyBottomSheet(onDismiss = {...}) { ...content... }` in the code samples.
 * 20px radius on top corners only, dim overlay backdrop, dismiss on
 * backdrop click or Escape.
 */
export function BottomSheet({ open, onDismiss, children, hideHandle = false, className }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismiss();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className="snacky-sheet-overlay" onClick={onDismiss}>
      <div
        className={cx('snacky-sheet', className)}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {!hideHandle && <div className="snacky-sheet__handle" />}
        {children}
      </div>
    </div>
  );
}
