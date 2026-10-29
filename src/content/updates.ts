import type { L } from '@/lib/i18n';

export type NoticeCategory = 'admission' | 'exam' | 'placement' | 'scholarship' | 'hostel' | 'general';

export const noticeCategories: { id: NoticeCategory; label: L }[] = [
  { id: 'admission', label: { en: 'Admissions', mr: 'प्रवेश' } },
  { id: 'exam', label: { en: 'Exams & results', mr: 'परीक्षा व निकाल' } },
  { id: 'placement', label: { en: 'Placement', mr: 'प्लेसमेंट' } },
  { id: 'scholarship', label: { en: 'Scholarships', mr: 'शिष्यवृत्ती' } },
  { id: 'hostel', label: { en: 'Hostel', mr: 'वसतिगृह' } },
  { id: 'general', label: { en: 'General', mr: 'सर्वसाधारण' } },
];

/** CMS-shaped notice. The admin portal manages these when a backend is connected. */
export type Notice = {
  id: string;
  date: string;
  category: NoticeCategory;
  pinned?: boolean;
  title: L;
  body: L;
  link?: string;
  linkLabel?: L;
};

/** Starter notices — informational and evergreen; replace from the admin portal. */
export const seedNotices: Notice[] = [
  {
    id: 'admission-process',
    date: '2026-10-15',
    category: 'admission',
    pinned: true,
    title: { en: 'Admissions 2027–28: how to apply through DVET’s online CAP', mr: 'प्रवेश २०२७–२८: व्य.शि.प्र.सं. च्या ऑनलाइन CAP द्वारे अर्ज कसा करावा' },
    body: {
      en: 'Admission to all trades is through the centralised online admission process of DVET, Maharashtra. Register on admission.dvet.gov.in, complete the application, and choose “Govt. ITI (Women), Thane” in your option form. The 2027–28 schedule will be announced by DVET — use the enquiry form on this website to get a callback.',
      mr: 'सर्व व्यवसायांचे प्रवेश व्य.शि.प्र.सं., महाराष्ट्र यांच्या केंद्रीभूत ऑनलाइन प्रवेश प्रक्रियेद्वारे होतात. admission.dvet.gov.in वर नोंदणी करून अर्ज पूर्ण करा व विकल्प अर्जात “शासकीय आय.टी.आय. (मुलींची), ठाणे” निवडा. २०२७–२८ चे वेळापत्रक संचालनालयाकडून जाहीर केले जाईल — कॉलबॅकसाठी या संकेतस्थळावरील चौकशी अर्ज भरा.',
    },
    link: 'https://admission.dvet.gov.in',
    linkLabel: { en: 'DVET admission portal', mr: 'प्रवेश पोर्टल' },
  },
  {
    id: 'schindler-scholarship',
    date: '2026-09-28',
    category: 'scholarship',
    title: { en: 'Schindler India scholarship — ₹5,000 for 60 trainees', mr: 'शिंडलर इंडिया शिष्यवृत्ती — ६० प्रशिक्षणार्थींना ₹५,०००' },
    body: {
      en: 'Every year 60 eligible and needy trainees receive a scholarship of ₹5,000 each from Schindler India Pvt. Ltd. Contact the institute office for eligibility and the documents required.',
      mr: 'दरवर्षी ६० पात्र व गरजू प्रशिक्षणार्थींना शिंडलर इंडिया प्रा. लि. कडून प्रत्येकी ₹५,००० शिष्यवृत्ती दिली जाते. पात्रता व आवश्यक कागदपत्रांसाठी संस्था कार्यालयाशी संपर्क साधा.',
    },
  },
  {
    id: 'apprenticeship-portal',
    date: '2026-09-10',
    category: 'placement',
    title: { en: 'Register on the Apprenticeship India portal', mr: 'अप्रेंटिसशिप इंडिया पोर्टलवर नोंदणी करा' },
    body: {
      en: 'Final-year and passed-out trainees should create a profile on apprenticeshipindia.gov.in to apply for apprenticeship openings. Our placement cell will help you complete registration and upload documents.',
      mr: 'अंतिम वर्षातील व उत्तीर्ण प्रशिक्षणार्थींनी शिकाऊ उमेदवारीच्या संधींसाठी apprenticeshipindia.gov.in वर प्रोफाइल तयार करावे. नोंदणी व कागदपत्रे अपलोड करण्यासाठी प्लेसमेंट विभाग मदत करेल.',
    },
    link: 'https://www.apprenticeshipindia.gov.in',
    linkLabel: { en: 'Apprenticeship India', mr: 'अप्रेंटिसशिप इंडिया' },
  },
  {
    id: 'grievance-online',
    date: '2026-08-20',
    category: 'general',
    title: { en: 'Grievances can now be submitted online', mr: 'तक्रारी आता ऑनलाइन नोंदवता येतील' },
    body: {
      en: 'Trainees, parents and members of the public can submit grievances through this website or the official DVET grievance form. Complaints related to women’s safety are handled confidentially by the Internal Complaints Committee.',
      mr: 'प्रशिक्षणार्थी, पालक व नागरिक या संकेतस्थळावरून किंवा अधिकृत तक्रार अर्जाद्वारे तक्रार नोंदवू शकतात. महिलांच्या सुरक्षेशी संबंधित तक्रारींची अंतर्गत तक्रार समितीमार्फत गोपनीय दखल घेतली जाते.',
    },
  },
  {
    id: 'hostel-st',
    date: '2026-07-25',
    category: 'hostel',
    title: { en: 'Hostel accommodation for Scheduled Tribe trainees', mr: 'अनुसूचित जमातीच्या प्रशिक्षणार्थींसाठी वसतिगृह' },
    body: {
      en: 'Hostel accommodation is available on campus for Scheduled Tribe trainees, with an allowance of ₹600 per month for residents. Apply at the office after confirming your admission.',
      mr: 'अनुसूचित जमातीच्या प्रशिक्षणार्थींसाठी परिसरात वसतिगृहाची सोय असून निवासी प्रशिक्षणार्थींना दरमहा ₹६०० भत्ता दिला जातो. प्रवेश निश्चित झाल्यानंतर कार्यालयात अर्ज करा.',
    },
  },
  {
    id: 'ncvt-certificate',
    date: '2026-07-05',
    category: 'exam',
    title: { en: 'Download and verify your NCVT e-certificate', mr: 'NCVT ई-प्रमाणपत्र डाउनलोड व पडताळणी' },
    body: {
      en: 'Passed-out trainees can download and verify NCVT e-certificates and mark sheets online from the NCVT MIS / Skill India Digital portal using their roll number.',
      mr: 'उत्तीर्ण प्रशिक्षणार्थी आपल्या रोल क्रमांकाद्वारे NCVT MIS / स्किल इंडिया डिजिटल पोर्टलवरून NCVT ई-प्रमाणपत्र व गुणपत्रिका डाउनलोड व पडताळू शकतात.',
    },
    link: 'https://ncvtmis.gov.in',
    linkLabel: { en: 'NCVT MIS', mr: 'NCVT MIS' },
  },
];

