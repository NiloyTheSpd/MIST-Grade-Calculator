import React, { useEffect, useRef } from 'react';
import { GRADE_ORDER, GRADE_THRESHOLDS, gradePercent } from './gradeData.js';

/**
 * The formula, in a dialog: how the Final is worked out, and the whole grade
 * table. Escape closes it, the focus lands inside and returns where it was.
 */
export default function FormulaModal({ onClose, totalMarks }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const returnTo = useRef(null);

  useEffect(() => {
    returnTo.current = document.activeElement;
    closeRef.current?.focus();

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      returnTo.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="formula-title"
      onClick={onClose}
    >
      <div className="modal__panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 className="modal__title" id="formula-title">
            How the Final is worked out
          </h2>
          <button
            ref={closeRef}
            className="modal__x"
            type="button"
            onClick={onClose}
            aria-label="Close the formula"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="modal__body">
          <ol className="modal__steps">
            <li>
              <strong>Best class test total.</strong> The sum of your two highest class test
              scores.
            </li>
            <li>
              <strong>Class test contribution.</strong> The best class test total, weighted by
              1.5 outside GEBS-101.
            </li>
            <li>
              <strong>Achieved marks.</strong> The class test contribution plus mid term,
              attendance and class performance.
            </li>
            <li>
              <strong>Target marks.</strong> The semester total times the grade percentage, so
              an A at {gradePercent('A')}% of {totalMarks} marks.
            </li>
            <li>
              <strong>Required for the Final.</strong> Target marks minus achieved marks, rounded
              up.
            </li>
          </ol>
          <table className="modal__grades">
            <thead>
              <tr>
                <th scope="col">Grade</th>
                <th scope="col">From</th>
                <th scope="col">CGPA</th>
              </tr>
            </thead>
            <tbody>
              {GRADE_ORDER.map((grade) => (
                <tr key={grade}>
                  <td>{grade}</td>
                  <td className="num mono">{gradePercent(grade)}%</td>
                  <td className="num mono">{GRADE_THRESHOLDS[grade].gradePoints.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
