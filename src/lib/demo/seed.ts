import type { Application, AttendanceRecord, AttendanceSession, Attempt, Batch, Enquiry, Job, Profile, Question, Quiz, User } from '@/lib/types';
import { localDay } from '@/lib/dates';

/** Deterministic PRNG so every visitor sees the same believable demo data. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type DemoUser = User & { password: string };
export type DemoSession = AttendanceSession & { secret: string };
export type DemoQuiz = Omit<Quiz, 'questions' | 'questionCount' | 'totalMarks'> & { questions: Question[] };
export type DemoAttempt = Attempt & { layout: Record<string, number[]>; order: string[] };
export type DemoRecord = AttendanceRecord & { deviceId: string | null };

export type DemoDB = {
  version: number;
  seededAt: string;
  users: DemoUser[];
  batches: Batch[];
  sessions: DemoSession[];
  records: DemoRecord[];
  quizzes: DemoQuiz[];
  attempts: DemoAttempt[];
  jobs: Job[];
  applications: Application[];
  profiles: Profile[];
  enquiries: Enquiry[];
};

export { DEMO_ACCOUNTS, DEMO_PASSWORD } from './accounts';
import { DEMO_PASSWORD } from './accounts';

const iso = (d: Date) => d.toISOString();
const day = (d: Date) => localDay(d);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);
const at = (d: Date, h: number, m: number) => {
  const x = new Date(d);
  x.setHours(h, m, 0, 0);
  return x;
};

const q = (id: string, text: string, options: string[], correct: number, explanation: string, marks = 1): Question => ({ id, text, options, correct, explanation, marks });

const QUESTIONS = {
  safety: [
    q('s1', 'The SI unit of electrical resistance is the…', ['Volt', 'Ampere', 'Ohm', 'Watt'], 2, 'Resistance is measured in ohms (Ω).'),
    q('s2', 'According to Ohm’s law, voltage V equals…', ['I × R', 'I ÷ R', 'R ÷ I', 'I² × R'], 0, 'V = I × R, where I is current and R is resistance.'),
    q('s3', 'A 230 V lamp draws 0.5 A. What is its power?', ['46 W', '115 W', '230 W', '460 W'], 1, 'P = V × I = 230 × 0.5 = 115 W.'),
    q('s4', 'Which instrument is used to measure current?', ['Voltmeter', 'Ammeter', 'Ohmmeter', 'Wattmeter'], 1, 'An ammeter measures current in amperes.'),
    q('s5', 'An ammeter is always connected ____ with the load.', ['in series', 'in parallel', 'either way', 'across the supply'], 0, 'Current is the same through series elements, so the ammeter goes in series.'),
    q('s6', 'The protective earth conductor in Indian wiring is coloured…', ['Red', 'Black', 'Green (or green-yellow)', 'Blue'], 2, 'Earth conductors are identified by green or green-and-yellow insulation.'),
    q('s7', 'Someone is receiving an electric shock. What should you do first?', ['Pull them away with bare hands', 'Switch off the supply or separate them with a dry insulating object', 'Pour water on them', 'Give them water to drink'], 1, 'Never touch the victim directly — first cut the supply or use dry wood/plastic.'),
    q('s8', 'A fuse protects a circuit against…', ['low voltage', 'over-current and short circuits', 'lightning only', 'power-factor changes'], 1, 'The fuse element melts when current exceeds its rating.'),
    q('s9', 'Which extinguisher is safe for fires in live electrical equipment?', ['Water', 'Soda-acid', 'CO₂', 'Foam'], 2, 'CO₂ (or dry powder) does not conduct electricity; water and foam do.'),
    q('s10', 'The frequency of the AC mains supply in India is…', ['50 Hz', '60 Hz', '100 Hz', '25 Hz'], 0, 'India uses a 230 V, 50 Hz supply.'),
  ],
  computer: [
    q('c1', 'Which of these is an input device?', ['Monitor', 'Printer', 'Keyboard', 'Speaker'], 2, 'A keyboard sends data into the computer.'),
    q('c2', 'One kilobyte (KB) is traditionally equal to…', ['1,000 bits', '1,024 bytes', '1,024 bits', '100 bytes'], 1, 'In the binary convention, 1 KB = 2¹⁰ = 1,024 bytes.'),
    q('c3', 'Which part is called the “brain” of the computer?', ['RAM', 'Hard disk', 'CPU', 'SMPS'], 2, 'The CPU carries out instructions and calculations.'),
    q('c4', 'The Windows shortcut to copy selected text is…', ['Ctrl + V', 'Ctrl + C', 'Ctrl + X', 'Ctrl + Z'], 1, 'Ctrl + C copies; Ctrl + V pastes; Ctrl + X cuts.'),
    q('c5', 'RAM is a ____ memory.', ['permanent', 'volatile', 'read-only', 'optical'], 1, 'RAM loses its contents when power is switched off.'),
    q('c6', 'Which HTML tag creates a hyperlink?', ['<link>', '<a>', '<href>', '<p>'], 1, 'The anchor tag <a href="…"> creates a link.'),
    q('c7', 'A spreadsheet formula always begins with…', ['#', '=', '@', '$'], 1, 'Formulas start with = , for example =SUM(A1:A5).'),
    q('c8', 'Which of these is an operating system?', ['MS Excel', 'Linux', 'Photoshop', 'Notepad'], 1, 'Linux is an operating system; the others are applications.'),
    q('c9', '“www” in a web address stands for…', ['World Wide Web', 'World Web Wide', 'Wide World Web', 'Web World Wide'], 0, 'www = World Wide Web.'),
    q('c10', 'A strong password should…', ['be your date of birth', 'mix letters, numbers and symbols', 'be the same everywhere', 'be shared with a friend'], 1, 'Long passwords mixing character types are hardest to guess.'),
  ],
  salon: [
    q('h1', 'Combs and scissors should be ____ after every client.', ['rinsed with water only', 'cleaned and disinfected', 'wiped with a towel', 'left to air-dry'], 1, 'Cleaning removes debris; disinfecting kills germs.'),
    q('h2', 'A patch (skin allergy) test is done before…', ['shampooing', 'hair colouring and chemical services', 'a haircut', 'blow-drying'], 1, 'Dyes can cause allergic reactions, so they are patch-tested first.'),
    q('h3', 'A patch test is usually done how long before the service?', ['5 minutes', '1 hour', '24–48 hours', '1 week'], 2, 'Reactions can take up to 48 hours to appear.'),
    q('h4', 'Which skin type has enlarged pores and a shiny T-zone?', ['Dry', 'Oily', 'Normal', 'Sensitive'], 1, 'Excess sebum makes oily skin shiny with visible pores.'),
    q('h5', 'Healthy skin is slightly…', ['acidic (about pH 4.5–5.5)', 'neutral (pH 7)', 'alkaline (pH 9)', 'strongly alkaline (pH 12)'], 0, 'The skin’s acid mantle protects against bacteria.'),
    q('h6', 'Disposable items such as cotton and spatulas should be…', ['washed and reused', 'used once and discarded', 'kept for the same client', 'sterilised and reused'], 1, 'Single-use items prevent cross-infection.'),
    q('h7', 'Electrical equipment like hair dryers must be kept away from…', ['mirrors', 'water', 'chairs', 'brushes'], 1, 'Water near electrical equipment can cause shocks.'),
    q('h8', 'When should a cosmetologist wash her hands?', ['Only at the start of the day', 'Before and after every client', 'Only after lunch', 'Once a week'], 1, 'Hand hygiene between clients is the most effective infection control.'),
  ],
  ohm: [
    q('o1', 'A 10 Ω resistor carries 2 A. The voltage across it is…', ['5 V', '12 V', '20 V', '0.2 V'], 2, 'V = I × R = 2 × 10 = 20 V.'),
    q('o2', 'Two 6 Ω resistors in series give a total of…', ['3 Ω', '6 Ω', '12 Ω', '36 Ω'], 2, 'Series resistances add: 6 + 6 = 12 Ω.'),
    q('o3', 'Two 6 Ω resistors in parallel give a total of…', ['3 Ω', '6 Ω', '12 Ω', '36 Ω'], 0, 'Equal resistors in parallel: R ÷ n = 6 ÷ 2 = 3 Ω.'),
    q('o4', 'If voltage doubles and resistance stays the same, the current…', ['halves', 'doubles', 'stays the same', 'becomes zero'], 1, 'I = V ÷ R, so current is proportional to voltage.'),
    q('o5', 'Power in a 4 Ω resistor carrying 3 A is…', ['12 W', '36 W', '7 W', '1.33 W'], 1, 'P = I² × R = 9 × 4 = 36 W.'),
  ],
};

const TOPICS: Record<string, string[]> = {
  electrician: ['Safety & first aid', 'Electrical symbols', 'Wire joints & soldering', 'Wiring accessories', 'Series & parallel circuits', 'Earthing practice', 'Measuring instruments', 'PVC conduit wiring', 'DC machines', 'Transformer basics', 'Motor starters', 'Control panel wiring', 'Solar PV basics', 'Batteries & charging', 'Fault finding'],
  copa: ['Computer components', 'Windows basics', 'File management', 'Word processing', 'Spreadsheet formulas', 'Charts & graphs', 'Presentations', 'Internet & email', 'HTML basics', 'CSS styling', 'JavaScript intro', 'Database basics', 'Cyber safety', 'Typing practice', 'E-governance services'],
  cosmetology: ['Salon hygiene', 'Skin analysis', 'Basic facial', 'Clean-up', 'Manicure', 'Pedicure', 'Threading', 'Waxing', 'Hair-care basics', 'Basic haircut', 'Blow-dry & styling', 'Hair-colour theory', 'Makeup base', 'Bridal makeup', 'Client handling'],
};

const STUDENTS: Record<string, string[]> = {
  electrician: ['Priya Shinde', 'Sneha Jadhav', 'Aarti Bhosale', 'Pooja Gaikwad', 'Komal Shelar', 'Shraddha More', 'Neha Chavan', 'Rutuja Thakur'],
  copa: ['Kavya Naik', 'Tejal Mhatre', 'Sakshi Gharat', 'Divya Raut', 'Mansi Bhoir', 'Siddhi Ghadge', 'Ankita Wagh', 'Prachi Kamble'],
  cosmetology: ['Vaishnavi Shirke', 'Dipali Jagtap', 'Shruti Lokhande', 'Sayali Pathare', 'Bhakti Sawant', 'Nikita Dalvi', 'Harshada Mali', 'Pranali Kale'],
};

export function buildSeed(now = new Date()): DemoDB {
  const rand = mulberry32(20260729);
  const created = iso(addDays(now, -120));
  const base = { email: null, phone: null, enrollmentNo: null, batchId: null, tradeSlug: null, company: null, mustChangePassword: false, createdAt: created, password: DEMO_PASSWORD, status: 'active' as const };

  const users: DemoUser[] = [
    { ...base, id: 'u-admin', name: 'Sunita Rane', role: 'admin', email: 'admin@demo.itithane.in', phone: '9000000001' },
    { ...base, id: 'u-ins-ele', name: 'Anjali Deshpande', role: 'instructor', email: 'instructor@demo.itithane.in', phone: '9000000002', tradeSlug: 'electrician' },
    { ...base, id: 'u-ins-copa', name: 'Rohini Joshi', role: 'instructor', email: 'copa.instructor@demo.itithane.in', phone: '9000000003', tradeSlug: 'copa' },
    { ...base, id: 'u-ins-cos', name: 'Swati Ranade', role: 'instructor', email: 'cosmetology.instructor@demo.itithane.in', phone: '9000000004', tradeSlug: 'cosmetology' },
    { ...base, id: 'u-emp-konkan', name: 'Rahul Mehta', role: 'employer', email: 'hr@konkanpower.demo', phone: '9000000010', company: 'Konkan Power Systems (Demo)' },
    { ...base, id: 'u-emp-sahyadri', name: 'Farah Shaikh', role: 'employer', email: 'talent@sahyadri.demo', phone: '9000000011', company: 'Sahyadri Electronics (Demo)' },
    { ...base, id: 'u-emp-vastra', name: 'Kiran Rao', role: 'employer', email: 'jobs@vastra.demo', phone: '9000000012', company: 'Vastra Apparel Studio (Demo)', status: 'pending' },
  ];

  const batches: Batch[] = [
    { id: 'b-ele', name: 'Electrician · 2025–27 · Unit 1', tradeSlug: 'electrician', session: '2025–27', year: 2, instructorId: 'u-ins-ele' },
    { id: 'b-copa', name: 'COPA · 2026–27 · Unit 1', tradeSlug: 'copa', session: '2026–27', year: 1, instructorId: 'u-ins-copa' },
    { id: 'b-cos', name: 'Cosmetology · 2026–27 · Unit 1', tradeSlug: 'cosmetology', session: '2026–27', year: 1, instructorId: 'u-ins-cos' },
  ];

  const codes: Record<string, string> = { electrician: 'ELE', copa: 'COPA', cosmetology: 'COS' };
  const attendanceBias: Record<string, number> = {};
  for (const b of batches) {
    STUDENTS[b.tradeSlug].forEach((name, i) => {
      const id = `u-st-${codes[b.tradeSlug].toLowerCase()}-${i + 1}`;
      const first = name.split(' ')[0].toLowerCase();
      users.push({
        ...base,
        id,
        name,
        role: 'student',
        email: id === 'u-st-ele-1' ? 'priya@demo.itithane.in' : `${first}.${codes[b.tradeSlug].toLowerCase()}@demo.itithane.in`,
        phone: `90000${String(20000 + batches.indexOf(b) * 100 + i + 1)}`,
        enrollmentNo: `ITI${b.session.slice(2, 4)}${codes[b.tradeSlug]}${String(i + 1).padStart(3, '0')}`,
        batchId: b.id,
        tradeSlug: b.tradeSlug,
      });
      // One defaulter and one borderline trainee per batch make the alerts meaningful.
      attendanceBias[id] = i === 5 ? 0.66 : i === 3 ? 0.79 : 0.86 + rand() * 0.11;
    });
  }
  // Pending self-registration awaiting approval
  users.push({ ...base, id: 'u-st-pending', name: 'Gauri Patankar', role: 'student', email: 'gauri@demo.itithane.in', phone: '9000029999', tradeSlug: 'copa', status: 'pending' });

  // ---------- Attendance: 6 weeks of weekday sessions ----------
  const sessions: DemoSession[] = [];
  const records: DemoRecord[] = [];
  let d = addDays(now, -42);
  let n = 0;
  while (d < addDays(now, 0)) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6 && day(d) !== day(now)) {
      for (const b of batches) {
        n++;
        const start = at(d, 9, 30);
        const sid = `s-${b.id}-${day(d)}`;
        const topics = TOPICS[b.tradeSlug];
        sessions.push({ id: sid, batchId: b.id, date: day(d), topic: topics[n % topics.length], startedAt: iso(start), endsAt: iso(at(d, 10, 0)), status: 'closed', createdBy: b.instructorId!, geofence: true, secret: `seed-${sid}` });
        for (const u of users.filter((x) => x.batchId === b.id && x.role === 'student')) {
          const r = rand();
          const bias = attendanceBias[u.id];
          const status = r < bias ? (rand() < 0.07 ? 'late' : 'present') : rand() < 0.25 ? 'leave' : 'absent';
          records.push({
            id: `r-${sid}-${u.id}`,
            sessionId: sid,
            studentId: u.id,
            status,
            method: status === 'present' || status === 'late' ? (rand() < 0.8 ? 'qr' : 'code') : 'manual',
            markedAt: iso(new Date(start.getTime() + (status === 'late' ? 14 : 2 + Math.floor(rand() * 6)) * 60_000)),
            distanceM: status === 'present' || status === 'late' ? Math.round(20 + rand() * 120) : null,
            flagged: false,
            deviceId: null,
          });
        }
      }
    }
    d = addDays(d, 1);
  }

  // ---------- Quizzes ----------
  const quizBase = { description: '', batchId: null, shuffle: true, showAnswers: true, attemptsAllowed: 2, createdAt: iso(addDays(now, -20)) };
  const quizzes: DemoQuiz[] = [
    { ...quizBase, id: 'q-safety', title: 'Electrical Safety & Basics', description: 'Workshop safety, Ohm’s law and measuring instruments — revise before the practical exam.', tradeSlug: 'electrician', batchId: 'b-ele', createdBy: 'u-ins-ele', durationMin: 10, passPct: 60, status: 'published', questions: QUESTIONS.safety },
    { ...quizBase, id: 'q-computer', title: 'Computer Fundamentals', description: 'Hardware, memory, shortcuts and web basics.', tradeSlug: 'copa', batchId: 'b-copa', createdBy: 'u-ins-copa', durationMin: 12, passPct: 60, status: 'published', questions: QUESTIONS.computer },
    { ...quizBase, id: 'q-salon', title: 'Salon Hygiene & Safety', description: 'Sanitation, patch tests and skin types.', tradeSlug: 'cosmetology', batchId: 'b-cos', createdBy: 'u-ins-cos', durationMin: 8, passPct: 60, status: 'published', questions: QUESTIONS.salon },
    { ...quizBase, id: 'q-ohm', title: 'Ohm’s Law Practice Set', description: 'Quick numericals on V = IR, series and parallel circuits.', tradeSlug: 'electrician', batchId: 'b-ele', createdBy: 'u-ins-ele', durationMin: 6, passPct: 60, status: 'draft', questions: QUESTIONS.ohm },
  ];

  const attempts: DemoAttempt[] = [];
  for (const quiz of quizzes.filter((x) => x.status === 'published')) {
    const takers = users.filter((u) => u.batchId === quiz.batchId && u.role === 'student' && u.id !== 'u-st-ele-1');
    takers.slice(0, 6).forEach((u, i) => {
      const answers: Record<string, number> = {};
      const skill = 0.45 + rand() * 0.5;
      let score = 0;
      for (const qq of quiz.questions) {
        const right = rand() < skill;
        answers[qq.id] = right ? qq.correct! : (qq.correct! + 1 + Math.floor(rand() * 3)) % qq.options.length;
        if (right) score += qq.marks;
      }
      const max = quiz.questions.reduce((s, x) => s + x.marks, 0);
      const started = addDays(now, -(10 - i));
      const percentage = Math.round((score / max) * 1000) / 10;
      const identity = Object.fromEntries(quiz.questions.map((x) => [x.id, x.options.map((_, k) => k)]));
      attempts.push({ id: `a-${quiz.id}-${u.id}`, quizId: quiz.id, studentId: u.id, startedAt: iso(started), deadline: iso(new Date(started.getTime() + quiz.durationMin * 60_000)), submittedAt: iso(new Date(started.getTime() + (4 + i) * 60_000)), score, maxScore: max, percentage, passed: percentage >= quiz.passPct, tabSwitches: i === 4 ? 3 : 0, answers, layout: identity, order: quiz.questions.map((x) => x.id) });
    });
  }

  // ---------- Jobs & applications ----------
  const job = (j: Partial<Job> & Pick<Job, 'id' | 'title' | 'company' | 'kind' | 'trades' | 'postedBy'>): Job => ({ location: 'Thane', description: '', requirements: '', stipend: '', openings: 2, lastDate: day(addDays(now, 21)), status: 'open', createdAt: iso(addDays(now, -6)), ...j });
  const jobs: Job[] = [
    job({ id: 'j-konkan-app', title: 'Apprentice — Electrician', company: 'Konkan Power Systems (Demo)', kind: 'apprenticeship', trades: ['electrician'], postedBy: 'u-emp-konkan', location: 'Wagle Estate, Thane', openings: 6, stipend: 'As per Apprentices Act norms', description: 'One-year apprenticeship in panel assembly, cable termination and preventive maintenance of LT switchgear at our Thane plant.', requirements: 'ITI Electrician (pass-out or final semester). Basic multimeter use. Willingness to work in shifts.', lastDate: day(addDays(now, 18)) }),
    job({ id: 'j-sahyadri-tech', title: 'Electronics Assembly & Test Technician', company: 'Sahyadri Electronics (Demo)', kind: 'job', trades: ['electronics-mechanic', 'iot-technician', 'technician-medical-electronics'], postedBy: 'u-emp-sahyadri', location: 'MIDC Thane', openings: 4, stipend: '₹14,000–16,000 per month', description: 'Assemble and test PCB modules for industrial controllers. On-the-job training on automated test benches.', requirements: 'ITI Electronics Mechanic / IoT / TME. Soldering skills. Good eyesight for fine work.', lastDate: day(addDays(now, 25)) }),
    job({ id: 'j-civic-copa', title: 'Computer Operator', company: 'Thane Citizen Services Centre (Demo)', kind: 'job', trades: ['copa', 'secretarial-practice'], postedBy: 'u-admin', location: 'Thane (West)', openings: 3, stipend: '₹12,000 per month', description: 'Data entry and document processing for citizen-service applications. Day shift, 6 days a week.', requirements: 'COPA or Secretarial Practice. Typing speed 30+ wpm. Basic Marathi typing preferred.', lastDate: day(addDays(now, 12)) }),
    job({ id: 'j-glow-stylist', title: 'Junior Stylist (Trainee)', company: 'Glow Salon Academy (Demo)', kind: 'internship', trades: ['cosmetology'], postedBy: 'u-admin', location: 'Naupada, Thane', openings: 2, stipend: '₹8,000 stipend + incentives', description: 'Three-month paid internship leading to a stylist role. Hair, skin and makeup services under senior stylists.', requirements: 'Cosmetology trainee or pass-out. Good communication with clients.', lastDate: day(addDays(now, 30)) }),
    job({ id: 'j-medequip-drive', title: 'Campus Drive — Biomedical Service Technician', company: 'MedEquip Services (Demo)', kind: 'drive', trades: ['technician-medical-electronics', 'electronics-mechanic'], postedBy: 'u-admin', location: 'On campus — AV room', openings: 5, stipend: '₹15,000 per month + travel allowance', description: 'Written test followed by interviews on campus. Bring your resume, mark sheets and ID proof.', requirements: 'TME or Electronics Mechanic (final year / pass-out).', lastDate: day(addDays(now, 9)) }),
    job({ id: 'j-vastra-sewing', title: 'Sewing Machine Operator', company: 'Vastra Apparel Studio (Demo)', kind: 'job', trades: ['sewing-technology', 'fashion-design-technology'], postedBy: 'u-emp-vastra', location: 'Bhiwandi', openings: 8, stipend: '₹11,000 per month', description: 'Operate single-needle lock-stitch machines for women’s ethnic wear.', requirements: 'Sewing Technology / FDT.', status: 'pending', createdAt: iso(addDays(now, -1)) }),
  ];

  const ts = (n: number) => iso(addDays(now, -n));
  const applications: Application[] = [
    { id: 'ap-1', jobId: 'j-konkan-app', studentId: 'u-st-ele-1', status: 'shortlisted', coverNote: 'I enjoyed panel wiring practicals and would like to learn switchgear maintenance.', note: 'Shortlisted for interview on campus.', createdAt: ts(5), updatedAt: ts(2) },
    { id: 'ap-2', jobId: 'j-konkan-app', studentId: 'u-st-ele-2', status: 'applied', coverNote: '', note: '', createdAt: ts(4), updatedAt: ts(4) },
    { id: 'ap-3', jobId: 'j-konkan-app', studentId: 'u-st-ele-3', status: 'interview', coverNote: 'I live near Wagle Estate and can join immediately.', note: 'Interview scheduled.', createdAt: ts(4), updatedAt: ts(1) },
    { id: 'ap-4', jobId: 'j-civic-copa', studentId: 'u-st-copa-1', status: 'selected', coverNote: '', note: 'Offer letter issued.', createdAt: ts(6), updatedAt: ts(1) },
    { id: 'ap-5', jobId: 'j-glow-stylist', studentId: 'u-st-cos-2', status: 'applied', coverNote: '', note: '', createdAt: ts(2), updatedAt: ts(2) },
    { id: 'ap-6', jobId: 'j-sahyadri-tech', studentId: 'u-st-ele-1', status: 'applied', coverNote: '', note: '', createdAt: ts(1), updatedAt: ts(1) },
  ];

  const profiles: Profile[] = [
    {
      userId: 'u-st-ele-1',
      headline: 'Electrician trainee · Wiring, panels & solar PV',
      about: 'Second-year Electrician trainee at Govt. ITI (Women), Thane. Completed on-the-job training at Tata Power. Interested in switchgear maintenance and solar installations.',
      skills: ['Domestic & industrial wiring', 'Control panel wiring', 'Motor starters', 'Solar PV installation', 'Multimeter & megger', 'Electrical safety'],
      languages: ['Marathi', 'Hindi', 'English'],
      education: [
        { title: 'ITI — Electrician (NCVT)', institute: 'Govt. ITI (Women), Thane', year: '2025–2027', score: 'Pursuing' },
        { title: 'SSC (10th)', institute: 'Maharashtra State Board', year: '2025', score: '78%' },
      ],
      certifications: ['On-the-job training — Tata Power (15 days)', 'Udyam entrepreneurship programme'],
      projects: [{ title: 'Automatic street-light controller', description: 'LDR-based switching circuit with relay and timer, built for the technical exhibition.' }],
      address: 'Kopri, Thane (East)',
      dob: '2009-03-14',
      links: [],
      updatedAt: ts(3),
    },
  ];

  const enquiries: Enquiry[] = [
    { id: 'e-1', type: 'admission', name: 'Sunita Pawar', phone: '9000090001', email: '', trade: 'electrician', subject: '10th pass (Science & Maths)', message: 'My daughter scored 72% in SSC. Is Electrician a good option and when do admissions open?', anonymous: false, status: 'new', createdAt: ts(1) },
    { id: 'e-2', type: 'admission', name: 'Rekha Gawde', phone: '9000090002', email: '', trade: 'cosmetology', subject: '12th pass or above', message: 'Is there an age limit for Cosmetology?', anonymous: false, status: 'in-progress', createdAt: ts(3) },
    { id: 'e-3', type: 'industry', name: 'Amit Kulthe', phone: '9000090003', email: 'csr@example.com', trade: 'Example Industries (Demo)', subject: 'CSR / lab partnership', message: 'We would like to discuss sponsoring equipment for the IoT lab.', anonymous: false, status: 'new', createdAt: ts(2) },
    { id: 'e-4', type: 'grievance', name: '', phone: '', email: '', trade: '', subject: 'Facilities / infrastructure', message: 'The water purifier on the second floor needs servicing.', anonymous: true, status: 'resolved', createdAt: ts(8) },
  ];

  return { version: 4, seededAt: iso(now), users, batches, sessions, records, quizzes, attempts, jobs, applications, profiles, enquiries };
}
