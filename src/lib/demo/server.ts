/**
 * In-browser demo server. Mirrors the REST API of the backend (same routes, same shapes) so the
 * portal is fully usable on static hosting. Data persists in localStorage for this browser only.
 */
import { ApiError } from '@/lib/api';
import { localDay, localMonth } from '@/lib/dates';
import { CAMPUS, distanceM, LATE_AFTER_MIN, pct, verifyToken } from '@/lib/attendance-core';
import { cmsSeed, defaultSettings } from '@/lib/cms';
import type {
  Application, ApplicationStatus, AttemptResult, AttemptStart, AttendanceStatus, AttendanceSummaryRow, Batch, CmsCollection, CmsItem,
  Dashboard, Enquiry, Job, MyAttendance, Profile, Question, Quiz, QuizInsights, Role, RosterRow, SiteSettings, User,
} from '@/lib/types';
import { DEMO_CMS_KEY, readDemoCms, writeDemoCms, type DemoCms } from './cms-store';
import { buildSeed, type DemoAttempt, type DemoDB, type DemoQuiz, type DemoSession, type DemoUser } from './seed';

const DB_KEY = 'iti.demo.db.v1';
const SEED_VERSION = 4;
let db: DemoDB | null = null;
let memoryCms: DemoCms | null = null;

/* ---------- persistence ---------- */
function load(): DemoDB {
  if (db) return db;
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoDB;
      if (parsed.version === SEED_VERSION) db = parsed;
    }
  } catch {
    /* corrupted or blocked storage — reseed */
  }
  if (!db) {
    db = buildSeed();
    save();
  }
  return db;
}
function save() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* storage full — keep working in memory */
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === DB_KEY) db = null;
    if (e.key === DEMO_CMS_KEY) memoryCms = null;
  });
}

function cms(): DemoCms {
  if (memoryCms) return memoryCms;
  const existing = readDemoCms();
  if (existing) return (memoryCms = existing);
  const now = new Date().toISOString();
  const seeded: DemoCms = { settings: { ...defaultSettings } };
  (Object.keys(cmsSeed) as CmsCollection[]).forEach((c) => {
    seeded[c] = cmsSeed[c]().map((data, i) => ({ id: `${c}-${i + 1}`, collection: c, data: data as Record<string, unknown>, status: 'published', sort: i, createdAt: now, updatedAt: now }));
  });
  writeDemoCms(seeded);
  return (memoryCms = seeded);
}
function saveCms() {
  if (memoryCms) writeDemoCms(memoryCms);
}

export function resetDemo() {
  try {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(DEMO_CMS_KEY);
    localStorage.removeItem('iti.token');
  } catch {
    /* ignore */
  }
  db = null;
  memoryCms = null;
  window.dispatchEvent(new Event('iti-demo-cms'));
}

/* ---------- helpers ---------- */
const uid = (p: string) => `${p}-${crypto.randomUUID().slice(0, 8)}`;
const nowIso = () => new Date().toISOString();
const today = () => localDay();
const fail = (status: number, msg: string): never => {
  throw new ApiError(status, msg);
};
const pub = (u: DemoUser): User => {
  const { password: _pw, ...rest } = u;
  return rest;
};
const mini = (u: DemoUser) => ({ id: u.id, name: u.name, enrollmentNo: u.enrollmentNo });
const tokenFor = (u: DemoUser) => `demo.${btoa(JSON.stringify({ uid: u.id, iat: Date.now() }))}`;
function userFromToken(token: string | null | undefined): DemoUser | null {
  if (!token?.startsWith('demo.')) return null;
  try {
    const { uid } = JSON.parse(atob(token.slice(5)));
    return load().users.find((u) => u.id === uid) ?? null;
  } catch {
    return null;
  }
}
type Ctx = { user: DemoUser | null; params: Record<string, string>; query: URLSearchParams; body: Record<string, any> };
const need = (c: Ctx, ...roles: Role[]) => {
  if (!c.user) fail(401, 'Please sign in to continue.');
  if (c.user!.status === 'disabled') fail(403, 'Your account is disabled.');
  if (roles.length && !roles.includes(c.user!.role)) fail(403, 'You do not have access to this.');
  return c.user!;
};
const needActive = (c: Ctx, ...roles: Role[]) => {
  const u = need(c, ...roles);
  if (u.status !== 'active') fail(403, 'Your account is awaiting approval by the institute.');
  return u;
};
const isStaff = (u: DemoUser) => u.role === 'admin' || u.role === 'instructor';
const staffBatchIds = (u: DemoUser) => load().batches.filter((b) => u.role === 'admin' || b.instructorId === u.id).map((b) => b.id);
const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ---------- attendance helpers ---------- */
function autoClose() {
  const d = load();
  const t = Date.now();
  d.sessions.forEach((s) => {
    if (s.status === 'open' && new Date(s.endsAt).getTime() + 120_000 < t) s.status = 'closed';
  });
}
function sessionView(s: DemoSession, withSecret: boolean) {
  const d = load();
  const recs = d.records.filter((r) => r.sessionId === s.id);
  const total = d.users.filter((u) => u.role === 'student' && u.batchId === s.batchId).length;
  const { secret, ...rest } = s;
  return { ...rest, ...(withSecret && s.status === 'open' ? { secret } : {}), presentCount: recs.filter((r) => r.status === 'present' || r.status === 'late').length, totalCount: total };
}
function studentStats(studentId: string, from?: string, to?: string) {
  const d = load();
  const recs = d.records.filter((r) => r.studentId === studentId);
  const sessionsById = new Map(d.sessions.map((s) => [s.id, s]));
  const inRange = recs.filter((r) => {
    const s = sessionsById.get(r.sessionId);
    return s && (!from || s.date >= from) && (!to || s.date <= to);
  });
  const c = { present: 0, late: 0, absent: 0, leave: 0 } as Record<AttendanceStatus, number>;
  inRange.forEach((r) => (c[r.status] += 1));
  const total = inRange.length;
  return { ...c, total, pct: pct(c.present + c.late, total) } as { present: number; late: number; absent: number; leave: number; total: number; pct: number };
}

