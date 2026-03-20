'use client';
import { useEffect, useRef, useState } from 'react';

export default function Dropdown({ trigger, items, align = 'left' }) {
  const [state, setState] = useState('closed');
  const rootRef = useRef(null);
  const timerRef = useRef(null);

  function open() {
    clearTimeout(timerRef.current);
    setState('open');
  }

  function close() {
    setState('closing');
    timerRef.current = setTimeout(() => setState('closed'), 150);
  }

  function toggle() {
    if (state === 'open') {
      close();
    } else {
      open();
    }
  }

  useEffect(() => {
    if (state !== 'open') return;

    function handlePointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        close();
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const isVisible = state === 'open' || state === 'closing';

  return (
    <div ref={rootRef} className="dropdown-root">
      <button
        className="dropdown-trigger"
        onClick={toggle}
        aria-expanded={state === 'open'}
        aria-haspopup="menu"
        data-open={state === 'open' || undefined}
      >
        <span>{trigger}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="dropdown-chevron"
          data-open={state === 'open' || undefined}
          aria-hidden="true"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isVisible && (
        <div
          className="dropdown-menu"
          data-state={state}
          data-align={align}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={`sep-${i}`} className="dropdown-separator" role="separator" />
            ) : (
              <button
                key={item.label}
                className="dropdown-item"
                style={{ '--i': i }}
                role="menuitem"
                data-destructive={item.destructive || undefined}
                onClick={() => {
                  item.onSelect?.();
                  close();
                }}
              >
                {item.icon && (
                  <span className="dropdown-item-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className="dropdown-item-label">{item.label}</span>
                {item.shortcut && (
                  <kbd className="dropdown-item-shortcut">{item.shortcut}</kbd>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
