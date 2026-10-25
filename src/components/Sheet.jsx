import React from 'react';
import Select from './Select.jsx';
import CreditToggle from './CreditToggle.jsx';
import NumberInput from './NumberInput.jsx';
import { GRADE_ORDER, GRADE_THRESHOLDS, SCORE_ROWS } from './gradeData.js';

/**
 * The sheet: the target grade, the course, the six marks rows, the verdict
 * and the four figures the semester is made of.
 */
export default function Sheet({
  targetGrade,
  onTargetGrade,
  credits,
  onCredits,
  inputs,
  errors,
  onInputChange,
  courseConfig,
  result,
  onReset
}) {
  const statusClass =
    result.status === 'Not Possible'
      ? 'verdict__status--short'
      : result.status === 'Achieved'
        ? 'verdict__status--done'
        : '';

  const figureClass =
    result.status === 'Achieved'
      ? 'verdict__figure--done'
      : result.status === 'Not Possible'
        ? 'verdict__figure--short'
        : '';

  return (
    <form className="sheet" onSubmit={(e) => e.preventDefault()}>
      <div className="sheet__head">
        <div className="sheet__head-left">
          <span className="sheet__title">Semester sheet</span>
          <CreditToggle value={credits} onChange={onCredits} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="grade-select">
            Target grade
          </label>
          <Select
            id="grade-select"
            value={targetGrade}
            onChange={onTargetGrade}
            options={GRADE_ORDER.map((grade) => ({
              value: grade,
              label: `${grade} · ${GRADE_THRESHOLDS[grade].gradePoints.toFixed(2)}`
            }))}
            ariaLabel="Target grade"
          />
        </div>
      </div>

      <div className="verdict" aria-live="polite">
        <div className="verdict__body">
          <span className="verdict__label">The Final</span>
          {result.isValid ? (
            <>
              <span className={`verdict__status ${statusClass}`}>{result.status}</span>
              <p className="verdict__message">{result.message}</p>
            </>
          ) : (
            <p className="verdict__message">
              Enter valid marks to see what the Final must be.
            </p>
          )}
        </div>
        <span
          className={`verdict__figure ${figureClass}${result.isValid ? '' : ' verdict__figure--empty'}`}
        >
          {result.isValid ? result.required : ''}
        </span>
      </div>

      <div className="sheet__rows">
        {SCORE_ROWS.map((row) => (
          <NumberInput
            key={row.name}
            name={row.name}
            label={row.label}
            value={inputs[row.name]}
            onChange={onInputChange}
            max={rowMax(row.name, courseConfig)}
            error={errors[row.name]}
          />
        ))}
      </div>

      <div className="eq" aria-label="The semester in figures">
        <div className="eq__cell">
          <span className="eq__num mono">{courseConfig.target}</span>
          <span className="eq__label">Target marks</span>
        </div>
        <div className="eq__cell eq__cell--volt">
          <span className="eq__num mono">{result.isValid ? result.achieved : '—'}</span>
          <span className="eq__label">Achieved so far</span>
        </div>
        <div className="eq__cell">
          <span className="eq__num mono">{courseConfig.totalMarks}</span>
          <span className="eq__label">Semester total</span>
        </div>
        <div className="eq__cell">
          <span className="eq__num mono">{courseConfig.finalMax}</span>
          <span className="eq__label">Final maximum</span>
        </div>
      </div>

      <div className="sheet__reset">
        <button className="btn btn--quiet" type="button" onClick={onReset}>
          Reset all
        </button>
      </div>
    </form>
  );
}

function rowMax(name, courseConfig) {
  if (name.startsWith('ct')) return 20;
  if (name === 'mid') return courseConfig.midTermMax;
  if (name === 'attendance') return courseConfig.attendanceMax;
  if (name === 'performance') return courseConfig.performanceMax;
  return 20;
}