/* ---------- quiz helpers ---------- */
const quizMeta = (q: DemoQuiz): Quiz => {
  const { questions, ...rest } = q;
  return { ...rest, questionCount: questions.length, totalMarks: questions.reduce((s, x) => s + x.marks, 0) };
};
const canTake = (q: DemoQuiz, u: DemoUser) => q.status === 'published' && (q.batchId ? q.batchId === u.batchId : !q.tradeSlug || q.tradeSlug === u.tradeSlug);
function displayQuestions(q: DemoQuiz, a: DemoAttempt, reveal: boolean): Question[] {
  return a.order
    .map((qid) => q.questions.find((x) => x.id === qid))
    .filter(Boolean)
    .map((x) => {
      const layout = a.layout[x!.id] ?? x!.options.map((_, i) => i);
      const base: Question = { id: x!.id, text: x!.text, marks: x!.marks, options: layout.map((orig) => x!.options[orig]) };
      return reveal ? { ...base, correct: layout.indexOf(x!.correct!), explanation: x!.explanation } : base;
    });
}
function score(q: DemoQuiz, a: DemoAttempt) {
  let s = 0;
  for (const x of q.questions) {
    const shown = a.answers[x.id];
    if (shown === undefined || shown === null) continue;
    const orig = (a.layout[x.id] ?? x.options.map((_, i) => i))[shown];
    if (orig === x.correct) s += x.marks;
  }
  return s;
}
function attemptResult(a: DemoAttempt): AttemptResult {
  const d = load();
  const q = d.quizzes.find((x) => x.id === a.quizId)!;
  const subs = d.attempts.filter((x) => x.quizId === q.id && x.submittedAt).sort((x, y) => (y.percentage ?? 0) - (x.percentage ?? 0));
  const { layout: _l, order: _o, ...attempt } = a;
  const review = q.showAnswers && a.submittedAt ? displayQuestions(q, a, true).map((x) => ({ ...x, chosen: a.answers[x.id] ?? null, isCorrect: a.answers[x.id] === x.correct })) : null;
  return { attempt, quiz: { id: q.id, title: q.title, passPct: q.passPct, showAnswers: q.showAnswers, totalMarks: q.questions.reduce((s, x) => s + x.marks, 0) }, review, rank: a.submittedAt ? subs.findIndex((x) => x.id === a.id) + 1 : undefined, of: subs.length };
}
function validateQuiz(b: Record<string, any>) {
  if (!String(b.title ?? '').trim()) fail(400, 'Please give the quiz a title.');
  const qs = (b.questions ?? []) as Question[];
  if (b.status === 'published' && qs.length === 0) fail(400, 'Add at least one question before publishing.');
  qs.forEach((x, i) => {
    if (!String(x.text ?? '').trim()) fail(400, `Question ${i + 1} has no text.`);
    const opts = (x.options ?? []).filter((o) => String(o).trim());
    if (opts.length < 2) fail(400, `Question ${i + 1} needs at least two options.`);
    if (typeof x.correct !== 'number' || x.correct < 0 || x.correct >= x.options.length) fail(400, `Choose the correct answer for question ${i + 1}.`);
  });
  return qs.map((x) => ({ id: x.id || uid('qq'), text: x.text.trim(), options: x.options.map((o) => String(o).trim()), correct: x.correct, explanation: x.explanation?.trim() ?? '', marks: Math.max(1, Number(x.marks) || 1) }));
}

/* ---------- job helpers ---------- */
const jobView = (j: Job, u: DemoUser | null): Job => {
  const d = load();
  const apps = d.applications.filter((a) => a.jobId === j.id);
  const mine = u?.role === 'student' ? apps.find((a) => a.studentId === u.id && a.status !== 'withdrawn') : undefined;
  return { ...j, applicationCount: u && (u.role === 'admin' || j.postedBy === u.id) ? apps.filter((a) => a.status !== 'withdrawn').length : undefined, myApplication: mine ? { id: mine.id, status: mine.status } : null };
};
const studentSummary = (id: string) => {
  const d = load();
  const s = d.users.find((u) => u.id === id);
  if (!s) return undefined;
  return { id: s.id, name: s.name, enrollmentNo: s.enrollmentNo, tradeSlug: s.tradeSlug, phone: s.phone, email: s.email, profile: d.profiles.find((p) => p.userId === id) ?? null, attendancePct: studentStats(id).total ? studentStats(id).pct : null };
};
const emptyProfile = (userId: string): Profile => ({ userId, headline: '', about: '', skills: [], languages: [], education: [], certifications: [], projects: [], address: '', dob: '', links: [], updatedAt: nowIso() });

/* ---------- routes ---------- */
type Handler = (c: Ctx) => unknown | Promise<unknown>;
const routes: { method: string; parts: string[]; handler: Handler }[] = [];
const route = (method: string, pattern: string, handler: Handler) => routes.push({ method, parts: pattern.split('/').filter(Boolean), handler });

// Auth
route('POST', '/auth/login', ({ body }) => {
  const id = String(body.identifier ?? '').trim().toLowerCase();
  const u = load().users.find((x) => [x.email?.toLowerCase(), x.phone, x.enrollmentNo?.toLowerCase()].includes(id));
  if (!u || u.password !== body.password) fail(401, 'Incorrect email / mobile / enrollment number or password.');
  if (u!.status === 'disabled') fail(403, 'This account has been disabled. Please contact the office.');
  return { token: tokenFor(u!), user: pub(u!) };
});
route('POST', '/auth/register', ({ body }) => {
  const d = load();
  const role = body.role === 'employer' ? 'employer' : 'student';
  const email = String(body.email ?? '').trim().toLowerCase();
  const phone = String(body.phone ?? '').replace(/\D/g, '').slice(-10);
  if (!String(body.name ?? '').trim()) fail(400, 'Please enter your name.');
  if (!/^\S+@\S+\.\S+$/.test(email)) fail(400, 'Please enter a valid email address.');
  if (!/^[6-9]\d{9}$/.test(phone)) fail(400, 'Please enter a valid 10-digit mobile number.');
  if (String(body.password ?? '').length < 6) fail(400, 'Password must be at least 6 characters.');
  if (role === 'employer' && !String(body.company ?? '').trim()) fail(400, 'Please enter your company name.');
  if (d.users.some((u) => u.email?.toLowerCase() === email || u.phone === phone)) fail(409, 'An account with this email or mobile already exists.');
  const u: DemoUser = { id: uid('u'), name: body.name.trim(), email, phone, role, status: 'pending', enrollmentNo: body.enrollmentNo?.trim() || null, batchId: null, tradeSlug: body.tradeSlug || null, company: role === 'employer' ? body.company.trim() : null, mustChangePassword: false, createdAt: nowIso(), password: body.password };
  d.users.push(u);
  return { token: tokenFor(u), user: pub(u) };
});
route('GET', '/auth/me', (c) => pub(need(c)));
route('POST', '/auth/change-password', (c) => {
  const u = need(c);
  if (u.password !== c.body.currentPassword) fail(400, 'Your current password is incorrect.');
  if (String(c.body.newPassword ?? '').length < 6) fail(400, 'New password must be at least 6 characters.');
  u.password = c.body.newPassword;
  u.mustChangePassword = false;
  return pub(u);
});

