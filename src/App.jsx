import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRef } from 'react';

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
  'F*': { percentage: 0.00, gradePoints: 0.00 } // Added F* as a selectable target, jate manush irony korte pare
};

// Initial empty inputs
const INITIAL_INPUTS = {
  ct1: '', ct2: '', ct3: '',
  mid: '', attendance: '', performance: ''
};

// Helper & calculation utilities

const getBestTwoCtSum = (ct1, ct2, ct3) => {
  const scores = [ct1, ct2, ct3].sort((a, b) => b - a);
  return scores[0] + scores[1];
};

// Reusable numeric input
const NumberInput = ({ name, label, value, onChange, min, max, error, helperText }) => (
  <div className="relative w-full">
    <label htmlFor={name} className="block text-sm font-medium text-black mb-1">
      {label}
    </label>
    <input
      type="number"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      placeholder={`${min}-${max}`}
      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 transition-colors
        ${error
          ? 'border-red-500 focus:ring-red-400 dark:focus:ring-red-500'
          : 'border-gray-200 dark:border-gray-600 focus:ring-indigo-400 dark:focus:ring-indigo-500'
        }
      `}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    {helperText && !error && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helperText}</p>}
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
      applyCtMultiplier,
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
      message,
    };
  }, [inputs, errors, courseConfig, targetGrade]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
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
        let min = 0,
          max = 0;
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

  return (
  <div id="__root_app_container" className="min-h-screen text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <main className="max-w-6xl mx-auto p-2 md:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-white">
            MIST Grade Calculator
          </h1>
          <div className="flex items-center gap-3">
            <SimpleSelect
              value={targetGrade}
              onChange={(v) => setTargetGrade(v)}
              options={Object.entries(GRADE_THRESHOLDS).map(([grade, data]) => ({ value: grade, label: `Target: ${grade} (${data.gradePoints.toFixed(2)})` }))}
              ariaLabel="Target Grade"
            />
            <SimpleSelect
              value={selectedCredits}
              onChange={(v) => setSelectedCredits(v)}
              options={[{ value: '', label: 'Select Credit' }, { value: '2', label: '2 Credit' }, { value: '3', label: '3 Credit' }]}
              ariaLabel="Credit"
            />
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle dark mode">
              {isDarkMode ? <div className="i-mdi-weather-sunny text-2xl" /> : <div className="i-mdi-weather-night text-2xl" />}
            </button>
             <button onClick={() => setIsInfoVisible(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Show calculation info">
              <div className="i-mdi-information text-2xl" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:gap-12">
          
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <NumberInput name="ct1" label="Class Test 1" value={inputs.ct1} onChange={handleInputChange} min={0} max={20} error={errors.ct1} />
                <NumberInput name="ct2" label="Class Test 2" value={inputs.ct2} onChange={handleInputChange} min={0} max={20} error={errors.ct2} />
                <div className="sm:col-span-2">
                    <NumberInput name="ct3" label="Class Test 3" value={inputs.ct3} onChange={handleInputChange} min={0} max={20} error={errors.ct3} helperText="We'll take the best two CT scores."/>
                </div>
                <hr className="sm:col-span-2 my-2 border-gray-200 dark:border-gray-600"/>
                <NumberInput name="performance" label="Class Performance" value={inputs.performance} onChange={handleInputChange} min={0} max={courseConfig.performanceMax} error={errors.performance}/>
                <NumberInput name="attendance" label="Attendance" value={inputs.attendance} onChange={handleInputChange} min={0} max={courseConfig.attendanceMax} error={errors.attendance}/>
                <div className="sm:col-span-2">
                    <NumberInput name="mid" label="Mid Term" value={inputs.mid} onChange={handleInputChange} min={0} max={courseConfig.midTermMax} error={errors.mid}/>
                </div>
            </div>
             <button onClick={handleReset} className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800">
              Reset All
            </button>
          </div>
          
      <div className="glass-card p-6 pt-16 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-white mb-4">MIST Grade Calculator</h1>
        <h2 className="text-lg font-medium text-black mb-2">Required Marks for Final</h2>
              
              <div aria-live="polite" className="w-full">
                {!calculationResult.isValid ? (
                    <div className="text-2xl font-bold text-gray-500 dark:text-gray-400 py-10">
                        Please enter valid marks.
                    </div>
                ) : (
                    <>
            <p className={`preserve-color text-6xl font-bold mb-3 transition-colors ${
                            calculationResult.status === 'Achieved' ? 'text-green-500' : 
                            calculationResult.status === 'Not Possible' ? 'text-red-500' : 
                            'text-indigo-600 dark:text-indigo-400'
                        }`}>
                            {calculationResult.required}
                        </p>
                        
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            calculationResult.status === 'Achieved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            calculationResult.status === 'Not Possible' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                        }`}>
                            {calculationResult.status}
                        </span>

            <p className="text-sm text-black mt-4 h-10">
              {calculationResult.message}
            </p>
                    </>
                )}
              </div>
              
        <div className="w-full border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 text-xs text-black flex justify-around">
          <span>Achieved: <strong>{calculationResult.isValid ? calculationResult.achieved : '...'}</strong></span>
          <span>Target: <strong>{courseConfig.target}</strong></span>
          <span>Final Max: <strong>{courseConfig.finalMax}</strong></span>
        </div>
          </div>
        </div>
      </main>

      {isInfoVisible && (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setIsInfoVisible(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Calculation Formula</h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <p>1. <strong>Best CT Total:</strong> The sum of the two highest Class Test scores.</p>
                    <p>2. <strong>CT Contribution:</strong> `Best CT Total` (For GEBS-101) or `Best CT Total × 1.5` (for others).</p>
                    <p>3. <strong>Achieved Marks:</strong> `CT Contribution + Mid Term + Attendance + Class Performance`.</p>
                    <p>4. <strong>Target Marks:</strong> `Total Marks × Grade Percentage` (e.g., for 'A' ({GRADE_THRESHOLDS['A'].gradePoints.toFixed(2)}), it's {GRADE_THRESHOLDS['A'].percentage * 100}% of {courseConfig.totalMarks} marks).</p> {/* CHANGED: Example now includes grade points */}
                    <p>5. <strong>Required for Final:</strong> `Target Marks - Achieved Marks`.</p>

                    <h4 className="font-semibold mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">Grading System:</h4>
                    <ul className="list-disc pl-5">
                        {Object.entries(GRADE_THRESHOLDS).map(([grade, data]) => (
                            <li key={grade}>
                                <strong>{grade}</strong> ({data.gradePoints.toFixed(2)} CGPA): {data.percentage * 100}% and above
                            </li>
                        ))}
                    </ul>
                </div>
                 <button onClick={() => setIsInfoVisible(false)} className="mt-6 w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                    Got it
                </button>
            </div>
         </div>
      )}
    </div>
  );
}

