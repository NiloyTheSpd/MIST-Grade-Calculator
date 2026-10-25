import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';

// Constants

// Grade thresholds (percentage of total + grade points)
const GRADE_THRESHOLDS = {
  'A+': { percentage: 0.80, gradePoints: 4.00 },
  'A': { percentage: 0.75, gradePoints: 3.75 },
  'A-': { percentage: 0.70, gradePoints: 3.50 },
  'B+': { percentage: 0.65, gradePoints: 3.25 },
  'B': { percentage: 0.60, gradePoints: 3.00 },
  'B-': { percentage: 0.55, gradePoints: 2.75 },
  'C+': { percentage: 0.50, gradePoints: 2.50 },
  'C': { percentage: 0.45, gradePoints: 2.25 },
  'D': { percentage: 0.40, gradePoints: 2.00 },
  'F*': { percentage: 0.00, gradePoints: 0.00 }
};

const GRADE_ORDER = Object.keys(GRADE_THRESHOLDS);

// Initial empty inputs
const INITIAL_INPUTS = {
  ct1: '', ct2: '', ct3: '',
  mid: '', attendance: '', performance: ''
};

// The ledger rows of the sheet, in the order the semester is marked.
const SCORE_ROWS = [
  { name: 'ct1', label: 'Class Test 1', max: 20 },
  { name: 'ct2', label: 'Class Test 2', max: 20 },
  { name: 'ct3', label: 'Class Test 3', max: 20, note: 'Best two count' },
  { name: 'performance', label: 'Performance', max: null },
  { name: 'attendance', label: 'Attendance', max: null },
  { name: 'mid', label: 'Mid Term', max: null }
];

// Helper & calculation utilities

const getBestTwoCtSum = (ct1, ct2, ct3) => {
  const scores = [ct1, ct2, ct3].sort((a, b) => b - a);
  return scores[0] + scores[1];
};