// Dashboard
route('GET', '/dashboard', (c) => {
  const u = need(c);
  const d = load();
  autoClose();
  const monthKeys = [2, 1, 0].map((k) => {
    const dt = new Date();
    dt.setDate(1);
    dt.setMonth(dt.getMonth() - k);
    return localMonth(dt);
  });
  const monthLabel = (m: string) => new Date(`${m}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short' });
  if (u.role === 'student') {
    const s = studentStats(u.id);
    const quizzes = d.quizzes.filter((q) => canTake(q, u));
    const pending = quizzes.filter((q) => !d.attempts.some((a) => a.quizId === q.id && a.studentId === u.id && a.submittedAt));
    const apps = d.applications.filter((a) => a.studentId === u.id && a.status !== 'withdrawn');
    const jobs = d.jobs.filter((j) => j.status === 'open' && j.lastDate >= today() && (!j.trades.length || j.trades.includes(u.tradeSlug ?? '')));
    const out: Dashboard = {
      role: u.role,
      cards: [
        { key: 'attendance', label: 'Attendance', value: s.total ? `${s.pct}%` : '—', hint: s.total ? `${s.present + s.late} of ${s.total} sessions` : 'No sessions yet' },
        { key: 'quizzes', label: 'Quizzes to take', value: pending.length, hint: `${quizzes.length} available` },
        { key: 'applications', label: 'Applications', value: apps.length, hint: `${apps.filter((a) => ['shortlisted', 'interview', 'selected'].includes(a.status)).length} progressing` },
        { key: 'jobs', label: 'Openings for you', value: jobs.length, hint: 'Matching your trade' },
      ],
      attendanceTrend: monthKeys
        .map((m) => ({ m, st: studentStats(u.id, `${m}-01`, `${m}-31`) }))
        .filter((x) => x.st.total > 0)
        .map((x) => ({ label: monthLabel(x.m), pct: x.st.pct })),
      upcomingQuizzes: pending.map(quizMeta).slice(0, 4),
      recentApplications: apps.slice(-4).reverse().map((a) => ({ ...a, job: d.jobs.find((j) => j.id === a.jobId) })),
      openJobs: jobs.slice(0, 4).map((j) => jobView(j, u)),
    };
    return out;
  }
  if (u.role === 'employer') {
    const mine = d.jobs.filter((j) => j.postedBy === u.id);
    const apps = d.applications.filter((a) => mine.some((j) => j.id === a.jobId) && a.status !== 'withdrawn');
    return {
      role: u.role,
      cards: [
        { key: 'jobs', label: 'Your openings', value: mine.length, hint: `${mine.filter((j) => j.status === 'open').length} live` },
        { key: 'applicants', label: 'Applicants', value: apps.length },
        { key: 'shortlisted', label: 'Shortlisted', value: apps.filter((a) => ['shortlisted', 'interview'].includes(a.status)).length },
        { key: 'selected', label: 'Selected', value: apps.filter((a) => a.status === 'selected').length },
      ],
      openJobs: mine.map((j) => jobView(j, u)),
      recentApplications: apps.slice(-5).reverse().map((a) => ({ ...a, job: d.jobs.find((j) => j.id === a.jobId), student: studentSummary(a.studentId) })),
    } satisfies Dashboard;
  }
  // staff
  const batchIds = staffBatchIds(u);
  const students = d.users.filter((x) => x.role === 'student' && x.status === 'active' && batchIds.includes(x.batchId ?? ''));
  const rows: AttendanceSummaryRow[] = students.map((s) => ({ student: mini(s), ...studentStats(s.id) }));
  const avg = rows.length ? Math.round((rows.reduce((t, r) => t + r.pct, 0) / rows.length) * 10) / 10 : 0;
  const todaySessions = d.sessions.filter((s) => batchIds.includes(s.batchId) && s.date === today()).map((s) => sessionView(s, false));
  const trend = monthKeys.map((m) => {
    const recs = d.records.filter((r) => {
      const s = d.sessions.find((x) => x.id === r.sessionId);
      return s && batchIds.includes(s.batchId) && s.date.startsWith(m);
    });
    return { label: monthLabel(m), pct: pct(recs.filter((r) => r.status === 'present' || r.status === 'late').length, recs.length), n: recs.length };
  }).filter((t) => t.n > 0).map(({ label, pct: p }) => ({ label, pct: p }));
  const base = {
    attendanceTrend: trend,
    todaySessions,
    lowAttendance: rows.filter((r) => r.total && r.pct < 80).sort((a, b) => a.pct - b.pct).slice(0, 8),
    upcomingQuizzes: d.quizzes.filter((q) => u.role === 'admin' || q.createdBy === u.id || batchIds.includes(q.batchId ?? '')).map((q) => ({ ...quizMeta(q), attemptCount: d.attempts.filter((a) => a.quizId === q.id && a.submittedAt).length })).slice(0, 5),
  };
  if (u.role === 'instructor')
    return {
      role: u.role,
      cards: [
        { key: 'batches', label: 'Your batches', value: batchIds.length },
        { key: 'students', label: 'Trainees', value: students.length },
        { key: 'avg', label: 'Avg. attendance', value: `${avg}%`, hint: 'All sessions' },
        { key: 'low', label: 'Below 80%', value: base.lowAttendance.length, hint: 'Need follow-up' },
      ],
      ...base,
    } satisfies Dashboard;
  const pendingEmployers = d.users.filter((x) => x.role === 'employer' && x.status === 'pending').length;
  const pendingStudents = d.users.filter((x) => x.role === 'student' && x.status === 'pending').length;
  const pendingJobs = d.jobs.filter((j) => j.status === 'pending').length;
  const newEnq = d.enquiries.filter((e) => e.status === 'new').length;
  return {
    role: u.role,
    cards: [
      { key: 'students', label: 'Active trainees', value: students.length, hint: `${pendingStudents} awaiting approval` },
      { key: 'avg', label: 'Avg. attendance', value: `${avg}%` },
      { key: 'jobs', label: 'Open jobs', value: d.jobs.filter((j) => j.status === 'open').length, hint: `${d.applications.filter((a) => a.status === 'selected').length} selected so far` },
      { key: 'enquiries', label: 'New enquiries', value: newEnq },
    ],
    pending: { employers: pendingEmployers + pendingStudents, jobs: pendingJobs, enquiries: newEnq },
    ...base,
  } satisfies Dashboard;
});

// Users & batches
route('GET', '/users', (c) => {
  needActive(c, 'admin', 'instructor');
  const { query } = c;
  const q = (query.get('q') ?? '').toLowerCase();
  return load()
    .users.filter((u) => (!query.get('role') || u.role === query.get('role')) && (!query.get('status') || u.status === query.get('status')) && (!query.get('batchId') || u.batchId === query.get('batchId')))
    .filter((u) => !q || `${u.name} ${u.email} ${u.phone} ${u.enrollmentNo} ${u.company}`.toLowerCase().includes(q))
    .map(pub);
});
route('POST', '/users', (c) => {
  needActive(c, 'admin');
  const d = load();
  const b = c.body;
  if (!String(b.name ?? '').trim()) fail(400, 'Name is required.');
  if (b.email && d.users.some((u) => u.email?.toLowerCase() === String(b.email).toLowerCase())) fail(409, 'Email already in use.');
  if (b.enrollmentNo && d.users.some((u) => u.enrollmentNo === b.enrollmentNo)) fail(409, 'Enrollment number already exists.');
  const temp = `iti@${Math.floor(1000 + Math.random() * 9000)}`;
  const batch = d.batches.find((x) => x.id === b.batchId);
  const u: DemoUser = { id: uid('u'), name: b.name.trim(), email: b.email?.trim().toLowerCase() || null, phone: b.phone?.trim() || null, role: b.role ?? 'student', status: 'active', enrollmentNo: b.enrollmentNo?.trim() || null, batchId: batch?.id ?? null, tradeSlug: batch?.tradeSlug ?? b.tradeSlug ?? null, company: b.company ?? null, mustChangePassword: true, createdAt: nowIso(), password: temp };
  d.users.push(u);
  return { user: pub(u), tempPassword: temp };
});
route('POST', '/users/import', (c) => {
  needActive(c, 'admin');
  const d = load();
  const rows = (c.body.rows ?? []) as Record<string, string>[];
  let created = 0;
  const errors: string[] = [];
  rows.forEach((r, i) => {
    const name = (r.name ?? '').trim();
    if (!name) return errors.push(`Row ${i + 1}: name missing`);
    if (r.enrollmentNo && d.users.some((u) => u.enrollmentNo === r.enrollmentNo)) return errors.push(`Row ${i + 1}: ${r.enrollmentNo} already exists`);
    const batch = d.batches.find((x) => x.id === (r.batchId || c.body.batchId));
    d.users.push({ id: uid('u'), name, email: r.email?.toLowerCase() || null, phone: r.phone || null, role: 'student', status: 'active', enrollmentNo: r.enrollmentNo || null, batchId: batch?.id ?? null, tradeSlug: batch?.tradeSlug ?? null, company: null, mustChangePassword: true, createdAt: nowIso(), password: r.phone ? `iti@${r.phone.slice(-4)}` : 'iti@1234' });
    created++;
  });
  return { created, skipped: rows.length - created, errors };
});
route('PATCH', '/users/:id', (c) => {
  needActive(c, 'admin');
  const d = load();
  const u = d.users.find((x) => x.id === c.params.id) ?? fail(404, 'User not found.');
  const b = c.body;
  (['name', 'email', 'phone', 'enrollmentNo', 'company', 'status', 'role'] as const).forEach((k) => {
    if (b[k] !== undefined) (u as unknown as Record<string, unknown>)[k] = b[k];
  });
  if (b.batchId !== undefined) {
    const batch = d.batches.find((x) => x.id === b.batchId);
    u.batchId = batch?.id ?? null;
    if (batch) u.tradeSlug = batch.tradeSlug;
  }
  return pub(u);
});
route('POST', '/users/:id/reset-password', (c) => {
  needActive(c, 'admin');
  const u = load().users.find((x) => x.id === c.params.id) ?? fail(404, 'User not found.');
  const temp = `iti@${Math.floor(1000 + Math.random() * 9000)}`;
  u.password = temp;
  u.mustChangePassword = true;
  return { tempPassword: temp };
});
route('DELETE', '/users/:id', (c) => {
  const me = needActive(c, 'admin');
  if (me.id === c.params.id) fail(400, 'You cannot delete your own account.');
  const d = load();
  d.users = d.users.filter((u) => u.id !== c.params.id);
  return { ok: true };
});
route('GET', '/batches', (c) => {
  const u = need(c);
  const d = load();
  const list = u.role === 'student' ? d.batches.filter((b) => b.id === u.batchId) : u.role === 'employer' ? [] : d.batches.filter((b) => staffBatchIds(u).includes(b.id));
  return list.map((b) => ({ ...b, studentCount: d.users.filter((x) => x.role === 'student' && x.batchId === b.id && x.status === 'active').length }));
});
route('POST', '/batches', (c) => {
  needActive(c, 'admin');
  const b = c.body;
  if (!b.name || !b.tradeSlug) fail(400, 'Batch name and trade are required.');
  const batch: Batch = { id: uid('b'), name: b.name, tradeSlug: b.tradeSlug, session: b.session ?? '', year: Number(b.year) || 1, instructorId: b.instructorId || null };
  load().batches.push(batch);
  return batch;
});
route('PATCH', '/batches/:id', (c) => {
  needActive(c, 'admin');
  const batch = load().batches.find((x) => x.id === c.params.id) ?? fail(404, 'Batch not found.');
  Object.assign(batch, { ...c.body, id: batch.id });
  return batch;
});
route('DELETE', '/batches/:id', (c) => {
  needActive(c, 'admin');
  const d = load();
  if (d.users.some((u) => u.batchId === c.params.id)) fail(400, 'Move or remove the trainees in this batch first.');
  d.batches = d.batches.filter((b) => b.id !== c.params.id);
  return { ok: true };
});
route('GET', '/batches/:id/students', (c) => {
  const u = needActive(c, 'admin', 'instructor');
  if (!staffBatchIds(u).includes(c.params.id)) fail(403, 'Not your batch.');
  return load().users.filter((x) => x.role === 'student' && x.batchId === c.params.id).map(pub);
});

// Attendance
route('GET', '/attendance/sessions', (c) => {
  const u = needActive(c, 'admin', 'instructor');
  autoClose();
  const ids = staffBatchIds(u);
  const bId = c.query.get('batchId');
  const limit = Number(c.query.get('limit') ?? 30);
  return load()
    .sessions.filter((s) => ids.includes(s.batchId) && (!bId || s.batchId === bId))
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, limit)
    .map((s) => sessionView(s, false));
});
route('POST', '/attendance/sessions', (c) => {
  const u = needActive(c, 'admin', 'instructor');
  const d = load();
  const { batchId, topic, durationMin = 15, geofence = true } = c.body;
  if (!staffBatchIds(u).includes(batchId)) fail(403, 'You can only start sessions for your batches.');
  if (!String(topic ?? '').trim()) fail(400, 'Please enter the topic for this session.');
  d.sessions.forEach((s) => {
    if (s.batchId === batchId && s.status === 'open') s.status = 'closed';
  });
  const start = new Date();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const s: DemoSession = { id: uid('s'), batchId, date: today(), topic: topic.trim(), startedAt: start.toISOString(), endsAt: new Date(start.getTime() + Math.min(180, Math.max(5, Number(durationMin))) * 60_000).toISOString(), status: 'open', createdBy: u.id, geofence: !!geofence, secret: Array.from(bytes, (x) => x.toString(16).padStart(2, '0')).join('') };
  d.sessions.push(s);
  return sessionView(s, true);
});
route('GET', '/attendance/sessions/:id', (c) => {
  const u = needActive(c, 'admin', 'instructor');
  autoClose();
  const d = load();
  const s = d.sessions.find((x) => x.id === c.params.id) ?? fail(404, 'Session not found.');
  if (!staffBatchIds(u).includes(s.batchId)) fail(403, 'Not your batch.');
  const roster: RosterRow[] = d.users
    .filter((x) => x.role === 'student' && x.batchId === s.batchId && x.status === 'active')
    .sort((a, b) => (a.enrollmentNo ?? a.name).localeCompare(b.enrollmentNo ?? b.name))
    .map((st) => {
      const r = d.records.find((x) => x.sessionId === s.id && x.studentId === st.id);
      return { student: mini(st), record: r ? (({ deviceId: _d, ...rest }) => rest)(r) : null };
    });
  return { session: sessionView(s, true), roster, batch: d.batches.find((b) => b.id === s.batchId) };
});
route('POST', '/attendance/sessions/:id/close', (c) => {
  const u = needActive(c, 'admin', 'instructor');
  const s = load().sessions.find((x) => x.id === c.params.id) ?? fail(404, 'Session not found.');
  if (!staffBatchIds(u).includes(s.batchId)) fail(403, 'Not your batch.');
  s.status = 'closed';
  s.endsAt = nowIso();
  return sessionView(s, false);
});
route('POST', '/attendance/sessions/:id/mark', (c) => {
  const u = needActive(c, 'admin', 'instructor');
  const d = load();
  const s = d.sessions.find((x) => x.id === c.params.id) ?? fail(404, 'Session not found.');
  if (!staffBatchIds(u).includes(s.batchId)) fail(403, 'Not your batch.');
  const status = c.body.status as AttendanceStatus;
  if (!['present', 'late', 'absent', 'leave'].includes(status)) fail(400, 'Invalid status.');
  let r = d.records.find((x) => x.sessionId === s.id && x.studentId === c.body.studentId);
  if (r) Object.assign(r, { status, method: 'manual', markedAt: nowIso(), flagged: false });
  else d.records.push((r = { id: uid('r'), sessionId: s.id, studentId: c.body.studentId, status, method: 'manual', markedAt: nowIso(), distanceM: null, flagged: false, deviceId: null }));
  return r;
});
/** Demo-only helper: simulates trainees scanning the QR from their phones. */
route('POST', '/attendance/sessions/:id/simulate', (c) => {
  needActive(c, 'admin', 'instructor');
  const d = load();
  const s = d.sessions.find((x) => x.id === c.params.id) ?? fail(404, 'Session not found.');
  if (s.status !== 'open') fail(400, 'Session is closed.');
  const pending = d.users.filter((x) => x.role === 'student' && x.batchId === s.batchId && x.status === 'active' && !d.records.some((r) => r.sessionId === s.id && r.studentId === x.id));
  const pick = shuffle(pending).slice(0, Math.max(1, Math.ceil(pending.length * 0.4)));
  pick.forEach((st, i) => d.records.push({ id: uid('r'), sessionId: s.id, studentId: st.id, status: 'present', method: i % 4 === 0 ? 'code' : 'qr', markedAt: nowIso(), distanceM: Math.round(15 + Math.random() * 140), flagged: false, deviceId: uid('dev') }));
  return { marked: pick.length };
});
route('POST', '/attendance/mark', async (c) => {
  const u = needActive(c, 'student');
  autoClose();
  const d = load();
  const { sessionId, token, code, lat, lng, deviceId } = c.body;
  const s = d.sessions.find((x) => x.id === sessionId) ?? fail(404, 'This attendance session does not exist.');
  if (s.batchId !== u.batchId) fail(403, 'This session is for a different batch.');
  const existing = d.records.find((r) => r.sessionId === s.id && r.studentId === u.id);
  const batch = d.batches.find((b) => b.id === s.batchId);
  if (existing && (existing.status === 'present' || existing.status === 'late')) return { record: existing, session: { id: s.id, topic: s.topic, batchName: batch?.name ?? '' }, alreadyMarked: true };
  if (s.status !== 'open') fail(410, 'Attendance for this session is closed. Please speak to your instructor.');
  if (!(await verifyToken(s.id, s.secret, { token, code }))) fail(400, 'This code has expired. Scan the latest QR code on the screen.');
  let distance: number | null = null;
  let flagged = false;
  if (typeof lat === 'number' && typeof lng === 'number') {
    distance = distanceM({ lat, lng }, CAMPUS);
    if (s.geofence && distance > CAMPUS.radiusM) flagged = true;
  } else if (s.geofence) flagged = true;
  const sameDevice = deviceId ? d.records.filter((r) => r.sessionId === s.id && r.deviceId === deviceId && r.studentId !== u.id) : [];
  if (sameDevice.length) {
    flagged = true;
    sameDevice.forEach((r) => (r.flagged = true));
  }
  const late = Date.now() - new Date(s.startedAt).getTime() > LATE_AFTER_MIN * 60_000;
  const rec = { id: existing?.id ?? uid('r'), sessionId: s.id, studentId: u.id, status: (late ? 'late' : 'present') as AttendanceStatus, method: (token ? 'qr' : 'code') as 'qr' | 'code', markedAt: nowIso(), distanceM: distance, flagged, deviceId: deviceId ?? null };
  if (existing) Object.assign(existing, rec);
  else d.records.push(rec);
  return { record: rec, session: { id: s.id, topic: s.topic, batchName: batch?.name ?? '' }, alreadyMarked: false };
});
route('GET', '/attendance/open', (c) => {
  const u = needActive(c, 'student');
  autoClose();
  const d = load();
  const s = d.sessions.filter((x) => x.batchId === u.batchId && x.status === 'open').sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
  if (!s) return { session: null };
  const rec = d.records.find((r) => r.sessionId === s.id && r.studentId === u.id);
  return { session: { id: s.id, topic: s.topic, startedAt: s.startedAt, endsAt: s.endsAt, geofence: s.geofence, batchName: d.batches.find((b) => b.id === s.batchId)?.name ?? '' }, myStatus: rec?.status ?? null };
});
route('GET', '/attendance/me', (c) => {
  const u = need(c, 'student');
  const d = load();
  const sessions = d.sessions.filter((s) => s.batchId === u.batchId).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const months = Array.from(new Set(sessions.map((s) => s.date.slice(0, 7)))).sort().slice(-4);
  const out: MyAttendance = {
    overall: studentStats(u.id),
    months: months.map((m) => {
      const st = studentStats(u.id, `${m}-01`, `${m}-31`);
      return { month: m, present: st.present + st.late, total: st.total, pct: st.pct };
    }),
    recent: sessions.slice(0, 40).map((s) => ({ session: { id: s.id, date: s.date, topic: s.topic }, status: d.records.find((r) => r.sessionId === s.id && r.studentId === u.id)?.status ?? null })),
  };
  return out;
});
route('GET', '/attendance/report', (c) => {
  const u = needActive(c, 'admin', 'instructor');
  const batchId = c.query.get('batchId') ?? '';
  if (!staffBatchIds(u).includes(batchId)) fail(403, 'Not your batch.');
  const from = c.query.get('from') ?? undefined;
  const to = c.query.get('to') ?? undefined;
  return load()
    .users.filter((x) => x.role === 'student' && x.batchId === batchId && x.status === 'active')
    .map((st): AttendanceSummaryRow => ({ student: mini(st), ...studentStats(st.id, from, to) }))
    .sort((a, b) => (a.student.enrollmentNo ?? '').localeCompare(b.student.enrollmentNo ?? ''));
});

// Quizzes
route('GET', '/quizzes', (c) => {
  const u = needActive(c, 'admin', 'instructor', 'student');
  const d = load();
  if (u.role === 'student')
    return d.quizzes
      .filter((q) => canTake(q, u))
      .map((q) => ({ ...quizMeta(q), myAttempts: d.attempts.filter((a) => a.quizId === q.id && a.studentId === u.id).map((a) => ({ id: a.id, percentage: a.percentage, submittedAt: a.submittedAt })) }));
  const ids = staffBatchIds(u);
  return d.quizzes
    .filter((q) => u.role === 'admin' || q.createdBy === u.id || ids.includes(q.batchId ?? ''))
    .map((q) => {
      const subs = d.attempts.filter((a) => a.quizId === q.id && a.submittedAt);
      return { ...quizMeta(q), attemptCount: subs.length, avgPct: subs.length ? Math.round((subs.reduce((s, a) => s + (a.percentage ?? 0), 0) / subs.length) * 10) / 10 : null };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});
route('POST', '/quizzes', (c) => {
  const u = needActive(c, 'admin', 'instructor');
  const questions = validateQuiz(c.body);
  const b = c.body;
  const batch = load().batches.find((x) => x.id === b.batchId);
  const q: DemoQuiz = { id: uid('q'), title: b.title.trim(), description: b.description ?? '', tradeSlug: batch?.tradeSlug ?? b.tradeSlug ?? null, batchId: batch?.id ?? null, createdBy: u.id, durationMin: Math.min(180, Math.max(1, Number(b.durationMin) || 10)), passPct: Math.min(100, Math.max(0, Number(b.passPct) || 40)), shuffle: b.shuffle !== false, showAnswers: b.showAnswers !== false, attemptsAllowed: Math.max(1, Number(b.attemptsAllowed) || 1), status: b.status === 'published' ? 'published' : 'draft', createdAt: nowIso(), questions };
  load().quizzes.push(q);
  return { ...quizMeta(q), questions: q.questions };
});
route('GET', '/quizzes/:id', (c) => {
  const u = needActive(c, 'admin', 'instructor', 'student');
  const d = load();
  const q = d.quizzes.find((x) => x.id === c.params.id) ?? fail(404, 'Quiz not found.');
  if (u.role === 'student') {
    if (!canTake(q, u)) fail(403, 'This quiz is not available to you.');
    return { ...quizMeta(q), myAttempts: d.attempts.filter((a) => a.quizId === q.id && a.studentId === u.id).map((a) => ({ id: a.id, percentage: a.percentage, submittedAt: a.submittedAt })) };
  }
  return { ...quizMeta(q), questions: q.questions };
});
route('PATCH', '/quizzes/:id', (c) => {
  const u = needActive(c, 'admin', 'instructor');
  const d = load();
  const q = d.quizzes.find((x) => x.id === c.params.id) ?? fail(404, 'Quiz not found.');
  if (u.role !== 'admin' && q.createdBy !== u.id) fail(403, 'Only the quiz owner can edit it.');
  const merged = { ...q, ...c.body, questions: c.body.questions ?? q.questions };
  const questions = validateQuiz(merged);
  const batch = d.batches.find((x) => x.id === merged.batchId);
  Object.assign(q, { title: merged.title.trim(), description: merged.description ?? '', batchId: batch?.id ?? null, tradeSlug: batch?.tradeSlug ?? merged.tradeSlug ?? null, durationMin: Number(merged.durationMin) || q.durationMin, passPct: Number(merged.passPct) || q.passPct, shuffle: !!merged.shuffle, showAnswers: !!merged.showAnswers, attemptsAllowed: Math.max(1, Number(merged.attemptsAllowed) || 1), status: merged.status, questions });
  return { ...quizMeta(q), questions: q.questions };
});
route('DELETE', '/quizzes/:id', (c) => {
  const u = needActive(c, 'admin', 'instructor');
  const d = load();
  const q = d.quizzes.find((x) => x.id === c.params.id) ?? fail(404, 'Quiz not found.');
  if (u.role !== 'admin' && q.createdBy !== u.id) fail(403, 'Only the quiz owner can delete it.');
  d.quizzes = d.quizzes.filter((x) => x.id !== q.id);
  d.attempts = d.attempts.filter((a) => a.quizId !== q.id);
  return { ok: true };
});
route('POST', '/quizzes/:id/attempts', (c) => {
  const u = needActive(c, 'student');
  const d = load();
  const q = d.quizzes.find((x) => x.id === c.params.id) ?? fail(404, 'Quiz not found.');
  if (!canTake(q, u)) fail(403, 'This quiz is not available to you.');
  const mine = d.attempts.filter((a) => a.quizId === q.id && a.studentId === u.id);
  const open = mine.find((a) => !a.submittedAt && new Date(a.deadline).getTime() > Date.now());
  const quiz = { id: q.id, title: q.title, durationMin: q.durationMin, passPct: q.passPct, totalMarks: q.questions.reduce((s, x) => s + x.marks, 0) };
  const strip = (a: DemoAttempt) => (({ layout: _l, order: _o, ...rest }) => rest)(a);
  if (open) return { attempt: strip(open), quiz, questions: displayQuestions(q, open, false) } satisfies AttemptStart;
  if (mine.filter((a) => a.submittedAt).length >= q.attemptsAllowed) fail(403, `You have used all ${q.attemptsAllowed} attempt(s) for this quiz.`);
  // expire stale unsubmitted attempts
  mine.filter((a) => !a.submittedAt).forEach((a) => {
    a.submittedAt = a.deadline;
    a.score = score(q, a);
    a.percentage = pct(a.score, a.maxScore);
    a.passed = a.percentage >= q.passPct;
  });
  const start = new Date();
  const order = q.shuffle ? shuffle(q.questions.map((x) => x.id)) : q.questions.map((x) => x.id);
  const layout = Object.fromEntries(q.questions.map((x) => [x.id, q.shuffle ? shuffle(x.options.map((_, i) => i)) : x.options.map((_, i) => i)]));
  const a: DemoAttempt = { id: uid('a'), quizId: q.id, studentId: u.id, startedAt: start.toISOString(), deadline: new Date(start.getTime() + q.durationMin * 60_000).toISOString(), submittedAt: null, score: null, maxScore: quiz.totalMarks, percentage: null, passed: null, tabSwitches: 0, answers: {}, layout, order };
  d.attempts.push(a);
  return { attempt: strip(a), quiz, questions: displayQuestions(q, a, false) } satisfies AttemptStart;
});
route('PATCH', '/attempts/:id', (c) => {
  const u = needActive(c, 'student');
  const a = load().attempts.find((x) => x.id === c.params.id && x.studentId === u.id) ?? fail(404, 'Attempt not found.');
  if (a.submittedAt) fail(409, 'This attempt is already submitted.');
  if (c.body.answers) a.answers = c.body.answers;
  if (typeof c.body.tabSwitches === 'number') a.tabSwitches = c.body.tabSwitches;
  return { ok: true };
});
route('POST', '/attempts/:id/submit', (c) => {
  const u = needActive(c, 'student');
  const d = load();
  const a = d.attempts.find((x) => x.id === c.params.id && x.studentId === u.id) ?? fail(404, 'Attempt not found.');
  const q = d.quizzes.find((x) => x.id === a.quizId) ?? fail(404, 'Quiz not found.');
  if (!a.submittedAt) {
    if (Date.now() <= new Date(a.deadline).getTime() + 60_000 && c.body.answers) a.answers = c.body.answers;
    if (typeof c.body.tabSwitches === 'number') a.tabSwitches = c.body.tabSwitches;
    a.submittedAt = nowIso();
    a.score = score(q, a);
    a.percentage = pct(a.score, a.maxScore);
    a.passed = a.percentage >= q.passPct;
  }
  return attemptResult(a);
});
route('GET', '/attempts/:id', (c) => {
  const u = needActive(c, 'admin', 'instructor', 'student');
  const a = load().attempts.find((x) => x.id === c.params.id) ?? fail(404, 'Attempt not found.');
  if (u.role === 'student' && a.studentId !== u.id) fail(403, 'Not your attempt.');
  return attemptResult(a);
});
route('GET', '/quizzes/:id/insights', (c) => {
  needActive(c, 'admin', 'instructor');
  const d = load();
  const q = d.quizzes.find((x) => x.id === c.params.id) ?? fail(404, 'Quiz not found.');
  const subs = d.attempts.filter((a) => a.quizId === q.id && a.submittedAt);
  const questionStats = q.questions.map((x) => {
    const answered = subs.filter((a) => a.answers[x.id] !== undefined);
    const right = answered.filter((a) => (a.layout[x.id] ?? x.options.map((_, i) => i))[a.answers[x.id]] === x.correct);
    return { questionId: x.id, text: x.text, correctPct: pct(right.length, subs.length), answered: answered.length };
  });
  const buckets = ['0–20', '20–40', '40–60', '60–80', '80–100'];
  const distribution = buckets.map((bucket, i) => ({ bucket, count: subs.filter((a) => Math.min(4, Math.floor((a.percentage ?? 0) / 20)) === i).length }));
  const out: QuizInsights = {
    quiz: { ...quizMeta(q), questions: q.questions },
    attempts: subs
      .map((a) => {
        const st = d.users.find((x) => x.id === a.studentId);
        const { layout: _l, order: _o, ...rest } = a;
        return { ...rest, student: st ? mini(st) : { id: a.studentId, name: 'Removed user', enrollmentNo: null } };
      })
      .sort((x, y) => (y.percentage ?? 0) - (x.percentage ?? 0)),
    questionStats,
    distribution,
  };
  return out;
});

// Jobs & applications
route('GET', '/jobs', (c) => {
  const u = c.user;
  const d = load();
  const kind = c.query.get('kind');
  const trade = c.query.get('trade');
  const q = (c.query.get('q') ?? '').toLowerCase();
  const mine = c.query.get('mine') === '1';
  let list = d.jobs;
  if (u?.role === 'admin') list = list.filter((j) => !c.query.get('status') || j.status === c.query.get('status'));
  else if (u?.role === 'employer' && mine) list = list.filter((j) => j.postedBy === u.id);
  else list = list.filter((j) => j.status === 'open' && j.lastDate >= today());
  return list
    .filter((j) => (!kind || j.kind === kind) && (!trade || j.trades.includes(trade)) && (!q || `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((j) => jobView(j, u));
});
route('GET', '/jobs/:id', (c) => {
  const j = load().jobs.find((x) => x.id === c.params.id) ?? fail(404, 'This opening was not found.');
  const u = c.user;
  if (j.status !== 'open' && !(u && (u.role === 'admin' || j.postedBy === u.id))) fail(404, 'This opening is no longer available.');
  return jobView(j, u);
});
const jobFields = (b: Record<string, any>) => {
  if (!String(b.title ?? '').trim()) fail(400, 'Job title is required.');
  if (!['job', 'apprenticeship', 'internship', 'drive'].includes(b.kind)) fail(400, 'Choose the type of opening.');
  if (!b.lastDate) fail(400, 'Please set the last date to apply.');
  return { title: b.title.trim(), kind: b.kind, location: b.location ?? '', trades: Array.isArray(b.trades) ? b.trades : [], description: b.description ?? '', requirements: b.requirements ?? '', stipend: b.stipend ?? '', openings: Math.max(1, Number(b.openings) || 1), lastDate: b.lastDate };
};
route('POST', '/jobs', (c) => {
  const u = needActive(c, 'admin', 'employer');
  const j: Job = { id: uid('j'), ...jobFields(c.body), company: u.role === 'employer' ? u.company ?? u.name : String(c.body.company ?? '').trim() || fail(400, 'Company name is required.'), status: u.role === 'admin' ? 'open' : 'pending', postedBy: u.id, createdAt: nowIso() };
  load().jobs.push(j);
  return jobView(j, u);
});
route('PATCH', '/jobs/:id', (c) => {
  const u = needActive(c, 'admin', 'employer');
  const j = load().jobs.find((x) => x.id === c.params.id) ?? fail(404, 'Opening not found.');
  if (u.role !== 'admin' && j.postedBy !== u.id) fail(403, 'Not your opening.');
  if (c.body.title !== undefined) Object.assign(j, jobFields({ ...j, ...c.body }));
  if (u.role === 'admin' && c.body.company) j.company = c.body.company;
  if (c.body.status) {
    if (u.role !== 'admin' && !['closed', 'open'].includes(c.body.status)) fail(403, 'Only the placement cell can approve or reject.');
    if (u.role !== 'admin' && c.body.status === 'open' && j.status === 'pending') fail(403, 'Awaiting approval by the placement cell.');
    j.status = c.body.status;
  }
  return jobView(j, u);
});
route('DELETE', '/jobs/:id', (c) => {
  const u = needActive(c, 'admin', 'employer');
  const d = load();
  const j = d.jobs.find((x) => x.id === c.params.id) ?? fail(404, 'Opening not found.');
  if (u.role !== 'admin' && j.postedBy !== u.id) fail(403, 'Not your opening.');
  d.jobs = d.jobs.filter((x) => x.id !== j.id);
  d.applications = d.applications.filter((a) => a.jobId !== j.id);
  return { ok: true };
});
route('POST', '/jobs/:id/apply', (c) => {
  const u = needActive(c, 'student');
  const d = load();
  const j = d.jobs.find((x) => x.id === c.params.id) ?? fail(404, 'Opening not found.');
  if (j.status !== 'open' || j.lastDate < today()) fail(400, 'Applications for this opening are closed.');
  if (j.trades.length && !j.trades.includes(u.tradeSlug ?? '')) fail(400, 'This opening is for other trades.');
  const prev = d.applications.find((a) => a.jobId === j.id && a.studentId === u.id);
  if (prev && prev.status !== 'withdrawn') fail(409, 'You have already applied.');
  const app: Application = { id: prev?.id ?? uid('ap'), jobId: j.id, studentId: u.id, status: 'applied', coverNote: String(c.body.coverNote ?? '').slice(0, 1000), note: '', createdAt: nowIso(), updatedAt: nowIso() };
  if (prev) Object.assign(prev, app);
  else d.applications.push(app);
  return { ...app, job: j };
});
route('GET', '/applications/me', (c) => {
  const u = need(c, 'student');
  const d = load();
  return d.applications.filter((a) => a.studentId === u.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((a) => ({ ...a, job: d.jobs.find((j) => j.id === a.jobId) }));
});
route('POST', '/applications/:id/withdraw', (c) => {
  const u = needActive(c, 'student');
  const a = load().applications.find((x) => x.id === c.params.id && x.studentId === u.id) ?? fail(404, 'Application not found.');
  a.status = 'withdrawn';
  a.updatedAt = nowIso();
  return a;
});
route('GET', '/jobs/:id/applications', (c) => {
  const u = needActive(c, 'admin', 'employer');
  const d = load();
  const j = d.jobs.find((x) => x.id === c.params.id) ?? fail(404, 'Opening not found.');
  if (u.role !== 'admin' && j.postedBy !== u.id) fail(403, 'Not your opening.');
  return d.applications.filter((a) => a.jobId === j.id && a.status !== 'withdrawn').map((a) => ({ ...a, student: studentSummary(a.studentId) }));
});
route('PATCH', '/applications/:id', (c) => {
  const u = needActive(c, 'admin', 'employer');
  const d = load();
  const a = d.applications.find((x) => x.id === c.params.id) ?? fail(404, 'Application not found.');
  const j = d.jobs.find((x) => x.id === a.jobId)!;
  if (u.role !== 'admin' && j.postedBy !== u.id) fail(403, 'Not your opening.');
  const status = c.body.status as ApplicationStatus;
  if (status && !['applied', 'shortlisted', 'interview', 'selected', 'rejected'].includes(status)) fail(400, 'Invalid status.');
  if (status) a.status = status;
  if (c.body.note !== undefined) a.note = String(c.body.note).slice(0, 500);
  a.updatedAt = nowIso();
  return { ...a, student: studentSummary(a.studentId) };
});
route('GET', '/placements/stats', (c) => {
  needActive(c, 'admin');
  const d = load();
  const apps = d.applications.filter((a) => a.status !== 'withdrawn');
  const tradeOf = (a: Application) => d.users.find((u) => u.id === a.studentId)?.tradeSlug ?? 'other';
  const trades = Array.from(new Set(apps.map(tradeOf)));
  return {
    totals: { openJobs: d.jobs.filter((j) => j.status === 'open').length, applications: apps.length, selected: apps.filter((a) => a.status === 'selected').length, employers: d.users.filter((u) => u.role === 'employer' && u.status === 'active').length },
    byStatus: (['applied', 'shortlisted', 'interview', 'selected', 'rejected'] as ApplicationStatus[]).map((s) => ({ status: s, count: apps.filter((a) => a.status === s).length })),
    byTrade: trades.map((tr) => ({ trade: tr, applications: apps.filter((a) => tradeOf(a) === tr).length, selected: apps.filter((a) => tradeOf(a) === tr && a.status === 'selected').length })),
  };
});

// Profiles
route('GET', '/profile/me', (c) => {
  const u = need(c, 'student');
  return load().profiles.find((p) => p.userId === u.id) ?? emptyProfile(u.id);
});
route('PUT', '/profile/me', (c) => {
  const u = need(c, 'student');
  const d = load();
  const b = c.body;
  const arr = (x: unknown) => (Array.isArray(x) ? x : []);
  const p: Profile = { userId: u.id, headline: String(b.headline ?? '').slice(0, 120), about: String(b.about ?? '').slice(0, 1500), skills: arr(b.skills).slice(0, 25), languages: arr(b.languages).slice(0, 8), education: arr(b.education).slice(0, 8), certifications: arr(b.certifications).slice(0, 12), projects: arr(b.projects).slice(0, 8), address: String(b.address ?? ''), dob: String(b.dob ?? ''), links: arr(b.links).slice(0, 5), updatedAt: nowIso() };
  d.profiles = [...d.profiles.filter((x) => x.userId !== u.id), p];
  return p;
});
route('GET', '/students/:id/profile', (c) => {
  const u = needActive(c, 'admin', 'instructor', 'employer');
  const d = load();
  if (u.role === 'employer' && !d.applications.some((a) => a.studentId === c.params.id && d.jobs.find((j) => j.id === a.jobId)?.postedBy === u.id)) fail(403, 'You can view profiles of your applicants only.');
  const st = d.users.find((x) => x.id === c.params.id && x.role === 'student') ?? fail(404, 'Trainee not found.');
  return { user: pub(st), profile: d.profiles.find((p) => p.userId === st.id) ?? emptyProfile(st.id), attendancePct: studentStats(st.id).pct };
});

// CMS & settings
const COLLECTIONS: CmsCollection[] = ['notices', 'events', 'gallery', 'downloads', 'staff'];
const coll = (name: string) => {
  if (!COLLECTIONS.includes(name as CmsCollection)) fail(404, 'Unknown collection.');
  const store = cms();
  return (store[name as CmsCollection] ??= []);
};
route('GET', '/cms/:collection', (c) => {
  const list = coll(c.params.collection);
  const all = c.query.get('all') === '1' && c.user?.role === 'admin';
  return [...list].filter((i) => all || i.status === 'published').sort((a, b) => a.sort - b.sort);
});
route('POST', '/cms/:collection', (c) => {
  needActive(c, 'admin');
  const list = coll(c.params.collection);
  const item: CmsItem = { id: uid(c.params.collection), collection: c.params.collection as CmsCollection, data: c.body.data ?? {}, status: c.body.status === 'draft' ? 'draft' : 'published', sort: Number.isFinite(c.body.sort) ? c.body.sort : Math.min(0, ...list.map((i) => i.sort)) - 1, createdAt: nowIso(), updatedAt: nowIso() };
  list.push(item);
  saveCms();
  return item;
});
route('PATCH', '/cms/:collection/:id', (c) => {
  needActive(c, 'admin');
  const item = coll(c.params.collection).find((i) => i.id === c.params.id) ?? fail(404, 'Item not found.');
  if (c.body.data) item.data = { ...item.data, ...c.body.data };
  if (c.body.status) item.status = c.body.status;
  if (Number.isFinite(c.body.sort)) item.sort = c.body.sort;
  item.updatedAt = nowIso();
  saveCms();
  return item;
});
route('DELETE', '/cms/:collection/:id', (c) => {
  needActive(c, 'admin');
  const store = cms();
  const name = c.params.collection as CmsCollection;
  store[name] = coll(name).filter((i) => i.id !== c.params.id);
  saveCms();
  return { ok: true };
});
route('GET', '/settings', () => ({ ...defaultSettings, ...(cms().settings ?? {}) }));
route('PUT', '/settings', (c) => {
  needActive(c, 'admin');
  const store = cms();
  store.settings = { ...defaultSettings, ...(store.settings ?? {}), ...(c.body as Partial<SiteSettings>) };
  saveCms();
  return store.settings;
});

// Enquiries
route('POST', '/enquiries', ({ body }) => {
  if (!String(body.message ?? '').trim() && !String(body.phone ?? '').trim()) fail(400, 'Please add your phone number or a message.');
  const e: Enquiry = { id: uid('e'), type: body.type ?? 'contact', name: body.name ?? '', phone: body.phone ?? '', email: body.email ?? '', trade: body.trade ?? '', subject: body.subject ?? '', message: String(body.message ?? '').slice(0, 2000), anonymous: !!body.anonymous, status: 'new', createdAt: nowIso() };
  load().enquiries.push(e);
  return e;
});
route('GET', '/enquiries', (c) => {
  needActive(c, 'admin');
  return load()
    .enquiries.filter((e) => (!c.query.get('type') || e.type === c.query.get('type')) && (!c.query.get('status') || e.status === c.query.get('status')))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});
route('PATCH', '/enquiries/:id', (c) => {
  needActive(c, 'admin');
  const e = load().enquiries.find((x) => x.id === c.params.id) ?? fail(404, 'Enquiry not found.');
  if (c.body.status) e.status = c.body.status;
  return e;
});

/* ---------- entry point ---------- */
export async function demoRequest<T>(method: string, url: string, body: unknown, token?: string | null): Promise<T> {
  await new Promise((r) => setTimeout(r, 90 + Math.random() * 160));
  const u = new URL(url, 'http://demo.local');
  const parts = u.pathname.split('/').filter(Boolean);
  for (const r of routes) {
    if (r.method !== method || r.parts.length !== parts.length) continue;
    const params: Record<string, string> = {};
    let ok = true;
    for (let i = 0; i < r.parts.length && ok; i++) {
      if (r.parts[i].startsWith(':')) params[r.parts[i].slice(1)] = decodeURIComponent(parts[i]);
      else if (r.parts[i] !== parts[i]) ok = false;
    }
    if (!ok) continue;
    const result = await r.handler({ user: userFromToken(token), params, query: u.searchParams, body: (body ?? {}) as Record<string, any> });
    save();
    return structuredClone(result) as T;
  }
  throw new ApiError(404, `Not found: ${method} ${u.pathname}`);
}
