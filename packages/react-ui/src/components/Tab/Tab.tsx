import { cx } from '../../utils/cx.js';
import './Tab.css';

export interface TabRowProps {
  tabs: string[];
  selected: number;
  onSelect: (index: number) => void;
  className?: string;
}

/** Snacky Tab Row - inline tab selector with a 2px accent underline on the active tab. */
export function TabRow({ tabs, selected, onSelect, className }: TabRowProps) {
  return (
    <div className={cx('snacky-tabrow', className)} role="tablist">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={i === selected}
          className={cx('snacky-tab', i === selected && 'snacky-tab--active')}
          onClick={() => onSelect(i)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