// Reusable numeric input
const NumberInput = ({ name, label, value, onChange, max, error, note }) => (
  <div className="row">
    <label className="row__label" htmlFor={name}>
      {label}
      {note ? <small>{note}</small> : null}
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
      placeholder={`0-${max}`}
      className="row__input"
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error ? (
      <p className="row__error" id={`${name}-error`}>{error}</p>
    ) : null}
  </div>
);

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // UI state: selected credit ('' | '2' | '3')
  const [selectedCredits, setSelectedCredits] = useState('');
  const [targetGrade, setTargetGrade] = useState('A+');
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [errors, setErrors] = useState({});
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  // Derive a lightweight course object from the selected credit so the rest of the
  // calculations can use the same shape (id, credits). Default to 3 credits.
  const selectedCourse = useMemo(() => {
    const credits = Number(selectedCredits) || 3;
    return { id: credits === 2 ? 'GEBS-101' : 'GEN-3', credits };
  }, [selectedCredits]);

  // Compute per-course configuration (max marks, target in marks, CT rules)
  const courseConfig = useMemo(() => {
    const credits = selectedCourse.credits;
    const isThreeCredit = credits === 3;
    const isGebs101 = selectedCourse.id === 'GEBS-101';

    const totalMarks = isThreeCredit ? 300 : 200;
    const target = totalMarks * GRADE_THRESHOLDS[targetGrade].percentage;

    let midTermMax = isThreeCredit ? 30 : 20;
    let attendanceMax = 15;
    let performanceMax = 15;
    let finalMax;
    let applyCtMultiplier = true;

    if (isGebs101) {
      attendanceMax = 10;
      performanceMax = 10;
      applyCtMultiplier = false;
      finalMax = 200 - (40 + 20 + 10 + 10); // 120
    } else {
      finalMax = isThreeCredit
        ? 300 - (60 + 30 + 15 + 15)
        : 200 - (60 + 20 + 15 + 15);
    }

    return {
      credits,
      totalMarks,
      target,
      finalMax,
      midTermMax,
      attendanceMax,
      performanceMax,
      applyCtMultiplier
    };
  }, [selectedCourse, targetGrade]);

  const calculationResult = useMemo(() => {
    // Validate inputs and compute required final marks
    let hasErrors = Object.values(errors).some(Boolean);

    const parsedInputs = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, value === '' ? 0 : parseFloat(value)])
    );

    const { ct1, ct2, ct3, mid, attendance, performance } = parsedInputs;

    if (Object.values(parsedInputs).some(isNaN)) hasErrors = true;
    if (hasErrors) return { isValid: false };

    const bestTwoSum = getBestTwoCtSum(ct1, ct2, ct3);
    const ctContribution = courseConfig.applyCtMultiplier ? bestTwoSum * 1.5 : bestTwoSum;
    const achieved = ctContribution + mid + attendance + performance;
    const required = courseConfig.target - achieved;

    let status = `Aiming for ${targetGrade}`;
    let message = `You need ${Math.ceil(Math.max(0, required))} marks in the Final.`;

    if (required <= 0) {
      status = 'Achieved';
      message = `You've already secured the target for a(n) "${targetGrade}" grade.`;
    } else if (required > courseConfig.finalMax) {
      status = 'Not Possible';
      const shortfall = Math.ceil(required - courseConfig.finalMax);
      message = `Cannot achieve "${targetGrade}". You'd be short by ${shortfall} marks.`;
    }

    return {
      isValid: true,
      required: Math.ceil(Math.max(0, required)),
      achieved: achieved.toFixed(2),
      status,
      message
    };
  }, [inputs, errors, courseConfig, targetGrade]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Mark the document as scripted, so the one reveal can hide itself when JS is off.
  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  // Reset inputs when selected credit changes
  useEffect(() => {
    setInputs(INITIAL_INPUTS);
    setErrors({});
  }, [selectedCredits]);

  // Input change handler with validation
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setInputs((prev) => ({ ...prev, [name]: value }));

      let errorMsg = '';
      const numValue = parseFloat(value);

      if (value !== '' && isNaN(numValue)) errorMsg = 'Must be a number.';
      else if (!isNaN(numValue)) {
        let min = 0;
        let max = 0;
        if (name.startsWith('ct')) max = 20;
        else if (name === 'mid') max = courseConfig.midTermMax;
        else if (name === 'attendance') max = courseConfig.attendanceMax;
        else if (name === 'performance') max = courseConfig.performanceMax;

        if (numValue < min || numValue > max) errorMsg = `Must be between ${min} and ${max}.`;
      }

      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    },
    [courseConfig]
  );

  const handleReset = () => {
    setInputs(INITIAL_INPUTS);
    setErrors({});
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const rowMax = (name) => {
    if (name.startsWith('ct')) return 20;
    if (name === 'mid') return courseConfig.midTermMax;
    if (name === 'attendance') return courseConfig.attendanceMax;
    if (name === 'performance') return courseConfig.performanceMax;
    return 20;
  };

  const verdictClass = () => {
    if (!calculationResult.isValid) return '';
    if (calculationResult.status === 'Achieved') return 'verdict__figure--done';
    if (calculationResult.status === 'Not Possible') return 'verdict__figure--short';
    return '';
  };

  const statusClass = () => {
    if (calculationResult.status === 'Not Possible') return 'verdict__status--short';
    if (calculationResult.status === 'Achieved') return 'verdict__status--done';
    return '';
  };

  return (
    <div id="__root_app_container">
      <nav className="nav" aria-label="Primary">
        <div className="container nav__inner">
          <a className="nav__mark" href="#top" aria-label="MIST Grade Calculator, home">MIST Grade Calculator</a>
          <div className="nav__links">
            <a className="nav__link" href="#sheet">The sheet</a>
            <a className="nav__link" href="#weighting">Weighting</a>
            <a className="nav__link" href="#ladder">Grades</a>
            <button className="nav__link" type="button" onClick={() => setIsInfoVisible(true)}>Formula</button>
          </div>
        </div>
      </nav>

      <main id="top">
        <header className="hero">
          <div className="container hero__grid">
            <div className="hero__body">
              <h1 className="hero__title reveal" style={{ '--i': 0 }}>Your final, worked out</h1>
              <p className="hero__lead reveal" style={{ '--i': 1 }}>
                Enter your marks. The sheet says what the Final must be.
              </p>
              <div className="hero__actions reveal" style={{ '--i': 2 }}>
                <a className="btn btn--volt" href="#sheet">Fill the sheet</a>
                <button className="btn btn--quiet" type="button" onClick={() => setIsInfoVisible(true)}>Read the formula</button>
              </div>
            </div>

            <div className="hero__visual reveal" style={{ '--i': 2 }} id="sheet">
              <form className="sheet" onSubmit={(e) => e.preventDefault()}>
                <div className="sheet__head">
                  <span className="sheet__title">Semester sheet</span>
                  <div className="sheet__controls">
                    <div className="field">
                      <label className="field__label" htmlFor="grade-select">Target grade</label>
                      <SimpleSelect
                        id="grade-select"
                        value={targetGrade}
                        onChange={(v) => setTargetGrade(v)}
                        options={GRADE_ORDER.map((grade) => ({
                          value: grade,
                          label: `${grade} (${GRADE_THRESHOLDS[grade].gradePoints.toFixed(2)})`
                        }))}
                        ariaLabel="Target Grade"
                      />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="credit-select">Credit</label>
                      <SimpleSelect
                        id="credit-select"
                        value={selectedCredits}
                        onChange={(v) => setSelectedCredits(v)}
                        options={[
                          { value: '', label: 'Select Credit' },
                          { value: '2', label: '2 Credit' },
                          { value: '3', label: '3 Credit' }
                        ]}
                        ariaLabel="Credit"
                      />
                    </div>
                  </div>
                </div>

                <div className="verdict" aria-live="polite">
                  <div>
                    <span className="verdict__label">Final</span>
                    {calculationResult.isValid ? (
                      <>
                        <span className={`verdict__status ${statusClass()}`}>{calculationResult.status}</span>
                        <p className="verdict__message">{calculationResult.message}</p>
                      </>
                    ) : (
                      <p className="verdict__message">Enter valid marks to see what the Final must be.</p>
                    )}
                  </div>
                  <span className={`verdict__figure ${verdictClass()}`}>
                    {calculationResult.isValid ? calculationResult.required : '—'}
                  </span>
                </div>

                <div className="sheet__rows">
                  {SCORE_ROWS.map((row) => (
                    <NumberInput
                      key={row.name}
                      name={row.name}
                      label={row.label}
                      note={row.note}
                      value={inputs[row.name]}
                      onChange={handleInputChange}
                      max={rowMax(row.name)}
                      error={errors[row.name]}
                    />
                  ))}
                </div>

                <div className="figures" aria-label="The semester in figures">
                  <div className="figures__cell">
                    <span className="figures__num">{courseConfig.target}</span>
                    <span className="figures__label">Target marks</span>
                  </div>
                  <div className="figures__cell figures__cell--volt">
                    <span className="figures__num">{calculationResult.isValid ? calculationResult.achieved : '—'}</span>
                    <span className="figures__label">Achieved so far</span>
                  </div>
                  <div className="figures__cell">
                    <span className="figures__num">{courseConfig.totalMarks}</span>
                    <span className="figures__label">Semester total</span>
                  </div>
                  <div className="figures__cell">
                    <span className="figures__num">{courseConfig.finalMax}</span>
                    <span className="figures__label">Final maximum</span>
                  </div>
                </div>

                <div className="sheet__reset">
                  <button className="btn btn--quiet" type="button" onClick={handleReset}>Reset all</button>
                </div>
              </form>
            </div>
          </div>
        </header>

        <section className="section section--sheet-end" id="components">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">Six marks on the sheet</h2>
              <p className="section__lead">
                The Final is what is left.
              </p>
            </div>
            <table className="table table--sheet">
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Maximum</th>
                  <th scope="col">Counted</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="table__name">Class tests</td>
                  <td className="table__num">3 × 20</td>
                  <td>Best two count</td>
                </tr>
                <tr>
                  <td className="table__name">Mid term</td>
                  <td className="table__num">30</td>
                  <td>One sitting, marked whole</td>
                </tr>
                <tr>
                  <td className="table__name">Attendance</td>
                  <td className="table__num">15</td>
                  <td>Counted as earned</td>
                </tr>
                <tr>
                  <td className="table__name">Performance</td>
                  <td className="table__num">15</td>
                  <td>Counted as earned</td>
                </tr>
                <tr className="is-current">
                  <td className="table__name">Final</td>
                  <td className="table__num">180</td>
                  <td>What the sheet works out</td>
                </tr>
              </tbody>
            </table>
            <p className="table__foot">
              The Final carries 180 of 300 marks. Everything before it is earned;
              the rest is the one exam left.
            </p>
          </div>
        </section>

        <section className="section section--tight" id="weighting">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">Two credits, or three</h2>
              <p className="section__lead">
                The course you pick sets the weightings.
              </p>
            </div>
            <div className="weighting">
              <div className="weighting__col">
                <h3 className="weighting__title">3 Credit</h3>
                <p className="weighting__note">The general course.</p>
                <div className="weighting__line"><span>Semester total</span><span>300</span></div>
                <div className="weighting__line"><span>CT weight</span><span>× 1.5</span></div>
                <div className="weighting__line"><span>Mid term</span><span>30</span></div>
                <div className="weighting__line"><span>Attendance</span><span>15</span></div>
                <div className="weighting__line"><span>Performance</span><span>15</span></div>
                <div className="weighting__line"><span>Final maximum</span><span>180</span></div>
              </div>
              <div className="weighting__col">
                <h3 className="weighting__title">2 Credit</h3>
                <p className="weighting__note">GEBS-101: CT sum not weighted.</p>
                <div className="weighting__line"><span>Semester total</span><span>200</span></div>
                <div className="weighting__line"><span>CT weight</span><span>× 1</span></div>
                <div className="weighting__line"><span>Mid term</span><span>20</span></div>
                <div className="weighting__line"><span>Attendance</span><span>10</span></div>
                <div className="weighting__line"><span>Performance</span><span>10</span></div>
                <div className="weighting__line"><span>Final maximum</span><span>120</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--ink section--ink-end" id="ladder">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">What each grade takes</h2>
              <p className="section__lead">
                The share of the semester total, then the CGPA point.
              </p>
            </div>
            <div className="ladder__legend">
              <span>Percentage of the semester total, then the CGPA point. F* is the floor: 0%, and no grade below it.</span>
            </div>
            <div className="ladder">
              {GRADE_ORDER.map((grade) => (
                <div className={`ladder__cell${grade === 'A+' ? ' ladder__cell--top' : ''}`} key={grade}>
                  <span className="ladder__grade">{grade}</span>
                  <span className="ladder__pct">{Math.round(GRADE_THRESHOLDS[grade].percentage * 100)}%</span>
                  <span className="ladder__points">{GRADE_THRESHOLDS[grade].gradePoints.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="campus" id="campus">
          <figure className="band">
            <div className="band__photo" data-slot="campus-day">
              <img src="/campus-bg.jpg" alt="The MIST campus buildings seen across the trees at sunset" width="1080" height="675" loading="lazy" />
            </div>
            <figcaption className="band__caption">The campus, at the hour the semester ends.</figcaption>
          </figure>
          <div className="container campus__grid">
            <div className="campus__photo" data-slot="campus-night">
              <img src="/campus-bg-nt.jpg" alt="Tower 4 at night, the lit sky between the two blocks and the sky-bridge above the tree." width="960" height="1280" loading="lazy" />
            </div>
            <div className="campus__inner">
              <h2 className="campus__title">MIST at the hour the semester ends</h2>
              <p className="campus__note">
                Tower 4, after the light goes. The sheet above is the part you can still change.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="about">
        <div className="container footer__inner">
          <span className="footer__mark">MIST Grade Calculator</span>
          <div className="footer__colophon">
            <p>
              Best two class tests count, weighted by 1.5 outside GEBS-101.
            </p>
            <p>
              Built by NiloyTheSpd. The MIT Licence covers it.
            </p>
            <div className="footer__links">
              <a className="footer__link" href="#top">Top</a>
              <a className="footer__link" href="#sheet">The sheet</a>
              <button className="footer__link" type="button" onClick={() => setIsInfoVisible(true)}>Formula</button>
              <a className="footer__link" href="https://github.com/NiloyTheSpd" rel="noreferrer noopener">Source</a>
            </div>
          </div>
        </div>
      </footer>

      {isInfoVisible && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="formula-title"
          onClick={() => setIsInfoVisible(false)}
        >
          <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title" id="formula-title">Calculation formula</h2>
            <div className="modal__body">
              <ol>
                <li><strong>Best CT total.</strong> The sum of your two highest class test scores.</li>
                <li><strong>CT contribution.</strong> The best CT total, weighted by 1.5 outside GEBS-101.</li>
                <li><strong>Achieved marks.</strong> CT contribution plus mid term, attendance and class performance.</li>
                <li>
                  <strong>Target marks.</strong> The semester total times the grade percentage, so an A at
                  {' '}{GRADE_THRESHOLDS['A'].percentage * 100}% of {courseConfig.totalMarks} marks.
                </li>
                <li><strong>Required for the Final.</strong> Target marks minus achieved marks, rounded up.</li>
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
                      <td className="table__num">{GRADE_THRESHOLDS[grade].percentage * 100}%</td>
                      <td className="table__num">{GRADE_THRESHOLDS[grade].gradePoints.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn btn--volt modal__close" type="button" onClick={() => setIsInfoVisible(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleSelect({ id, value, onChange, options, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (value === '') setHighlight(0);
    else {
      const idx = options.findIndex(o => o.value === value);
      if (idx >= 0) setHighlight(idx);
    }
  }, [value, options]);

  useEffect(() => {
    function onDoc(e) { if (open && !ref.current?.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const toggle = () => setOpen(s => !s);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHighlight(h => Math.min(h + 1, options.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); setHighlight(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // a closed list opens on Enter or Space; an open one commits the highlight
      if (!open) { setOpen(true); return; }
      const sel = options[highlight];
      if (sel) { onChange(sel.value); setOpen(false); }
    }
    else if (e.key === 'Escape') { setOpen(false); }
  };

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
        <span>{(options.find(o => o.value === value) || options[0]).label}</span>
        <svg className="select__chevron" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M6 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div role="listbox" aria-label={ariaLabel} tabIndex={-1} className="select__list">
          {options.map((opt, i) => (
            <button
              key={opt.value + i}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              className="select__option"
              onClick={() => { onChange(opt.value); setOpen(false); }}
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
