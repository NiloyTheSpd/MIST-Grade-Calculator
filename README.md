# MIST Grade Calculator

A small React + Vite + Tailwind project for calculating final exam marks required to achieve a target grade in MIST-style courses.

Features
- Enter Class Test (CT) scores, Midterm, Attendance and Class Performance marks.
- Choose Credit (2 or 3) — the app applies different weightings for 2-credit (GEBS-101-like) and 3-credit courses.
- Select a target grade (A+, A, A-, B+, ..., F*) and the app tells you how many marks you need in the Final to reach that target.
- Dark mode toggle and info modal explaining the calculation formula.

How it works (quick)
- Best two CTs are taken; for non-GEBS courses the CT sum is multiplied by 1.5.
- Achieved = CT contribution + Mid + Attendance + Performance.
- Target = TotalMarks × GradePercentage (TotalMarks = 300 for 3-credit, 200 for 2-credit).
- Required for Final = ceil(max(0, Target − Achieved)).



Quick start
1. Install dependencies:

```bash
pnpm install
```

2. Run dev server:

```bash
pnpm run dev
```

3. Build for production:

```bash
pnpm run build
```

4. Open `index.html` or the dev server URL (usually http://localhost:5173/) to use the app.

Project notes
- This project uses Tailwind CSS. A small global rule `text-size-adjust` has been added in `src/index.css` to improve browser compatibility for text sizing.
- The course dropdown was simplified into a credit selector ("Select Credit", "2 Credit", "3 Credit") and the logic derives a synthetic course to preserve behavior. 2-credit selection follows GEBS-101 rules.

Background image
- Place your campus/background image at `public/campus-bg.jpg`. The app will use that file for the blurred background. If you don't provide one, the app will try to load `/campus-bg.jpg` and fall back to a blank background.

License
This project is licensed under the MIT License — see `LICENSE`.


Contributing
Feel free to open issues or PRs.Fork the Repo, If you add more courses or change grading thresholds, keep `GRADE_THRESHOLDS` in `src/App.jsx` in sync.

Contact
Repository owner: @NiloyTheSpd