export type DownloadItem = { title: L; desc: L; url: string; kind: 'pdf' | 'link' | 'form'; group: 'admission' | 'curriculum' | 'forms' | 'portals' };

export const downloads: DownloadItem[] = [
  { group: 'admission', kind: 'link', url: 'https://admission.dvet.gov.in', title: { en: 'DVET online admission portal', mr: 'व्य.शि.प्र.सं. ऑनलाइन प्रवेश पोर्टल' }, desc: { en: 'Registration, application, option form and CAP allotment lists.', mr: 'नोंदणी, अर्ज, विकल्प अर्ज व CAP वाटप याद्या.' } },
  { group: 'admission', kind: 'pdf', url: 'https://mumbai.dvet.gov.in/wp-content/uploads/sites/4/2021/06/ITI-Courses.pdf', title: { en: 'ITI courses — DVET Mumbai region', mr: 'आय.टी.आय. अभ्यासक्रम — मुंबई विभाग' }, desc: { en: 'Trades offered across the region (PDF, DVET).', mr: 'विभागातील व्यवसायांची माहिती (PDF).' } },
  { group: 'curriculum', kind: 'pdf', url: 'https://www.cstaricalcutta.gov.in/sites/default/files/2026-06/Technician%20Medical%20Electronics_CTS3.0_NSQF-4.pdf', title: { en: 'Technician Medical Electronics — CTS curriculum', mr: 'टेक्निशियन मेडिकल इलेक्ट्रॉनिक्स — अभ्यासक्रम' }, desc: { en: 'Official DGT/CSTARI syllabus (PDF).', mr: 'अधिकृत DGT/CSTARI अभ्यासक्रम (PDF).' } },
  { group: 'curriculum', kind: 'pdf', url: 'https://www.dgt.gov.in/sites/default/files/2024-12/Cosmetology_CTS2.0_NSQF-3.5.pdf', title: { en: 'Cosmetology — CTS curriculum', mr: 'कॉस्मेटोलॉजी — अभ्यासक्रम' }, desc: { en: 'Official DGT syllabus (PDF).', mr: 'अधिकृत DGT अभ्यासक्रम (PDF).' } },
  { group: 'curriculum', kind: 'link', url: 'https://www.cstaricalcutta.gov.in', title: { en: 'All CTS trade curricula (CSTARI)', mr: 'सर्व व्यवसायांचे अभ्यासक्रम (CSTARI)' }, desc: { en: 'Central Staff Training & Research Institute — curricula for every trade.', mr: 'केंद्रीय कर्मचारी प्रशिक्षण व संशोधन संस्था — सर्व व्यवसायांचे अभ्यासक्रम.' } },
  { group: 'forms', kind: 'form', url: 'https://forms.gle/Mo4vbJQ6oJmMq6Vb6', title: { en: 'Grievance form (official)', mr: 'तक्रार अर्ज (अधिकृत)' }, desc: { en: 'Online grievance form published on the DVET institute page.', mr: 'संचालनालयाच्या संस्था पानावरील ऑनलाइन तक्रार अर्ज.' } },
  { group: 'portals', kind: 'link', url: 'https://www.apprenticeshipindia.gov.in', title: { en: 'Apprenticeship India', mr: 'अप्रेंटिसशिप इंडिया' }, desc: { en: 'Register and apply for apprenticeships.', mr: 'शिकाऊ उमेदवारीसाठी नोंदणी व अर्ज.' } },
  { group: 'portals', kind: 'link', url: 'https://ncvtmis.gov.in', title: { en: 'NCVT MIS — certificates', mr: 'NCVT MIS — प्रमाणपत्रे' }, desc: { en: 'Trainee profile, e-certificates and verification.', mr: 'प्रशिक्षणार्थी प्रोफाइल, ई-प्रमाणपत्रे व पडताळणी.' } },
  { group: 'portals', kind: 'link', url: 'https://mahadbt.maharashtra.gov.in', title: { en: 'MahaDBT scholarships', mr: 'महाडीबीटी शिष्यवृत्ती' }, desc: { en: 'State scholarship and fee-reimbursement applications.', mr: 'राज्य शिष्यवृत्ती व शुल्क प्रतिपूर्ती अर्ज.' } },
];

