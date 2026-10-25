// The grade table, the course weightings and the sheet's rows.
// One source of truth — the calculator, the ladder and the formula all read it.

// Grade thresholds (percentage of the semester total + the CGPA point)
export const GRADE_THRESHOLDS = {
  'A+': { percentage: 0.8, gradePoints: 4.0 },
  A: { percentage: 0.75, gradePoints: 3.75 },
  'A-': { percentage: 0.7, gradePoints: 3.5 },
  'B+': { percentage: 0.65, gradePoints: 3.25 },
  B: { percentage: 0.6, gradePoints: 3.0 },
  'B-': { percentage: 0.55, gradePoints: 2.75 },
  'C+': { percentage: 0.5, gradePoints: 2.5 },
  C: { percentage: 0.45, gradePoints: 2.25 },
  D: { percentage: 0.4, gradePoints: 2.0 },
  'F*': { percentage: 0.0, gradePoints: 0.0 }
};

export const GRADE_ORDER = Object.keys(GRADE_THRESHOLDS);

// The share of the semester total a grade takes, as a whole number.
// Rounded here so 0.55 never reaches the page as 55.00000000000001.
export const gradePercent = (grade) =>
  Math.round(GRADE_THRESHOLDS[grade].percentage * 100);

// The ledger rows of the sheet, in the order the semester is marked.
export const SCORE_ROWS = [
  { name: 'ct1', label: 'Class Test 1', max: 20 },
  { name: 'ct2', label: 'Class Test 2', max: 20 },
  { name: 'ct3', label: 'Class Test 3', max: 20 },
  { name: 'performance', label: 'Performance', max: null },
  { name: 'attendance', label: 'Attendance', max: null },
  { name: 'mid', label: 'Mid Term', max: null }
];

export const INITIAL_INPUTS = {
  ct1: '',
  ct2: '',
  ct3: '',
  mid: '',
  attendance: '',
  performance: ''
};

// The two courses the sheet knows about.
export const COURSES = {
  3: {
    id: 'GEN-3',
    credits: 3,
    label: '3 credit',
    note: 'The general course.',
    totalMarks: 300,
    midTermMax: 30,
    attendanceMax: 15,
    performanceMax: 15,
    finalMax: 180,
    ctWeight: 1.5
  },
  2: {
    id: 'GEBS-101',
    credits: 2,
    label: '2 credit',
    note: 'GEBS-101: the class test sum is not weighted.',
    totalMarks: 200,
    midTermMax: 20,
    attendanceMax: 10,
    performanceMax: 10,
    finalMax: 120,
    ctWeight: 1
  }
};

// The best two class tests count.
export const getBestTwoCtSum = (ct1, ct2, ct3) => {
  const scores = [ct1, ct2, ct3].sort((a, b) => b - a);
  return scores[0] + scores[1];
};

// The maximum each class test can be marked out of.
export const CT_MAX = 20;
