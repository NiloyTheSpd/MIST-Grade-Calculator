import React from 'react';
import { COURSES } from './gradeData.js';

/**
 * The two courses side by side: what each is marked out of, and how much the
 * Final carries in each.
 */
export default function Weighting() {
  const keys = [
    ['totalMarks', 'Semester total'],
    ['ctWeight', 'Class test weight'],
    ['midTermMax', 'Mid term'],
    ['attendanceMax', 'Attendance'],
    ['performanceMax', 'Performance'],
    ['finalMax', 'Final maximum']
  ];

  return (
    <div className="weight">
      {Object.values(COURSES).map((course) => (
        <div className="weight__col" key={course.id}>
          <h3 className="weight__title">{course.label}</h3>
          <p className="weight__note">{course.note}</p>
          <dl className="weight__list">
            {keys.map(([key, label]) => (
              <div className="weight__line" key={key}>
                <dt>{label}</dt>
                <dd className="mono">
                  {key === 'ctWeight' ? `× ${course[key]}` : course[key]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
