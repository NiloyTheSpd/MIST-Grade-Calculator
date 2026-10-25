import React from 'react';

/**
 * The course switch: two credits or three. A pair of radio buttons dressed
 * as one control, so the choice is announced and keyboard-navigable as such.
 */
export default function CreditToggle({ value, onChange }) {
  return (
    <fieldset className="tog">
      <legend className="tog__legend">Course credit</legend>
      <div className="tog__row">
        {[
          { v: '2', label: '2 credit' },
          { v: '3', label: '3 credit' }
        ].map((opt) => (
          <label
            key={opt.v}
            className={`tog__opt${value === opt.v ? ' is-on' : ''}`}
          >
            <input
              type="radio"
              name="credits"
              value={opt.v}
              checked={value === opt.v}
              onChange={(e) => onChange(e.target.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
