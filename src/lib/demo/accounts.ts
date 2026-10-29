/** Demo sign-in shortcuts (kept separate so the login page doesn't bundle the full seed). */
export const DEMO_PASSWORD = 'demo123';
export const DEMO_ACCOUNTS = [
  { role: 'student', label: 'Trainee', identifier: 'priya@demo.itithane.in', hint: 'Priya Shinde · Electrician' },
  { role: 'instructor', label: 'Instructor', identifier: 'instructor@demo.itithane.in', hint: 'Electrician craft instructor' },
  { role: 'admin', label: 'Admin / TPO', identifier: 'admin@demo.itithane.in', hint: 'Principal’s office' },
  { role: 'employer', label: 'Employer', identifier: 'hr@konkanpower.demo', hint: 'Konkan Power Systems' },
] as const;
