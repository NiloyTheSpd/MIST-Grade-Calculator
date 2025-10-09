import React, { useState, useMemo, useEffect, useCallback } from 'react';

// --- CONSTANTS & COURSE DATA ---
const COURSES = [
  { id: 'CSE-101', name: 'CSE-101', credits: 3 },
  { id: 'MATH-101', name: 'MATH-101', credits: 3 },
  { id: 'PHY-101', name: 'PHY-101', credits: 3 },
  { id: 'CHEM-101', name: 'CHEM-101', credits: 3 },
  { id: 'EECE-163', name: 'EECE-163', credits: 3 },
  { id: 'GEBS-101', name: 'GEBS-101', credits: 2 },
];

const INITIAL_INPUTS = {
  ct1: '', ct2: '', ct3: '',
  mid: '', attendance: '', performance: ''
};

// --- HELPER & CALCULATION FUNCTIONS ---

/**
 * Gets the two highest scores from a list of three.
 * @param {number} ct1 - Score for CT-1.
 * @param {number} ct2 - Score for CT-2.
 * @param {number} ct3 - Score for CT-3.
 * @returns {number} The sum of the two highest scores.
 */
const getBestTwoCtSum = (ct1, ct2, ct3) => {
  const scores = [ct1, ct2, ct3].sort((a, b) => b - a);
  return scores[0] + scores[1];
};

/**
 * A reusable number input component with validation.
 * @param {object} props - Component props.
 * @returns {JSX.Element}
 */