export const officialLinks: { label: L; url: string }[] = [
  { label: { en: 'DVET Maharashtra', mr: 'व्य.शि.प्र.सं. महाराष्ट्र' }, url: 'https://dvet.gov.in' },
  { label: { en: 'DVET admissions', mr: 'आय.टी.आय. प्रवेश' }, url: 'https://admission.dvet.gov.in' },
  { label: { en: 'DVET Mumbai region', mr: 'व्य.शि.प्र.सं. मुंबई विभाग' }, url: 'https://mumbai.dvet.gov.in' },
  { label: { en: 'Directorate General of Training', mr: 'प्रशिक्षण महासंचालनालय (DGT)' }, url: 'https://dgt.gov.in' },
  { label: { en: 'Skill India Digital Hub', mr: 'स्किल इंडिया डिजिटल' }, url: 'https://www.skillindiadigital.gov.in' },
  { label: { en: 'Apprenticeship India', mr: 'अप्रेंटिसशिप इंडिया' }, url: 'https://www.apprenticeshipindia.gov.in' },
  { label: { en: 'National Career Service', mr: 'राष्ट्रीय करिअर सेवा' }, url: 'https://www.ncs.gov.in' },
  { label: { en: 'Government of Maharashtra', mr: 'महाराष्ट्र शासन' }, url: 'https://maharashtra.gov.in' },
];

export const helplines: { number: string; label: L }[] = [
  { number: '112', label: { en: 'Emergency', mr: 'आपत्कालीन' } },
  { number: '1091', label: { en: 'Women in distress (Police)', mr: 'महिला हेल्पलाइन (पोलीस)' } },
  { number: '181', label: { en: 'Women helpline', mr: 'महिला हेल्पलाइन' } },
  { number: '1930', label: { en: 'Cyber crime', mr: 'सायबर गुन्हे' } },
];
