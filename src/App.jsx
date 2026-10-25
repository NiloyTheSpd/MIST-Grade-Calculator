import React, { useState, useMemo, useEffect, useCallback } from 'react';

import Sheet from './components/Sheet.jsx';
import Story from './components/Story.jsx';
import Weighting from './components/Weighting.jsx';
import Ladder from './components/Ladder.jsx';
import FormulaModal from './components/FormulaModal.jsx';
import { CampusDay, CampusNight, Skyline } from './components/MistImages.jsx';
import {
  COURSES,
  GRADE_ORDER,
  GRADE_THRESHOLDS,
  INITIAL_INPUTS,
  getBestTwoCtSum
} from './components/gradeData.js';

export default function App() {
  const [targetGrade, setTargetGrade] = useState('A+');
  const [credits, setCredits] = useState('3');
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [errors, setErrors] = useState({});
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [scrolled, setScrolled] = useState(0);

  // The course the sheet is marked against.
  const course = useMemo(() => COURSES[credits] || COURSES[3], [credits]);

  // Everything the calculation needs, derived from the course and the grade.
  const courseConfig = useMemo(() => {
    const target = course.totalMarks * GRADE_THRESHOLDS[targetGrade].percentage;
    return {
      credits: course.credits,
      totalMarks: course.totalMarks,
      target,
      finalMax: course.finalMax,
      midTermMax: course.midTermMax,
      attendanceMax: course.attendanceMax,
      performanceMax: course.performanceMax,
      applyCtMultiplier: course.ctWeight !== 1
    };
  }, [course, targetGrade]);

  const calculationResult = useMemo(() => {
    let hasErrors = Object.values(errors).some(Boolean);

    const parsedInputs = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, value === '' ? 0 : parseFloat(value)])
    );

    const { ct1, ct2, ct3, mid, attendance, performance } = parsedInputs;

    if (Object.values(parsedInputs).some(isNaN)) hasErrors = true;
    if (hasErrors) return { isValid: false };

    // Nothing entered yet: there is no answer to give, and a number would lie.
    const entered = Object.values(inputs).some((v) => v !== '');
    if (!entered) {
      return {
        isValid: false,
        status: 'Awaiting marks',
        message: 'Enter your marks and the sheet will work out what the Final must be.'
      };
    }

    const bestTwoSum = getBestTwoCtSum(ct1, ct2, ct3);
    const ctContribution = courseConfig.applyCtMultiplier
      ? bestTwoSum * (course.ctWeight || 1.5)
      : bestTwoSum;
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
  }, [inputs, errors, courseConfig, course, targetGrade]);

  // The scroll progress, read once per frame and written to a custom property.
  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrolled(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mark the document as scripted, so the one reveal can hide itself when JS is off.
  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  // Reset inputs when the selected credit changes.
  useEffect(() => {
    setInputs(INITIAL_INPUTS);
    setErrors({});
  }, [credits]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setInputs((prev) => ({ ...prev, [name]: value }));

      let errorMsg = '';
      const numValue = parseFloat(value);

      if (value !== '' && isNaN(numValue)) errorMsg = 'Must be a number.';
      else if (!isNaN(numValue)) {
        const min = 0;
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

  const heroValue = calculationResult.isValid ? calculationResult.required : '';
  const heroStatus = calculationResult.isValid ? calculationResult.status : 'Awaiting marks';

  const chapters = [
    {
      id: 'c1',
      no: '01',
      short: 'The sheet',
      title: 'Six marks on the sheet',
      body: 'Class tests, mid term, attendance and performance. Six rows, already earned.',
      detail: 'The best two class tests count.'
    },
    {
      id: 'c2',
      no: '02',
      short: 'What you have',
      title: "What you've already earned",
      body: 'Everything before the Final is settled. The sheet totals it up.',
      detail: null
    },
    {
      id: 'c3',
      no: '03',
      short: 'The final',
      title: 'What the final must be',
      body: 'One number. The marks the Final has to carry for the target grade.',
      detail: null
    },
    {
      id: 'c4',
      no: '04',
      short: 'Each grade',
      title: 'What each grade takes',
      body: 'Every rung is a share of the total and a point on the CGPA.',
      detail: null
    }
  ];

  return (
    <div id="__root_app_container">
      <a className="skip" href="#story">
        Skip to the sheet
      </a>

      <header className="hdr">
        <a className="brand" href="#top">
          MIST Grade Calculator
        </a>
        <span className="chip mono">Final exam season</span>
        <span className="hdr__prog" style={{ transform: `scaleX(${scrolled})` }} aria-hidden="true" />
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero__grid">
            <div className="hero__body">
              <h1 className="hero__title">
                Your final,
                <br />
                worked out.
              </h1>
              <p className="hero__lead">
                Enter what you have. The sheet says what the Final must be.
              </p>
              <div className="hero__actions">
                <a className="btn btn--volt" href="#sheet">
                  Fill the sheet
                </a>
                <button className="btn btn--quiet" type="button" onClick={() => setIsInfoVisible(true)}>
                  Read the formula
                </button>
              </div>
            </div>

            <div className="hero__panel">
              <div className="hero__figure">
                <span
                  className={`hero__figure-num big mono${
                    calculationResult.isValid ? '' : ' hero__figure-num--empty'
                  }`}
                >
                  {heroValue}
                </span>
                <span className="hero__figure-note">
                  marks needed in the Final. {heroStatus} for {targetGrade}.
                </span>
              </div>
              <CampusNight className="hero__photo" />
            </div>
          </div>
        </section>

        <section className="section section--sheet" id="sheet">
          <div className="wrap sheet__wrap">
            <div className="section__head">
              <h2 className="section__title">The semester sheet</h2>
              <p className="section__lead">
                Six rows of marks. The sheet works out the rest.
              </p>
            </div>
            <Sheet
              targetGrade={targetGrade}
              onTargetGrade={setTargetGrade}
              credits={credits}
              onCredits={setCredits}
              inputs={inputs}
              errors={errors}
              onInputChange={handleInputChange}
              courseConfig={courseConfig}
              result={calculationResult}
              onReset={handleReset}
            />
          </div>
        </section>

        <Story
          towerValue={heroValue}
          towerLabel={`The Final, for ${targetGrade}`}
          chapters={chapters}
        >
          <Skyline />
        </Story>

        <section className="section section--weight" id="weighting">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">Two credits, or three</h2>
              <p className="section__lead">The course you pick sets the weightings.</p>
            </div>
            <Weighting />
          </div>
        </section>

        <section className="section section--ladder" id="ladder">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">What each grade takes</h2>
              <p className="section__lead">
                Pick a rung to aim at it. The share of the total, then the CGPA point.
              </p>
            </div>
            <Ladder targetGrade={targetGrade} onPick={setTargetGrade} />
          </div>
        </section>

        <section className="campus" id="campus">
          <div className="wrap campus__grid">
            <CampusDay className="campus__day" />
            <div className="campus__inner">
              <h2 className="campus__title">The campus the semester ran in</h2>
              <p className="campus__note">
                The blocks and the trees, in the light of an ordinary day. The sheet above is the
                part you can still change.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="about">
        <div className="wrap footer__inner">
          <span className="footer__mark">MIST Grade Calculator</span>
          <p className="footer__note">
            Built by NiloyTheSpd. The MIT Licence covers it.
          </p>
          <div className="footer__links">
            <a className="footer__link" href="#top">
              Top
            </a>
            <a className="footer__link" href="#sheet">
              The sheet
            </a>
            <a className="footer__link" href="#ladder">
              Grades
            </a>
            <button className="footer__link" type="button" onClick={() => setIsInfoVisible(true)}>
              Formula
            </button>
            <a className="footer__link" href="https://github.com/NiloyTheSpd" rel="noreferrer noopener">
              Source
            </a>
          </div>
        </div>
      </footer>

      {isInfoVisible && (
        <FormulaModal
          onClose={() => setIsInfoVisible(false)}
          totalMarks={courseConfig.totalMarks}
        />
      )}
    </div>
  );
}
