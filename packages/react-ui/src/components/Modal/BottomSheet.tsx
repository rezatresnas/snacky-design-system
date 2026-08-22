import { useEffect, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './BottomSheet.css';

export interface BottomSheetProps {
  open: boolean;
  onDismiss: () => void;
  children: ReactNode;
  /** Show the drag-handle bar. Confirmed against Figma: none of the 9
   *  documented Modal variants show one, so this defaults to false - opt
   *  in only if a future variant actually needs it. */
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