const NumberInput = ({ name, label, value, onChange, min, max, error, helperText }) => (
  <div className="relative w-full">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

/**
 * The main application component.
 * @returns {JSX.Element}
 */
export default function App() {
  // --- STATE MANAGEMENT ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [selectedCourseId, setSelectedCourseId] = useState(COURSES[0].id);
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [errors, setErrors] = useState({});
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  // --- DERIVED STATE & CALCULATIONS ---
  const selectedCourse = useMemo(() => COURSES.find(c => c.id === selectedCourseId), [selectedCourseId]);
  
  const courseConfig = useMemo(() => {
    const credits = selectedCourse.credits;
    const isThreeCredit = credits === 3;
    const target = isThreeCredit ? 240 : 160;
    // Max marks for final = Total Marks - (CTs + Mid + Attendance + Performance)
    // CTs: Best 2 of 3 (20+20) * 1.5 = 60
    // Mid: 30 (3-credit) or 20 (2-credit)
    // Att & Perf: 15 each
    const finalMax = isThreeCredit 
      ? 300 - (60 + 30 + 15 + 15) // 180
      : 200 - (60 + 20 + 15 + 15); // 90
      
    return {
      credits,
      target,
      finalMax,
      midTermMax: isThreeCredit ? 30 : 20,
    };
  }, [selectedCourse]);

  const calculationResult = useMemo(() => {
    let hasErrors = Object.values(errors).some(e => e);
    
    // Convert empty strings to 0 for calculation
    const parsedInputs = Object.fromEntries(
        Object.entries(inputs).map(([key, value]) => [key, value === '' ? 0 : parseFloat(value)])
    );

    const { ct1, ct2, ct3, mid, attendance, performance } = parsedInputs;

    // Further check if any value is NaN (which would mean invalid non-numeric input)
    if (Object.values(parsedInputs).some(isNaN)) {
        hasErrors = true;
    }
    
    if (hasErrors) {
      return { isValid: false };
    }

    const bestTwoSum = getBestTwoCtSum(ct1, ct2, ct3);
    const ctContribution = bestTwoSum * 1.5;
    const achieved = ctContribution + mid + attendance + performance;
    const required = courseConfig.target - achieved;

    let status = 'Needs Final';
    let message = `You need ${Math.ceil(Math.max(0, required))} marks in the Final.`;

    if (required <= 0) {
      status = 'Achieved';
      message = 'You’ve already reached the CG-4 target.';
    } else if (required > courseConfig.finalMax) {
      status = 'Not Possible';
      const shortfall = Math.ceil(required - courseConfig.finalMax);
      message = `Not possible to reach CG-4. You would be short by ${shortfall} marks even with a perfect final.`;
    }

    return {
      isValid: true,
      required: Math.ceil(Math.max(0, required)),
      achieved: achieved.toFixed(2),
      status,
      message,
    };
  }, [inputs, errors, courseConfig]);

  // --- EFFECTS ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Reset inputs when course changes
  useEffect(() => {
    setInputs(INITIAL_INPUTS);
    setErrors({});
  }, [selectedCourseId]);


  // --- EVENT HANDLERS ---
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setInputs(prev => ({ ...prev, [name]: value }));

    // Validation logic
    let errorMsg = '';
    const numValue = parseFloat(value);
    
    if (value === '') {
        // Allow empty values but show error state visually until focus is lost or value is entered
    } else if (isNaN(numValue)) {
        errorMsg = 'Must be a number.';
    } else {
        let min = 0, max = 0;
        if (name.startsWith('ct')) { max = 20; }
        else if (name === 'mid') { max = courseConfig.midTermMax; }
        else if (name === 'attendance' || name === 'performance') { max = 15; }

        if (numValue < min || numValue > max) {
            errorMsg = `Must be between ${min} and ${max}.`;
        }
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));

  }, [courseConfig.midTermMax]);

  const handleReset = () => {
    setInputs(INITIAL_INPUTS);
    setErrors({});
  };
  
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            CSE-25 Grade Calculator
          </h1>
          <div className="flex items-center gap-3">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {COURSES.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.credits} CREDIT)
                </option>
              ))}
            </select>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle dark mode">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
             <button onClick={() => setIsInfoVisible(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Show calculation info">
              ℹ️
            </button>
          </div>
        </header>

        {/* Main Layout: Inputs and Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:gap-12 pb-40 md:pb-0">
          
          {/* Input Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <NumberInput name="ct1" label="Class Test 1" value={inputs.ct1} onChange={handleInputChange} min={0} max={20} error={errors.ct1} />
                <NumberInput name="ct2" label="Class Test 2" value={inputs.ct2} onChange={handleInputChange} min={0} max={20} error={errors.ct2} />
                <div className="sm:col-span-2">
                    <NumberInput name="ct3" label="Class Test 3" value={inputs.ct3} onChange={handleInputChange} min={0} max={20} error={errors.ct3} helperText="We'll take the best two CT scores."/>
                </div>
                <hr className="sm:col-span-2 my-2 border-gray-200 dark:border-gray-600"/>
                <NumberInput name="mid" label="Mid Term" value={inputs.mid} onChange={handleInputChange} min={0} max={courseConfig.midTermMax} error={errors.mid}/>
                <NumberInput name="attendance" label="Attendance" value={inputs.attendance} onChange={handleInputChange} min={0} max={15} error={errors.attendance}/>
                <div className="sm:col-span-2">
                    <NumberInput name="performance" label="Class Performance" value={inputs.performance} onChange={handleInputChange} min={0} max={15} error={errors.performance}/>
                </div>
            </div>
             <button onClick={handleReset} className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800">
              Reset All
            </button>
          </div>
          
          {/* Result Card (Sticky on Mobile) */}
          <div className="fixed bottom-0 left-0 right-0 md:relative bg-white dark:bg-gray-800 p-6 md:rounded-2xl shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)] md:shadow-lg border-t-2 border-indigo-500 md:border-2 md:border-gray-200 dark:md:border-gray-700 flex flex-col justify-center items-center text-center z-10">
              <h2 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Required Marks for Final</h2>
              
              <div aria-live="polite" className="w-full">
                {!calculationResult.isValid ? (
                    <div className="text-2xl font-bold text-gray-500 dark:text-gray-400 py-10">
                        Please enter valid marks.
                    </div>
                ) : (
                    <>
                        <p className={`text-6xl font-bold mb-3 transition-colors ${
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

                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 h-10">
                            {calculationResult.message}
                        </p>
                    </>
                )}
              </div>
              
              <div className="w-full border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-around">
                  <span>Achieved: <strong>{calculationResult.isValid ? calculationResult.achieved : '...'}</strong></span>
                  <span>Target: <strong>{courseConfig.target}</strong></span>
                  <span>Final Max: <strong>{courseConfig.finalMax}</strong></span>
              </div>
          </div>
        </div>
      </main>

      {/* Info Modal */}
      {isInfoVisible && (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setIsInfoVisible(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Calculation Formula</h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <p>1. <strong>Best CT Total:</strong> The sum of the two highest Class Test scores.</p>
                    <p>2. <strong>CT Contribution:</strong> `Best CT Total × 1.5` (max 60).</p>
                    <p>3. <strong>Achieved Marks:</strong> `CT Contribution + Mid Term + Attendance + Class Performance`.</p>
                    <p>4. <strong>Required for CG-4:</strong> `Target Marks - Achieved Marks`.</p>
                    <p className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        The target is <strong>{courseConfig.target}</strong> for this {courseConfig.credits}-credit course. The final exam has a maximum of <strong>{courseConfig.finalMax}</strong> marks.
                    </p>
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
