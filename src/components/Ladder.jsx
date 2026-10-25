import React from 'react';
import { GRADE_ORDER, GRADE_THRESHOLDS, gradePercent } from './gradeData.js';

/**
 * The ladder: every grade, the share of the semester total it takes, and the
 * CGPA point it carries. Each rung is a button — pick one to aim at it.
 */
export default function Ladder({ targetGrade, onPick }) {
  return (
    <div className="lad">
      <div className="lad__rungs">
        {GRADE_ORDER.map((grade) => {
          const isTarget = grade === targetGrade;
          return (
            <button
              key={grade}
              type="button"
              className={`lad__rung${isTarget ? ' is-on' : ''}`}
              onClick={() => onPick(grade)}
              aria-pressed={isTarget}
            >
              <span className="lad__grade">{grade}</span>
              <span className="lad__pct mono">
                {gradePercent(grade)}%
              </span>
              <span className="lad__points mono">
                {GRADE_THRESHOLDS[grade].gradePoints.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
