import { useEffect, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './BottomSheet.css';

export interface BottomSheetProps {
  open: boolean;
  onDismiss: () => void;
  children: ReactNode;
  /** Show the drag-handle bar. Defaults to false because 8 of Figma's 9
   *  Modal variants have no handle. The `driver` variant does: it draws a
   *  visible 40x4 `Driver Slider` (node 8693:6233). An earlier pass read
   *  that as "no variant shows one", which was wrong, so a Driver Tracking
   *  composition should pass showHandle. */
  showHandle?: boolean;
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
export function BottomSheet({ open, onDismiss, children, showHandle = false, className }: BottomSheetProps) {
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
        {showHandle && <div className="snacky-sheet__handle" />}
        {children}
      </div>
    </div>
  );
}
