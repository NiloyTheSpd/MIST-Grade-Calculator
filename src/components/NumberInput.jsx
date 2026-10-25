import React from 'react';

/**
 * One row of the sheet: a label, a number field, and the validation message
 * when the number is out of bounds.
 */
export default function NumberInput({ name, label, value, onChange, max, error, note }) {
  return (
    <div className={`row${error ? ' row--bad' : ''}`}>
      <label className="row__label" htmlFor={name}>
        <span>{label}</span>
        {note ? <small className="row__note">{note}</small> : null}
      </label>
      <input
        type="number"
        inputMode="numeric"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        min={0}
        max={max}
        placeholder={`0–${max}`}
        className="row__input mono"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error ? (
        <p className="row__error" id={`${name}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
