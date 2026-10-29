/** Domain types shared by the live API and the in-browser demo server. Keep in sync with the backend. */

export type Role = 'admin' | 'instructor' | 'student' | 'employer';
export type UserStatus = 'active' | 'pending' | 'disabled';

export interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: Role;
  status: UserStatus;
  enrollmentNo: string | null;
  batchId: string | null;
  tradeSlug: string | null;
  company: string | null;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface Batch {
  id: string;
  name: string;
  tradeSlug: string;
  session: string;
  year: number;
  instructorId: string | null;
  studentCount?: number;
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave';
export type MarkMethod = 'qr' | 'code' | 'manual';

export interface AttendanceSession {
  id: string;
  batchId: string;
  date: string;
  topic: string;
  startedAt: string;
  endsAt: string;
  status: 'open' | 'closed';
  createdBy: string;
  geofence: boolean;
  /** Only returned to staff. Used to compute rotating QR tokens. */
  secret?: string;
  presentCount?: number;
  totalCount?: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  method: MarkMethod;
  markedAt: string;
  distanceM: number | null;
  flagged: boolean;
}

export interface RosterRow {
  student: Pick<User, 'id' | 'name' | 'enrollmentNo'>;
  record: AttendanceRecord | null;
}

export interface AttendanceSummaryRow {
  student: Pick<User, 'id' | 'name' | 'enrollmentNo'>;
  present: number;
  late: number;
  absent: number;
  leave: number;
  total: number;
  pct: number;
}

export interface MyAttendance {
  overall: { present: number; late: number; absent: number; leave: number; total: number; pct: number };
  months: { month: string; present: number; total: number; pct: number }[];
  recent: { session: Pick<AttendanceSession, 'id' | 'date' | 'topic'>; status: AttendanceStatus | null }[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  /** Index of the correct option — omitted for students until submission. */
  correct?: number;
  explanation?: string;
  marks: number;
}

export type QuizStatus = 'draft' | 'published' | 'closed';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  tradeSlug: string | null;
  batchId: string | null;
  createdBy: string;
  durationMin: number;
  passPct: number;
  shuffle: boolean;
  showAnswers: boolean;
  attemptsAllowed: number;
  status: QuizStatus;
  questionCount: number;
  totalMarks: number;
  createdAt: string;
  questions?: Question[];
  /** Student view: own attempts summary. */
  myAttempts?: { id: string; percentage: number | null; submittedAt: string | null }[];
  attemptCount?: number;
  avgPct?: number | null;
}

export interface Attempt {
  id: string;
  quizId: string;
  studentId: string;
  startedAt: string;
  deadline: string;
  submittedAt: string | null;
  score: number | null;
  maxScore: number;
  percentage: number | null;
  passed: boolean | null;
  tabSwitches: number;
  answers: Record<string, number>;
}

export interface AttemptStart {
  attempt: Attempt;
  quiz: Pick<Quiz, 'id' | 'title' | 'durationMin' | 'passPct' | 'totalMarks'>;
  questions: Question[];
}

export interface AttemptResult {
  attempt: Attempt;
  quiz: Pick<Quiz, 'id' | 'title' | 'passPct' | 'showAnswers' | 'totalMarks'>;
  review: (Question & { chosen: number | null; isCorrect: boolean })[] | null;
  rank?: number;
  of?: number;
}

export interface QuizInsights {
  quiz: Quiz;
  attempts: (Attempt & { student: Pick<User, 'id' | 'name' | 'enrollmentNo'> })[];
  questionStats: { questionId: string; text: string; correctPct: number; answered: number }[];
  distribution: { bucket: string; count: number }[];
}

export type JobKind = 'job' | 'apprenticeship' | 'internship' | 'drive';
export type JobStatus = 'pending' | 'open' | 'closed' | 'rejected';
export type ApplicationStatus = 'applied' | 'shortlisted' | 'interview' | 'selected' | 'rejected' | 'withdrawn';

export interface Job {
  id: string;
  title: string;
  company: string;
  kind: JobKind;
  location: string;
  trades: string[];
  description: string;
  requirements: string;
  stipend: string;
  openings: number;
  lastDate: string;
  status: JobStatus;
  postedBy: string;
  createdAt: string;
  applicationCount?: number;
  myApplication?: { id: string; status: ApplicationStatus } | null;
}

export interface Profile {
  userId: string;
  headline: string;
  about: string;
  skills: string[];
  languages: string[];
  education: { title: string; institute: string; year: string; score: string }[];
  certifications: string[];
  projects: { title: string; description: string }[];
  address: string;
  dob: string;
  links: { label: string; url: string }[];
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  status: ApplicationStatus;
  coverNote: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  student?: Pick<User, 'id' | 'name' | 'enrollmentNo' | 'tradeSlug' | 'phone' | 'email'> & { profile?: Profile | null; attendancePct?: number | null };
}

export type EnquiryType = 'admission' | 'contact' | 'grievance' | 'industry';
export interface Enquiry {
  id: string;
  type: EnquiryType;
  name: string;
  phone: string;
  email: string;
  trade: string;
  subject: string;
  message: string;
  anonymous: boolean;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
}

export type CmsCollection = 'notices' | 'events' | 'gallery' | 'downloads' | 'staff';
export interface CmsItem<T = Record<string, unknown>> {
  id: string;
  collection: CmsCollection;
  data: T;
  status: 'published' | 'draft';
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  tickerEnabled: boolean;
  admissionOpen: boolean;
  admissionBanner_en: string;
  admissionBanner_mr: string;
  officeHours_en: string;
  officeHours_mr: string;
}

export interface Dashboard {
  role: Role;
  cards: { key: string; label: string; value: string | number; hint?: string }[];
  attendanceTrend?: { label: string; pct: number }[];
  upcomingQuizzes?: Quiz[];
  recentApplications?: Application[];
  openJobs?: Job[];
  todaySessions?: AttendanceSession[];
  pending?: { employers: number; jobs: number; enquiries: number };
  lowAttendance?: AttendanceSummaryRow[];
}

export interface Paged<T> {
  items: T[];
  total: number;
}