function SimpleSelect({ value, onChange, options, ariaLabel }){
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if(value === '' ) setHighlight(0);
    else {
      const idx = options.findIndex(o => o.value === value);
      if(idx >= 0) setHighlight(idx);
    }
  }, [value, options]);

  useEffect(() => {
    function onDoc(e){ if(open && !ref.current?.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const toggle = () => setOpen(s => !s);

  const handleKey = (e) => {
    if(e.key === 'ArrowDown'){ e.preventDefault(); setOpen(true); setHighlight(h => Math.min(h+1, options.length-1)); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); setHighlight(h => Math.max(h-1, 0)); }
    else if(e.key === 'Enter'){ e.preventDefault(); const sel = options[highlight]; if(sel) { onChange(sel.value); setOpen(false);} }
    else if(e.key === 'Escape'){ setOpen(false); }
  }

  return (
    <div className="custom-select" ref={ref}>
      <button aria-label={ariaLabel} onClick={toggle} onKeyDown={handleKey} className="glass-input custom-select-trigger">
        <span>{(options.find(o => o.value === value) || options[0]).label}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7l4 4 4-4" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <div role="listbox" className="custom-select-list" tabIndex={-1}>
          {options.map((opt, i) => (
            <div key={opt.value+i} role="option" aria-selected={opt.value === value} className="custom-select-item" onClick={() => { onChange(opt.value); setOpen(false); }} onMouseEnter={() => setHighlight(i)}>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

