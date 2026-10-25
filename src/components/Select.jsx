import React, { useState, useEffect, useRef } from 'react';

/**
 * A listbox that behaves like one: the trigger is a button, the options are
 * a listbox, Arrow keys move the highlight, Enter and Space commit, Escape
 * closes, and a click outside dismisses.
 */
export default function Select({ id, value, onChange, options, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (value === '') setHighlight(0);
    else {
      const idx = options.findIndex((o) => o.value === value);
      if (idx >= 0) setHighlight(idx);
    }
  }, [value, options]);

  useEffect(() => {
    function onDoc(e) {
      if (open && !ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // Keep the highlighted option in view once the list is open.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector('[data-active="true"]');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [open, highlight]);

  const toggle = () => setOpen((s) => !s);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // a closed list opens on Enter or Space; an open one commits the highlight
      if (!open) {
        setOpen(true);
        return;
      }
      const sel = options[highlight];
      if (sel) {
        onChange(sel.value);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div className="select" ref={ref}>
      <button
        id={id}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={handleKey}
        className="select__trigger"
      >
        <span>{current.label}</span>
        <svg className="select__chevron" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M6 7l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
          className="select__list"
        >
          {options.map((opt, i) => (
            <button
              key={opt.value + i}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              data-active={i === highlight}
              className="select__option"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlight(i)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
