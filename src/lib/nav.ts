import type { L } from '@/lib/i18n';
import { trades } from '@/content/trades';

export type NavLink = { label: L; path: string; desc?: L; icon?: string };
export type NavGroup = { id: string; label: L; path?: string; links?: NavLink[]; columns?: { title: L; links: NavLink[] }[] };

const tradeLinks = (type: 'engineering' | 'non-engineering'): NavLink[] =>
  trades.filter((t) => t.type === type).map((t) => ({ label: t.short ?? t.name, path: `/trades/${t.slug}/`, icon: t.icon }));

export const mainNav: NavGroup[] = [
  {
    id: 'about',
    label: { en: 'About', mr: 'संस्थेविषयी' },
    links: [
      { label: { en: 'Institute profile', mr: 'संस्था परिचय' }, path: '/about/', icon: 'Landmark', desc: { en: 'History, vision and key facts', mr: 'इतिहास, ध्येय व महत्त्वाची माहिती' } },
      { label: { en: 'Principal’s message', mr: 'प्राचार्यांचे मनोगत' }, path: '/about/#principal', icon: 'Quote', desc: { en: 'A word from the Principal', mr: 'प्राचार्यांचा संदेश' } },
      { label: { en: 'Faculty & staff', mr: 'अधिकारी व कर्मचारी' }, path: '/staff/', icon: 'UsersRound', desc: { en: 'Instructors and office directory', mr: 'निदेशक व कार्यालयीन कर्मचारी' } },
      { label: { en: 'Management committee', mr: 'संस्था व्यवस्थापन समिती' }, path: '/about/#imc', icon: 'Handshake', desc: { en: 'Industry-led IMC', mr: 'उद्योग प्रतिनिधींसह समिती' } },
      { label: { en: 'Results & achievements', mr: 'निकाल व यश' }, path: '/about/#results', icon: 'Trophy', desc: { en: '8 years of results', mr: '८ वर्षांचे निकाल' } },
    ],
  },
  {
    id: 'trades',
    label: { en: 'Trades', mr: 'व्यवसाय' },
    path: '/trades/',
    columns: [
      { title: { en: 'Engineering', mr: 'अभियांत्रिकी' }, links: tradeLinks('engineering') },
      { title: { en: 'Non-engineering', mr: 'बिगर-अभियांत्रिकी' }, links: tradeLinks('non-engineering') },
    ],
  },
  { id: 'admissions', label: { en: 'Admissions', mr: 'प्रवेश' }, path: '/admissions/' },
  {
    id: 'campus',
    label: { en: 'Campus', mr: 'परिसर' },
    links: [
      { label: { en: 'Labs & infrastructure', mr: 'प्रयोगशाळा व सुविधा' }, path: '/campus/', icon: 'Building', desc: { en: 'CSR-built modern labs', mr: 'CSR सहाय्यित आधुनिक प्रयोगशाळा' } },
      { label: { en: 'Girls’ hostel', mr: 'मुलींचे वसतिगृह' }, path: '/campus/#hostel', icon: 'BedDouble', desc: { en: 'On-campus accommodation', mr: 'परिसरातील निवास' } },
      { label: { en: 'Student life', mr: 'विद्यार्थी जीवन' }, path: '/student-life/', icon: 'Sparkles', desc: { en: 'Visits, OJT, sports & culture', mr: 'भेटी, OJT, क्रीडा व संस्कृती' } },
      { label: { en: 'Photo gallery', mr: 'छायाचित्र दालन' }, path: '/gallery/', icon: 'Images', desc: { en: 'Life at ITI Thane in pictures', mr: 'छायाचित्रांतून संस्था' } },
    ],
  },
  {
    id: 'placements',
    label: { en: 'Placements', mr: 'प्लेसमेंट' },
    links: [
      { label: { en: 'Placement & apprenticeship', mr: 'प्लेसमेंट व शिकाऊ उमेदवारी' }, path: '/placements/', icon: 'BriefcaseBusiness', desc: { en: 'Outcomes, OJT and recruiters', mr: 'निकाल, OJT व भरती' } },
      { label: { en: 'Industry & CSR', mr: 'उद्योग व CSR' }, path: '/industry/', icon: 'Factory', desc: { en: 'Partners, MoUs and CSR labs', mr: 'भागीदार, करार व CSR प्रयोगशाळा' } },
      { label: { en: 'Job portal', mr: 'नोकरी पोर्टल' }, path: '/portal/jobs/', icon: 'Search', desc: { en: 'Openings for our trainees', mr: 'प्रशिक्षणार्थींसाठी संधी' } },
    ],
  },
  {
    id: 'updates',
    label: { en: 'Updates', mr: 'अद्ययावत' },
    links: [
      { label: { en: 'Notice board', mr: 'सूचना फलक' }, path: '/notices/', icon: 'Megaphone', desc: { en: 'Admissions, exams, scholarships', mr: 'प्रवेश, परीक्षा, शिष्यवृत्ती' } },
      { label: { en: 'News & events', mr: 'बातम्या व कार्यक्रम' }, path: '/events/', icon: 'CalendarDays', desc: { en: 'What’s happening on campus', mr: 'परिसरातील घडामोडी' } },
      { label: { en: 'Downloads & links', mr: 'डाउनलोड व दुवे' }, path: '/downloads/', icon: 'Download', desc: { en: 'Forms, syllabi, portals', mr: 'अर्ज, अभ्यासक्रम, पोर्टल' } },
      { label: { en: 'Get the app', mr: 'ॲप मिळवा' }, path: '/app/', icon: 'Smartphone', desc: { en: 'Smart Campus on your phone', mr: 'स्मार्ट कॅम्पस तुमच्या फोनवर' } },
      { label: { en: 'FAQs', mr: 'वारंवार विचारले जाणारे प्रश्न' }, path: '/faq/', icon: 'CircleQuestionMark', desc: { en: 'Answers to common questions', mr: 'सामान्य प्रश्नांची उत्तरे' } },
    ],
  },
  { id: 'contact', label: { en: 'Contact', mr: 'संपर्क' }, path: '/contact/' },
];

export const footerColumns: { title: L; links: NavLink[] }[] = [
  {
    title: { en: 'Institute', mr: 'संस्था' },
    links: [
      { label: { en: 'About us', mr: 'आमच्याविषयी' }, path: '/about/' },
      { label: { en: 'Faculty & staff', mr: 'अधिकारी व कर्मचारी' }, path: '/staff/' },
      { label: { en: 'Labs & infrastructure', mr: 'प्रयोगशाळा व सुविधा' }, path: '/campus/' },
      { label: { en: 'Student life', mr: 'विद्यार्थी जीवन' }, path: '/student-life/' },
      { label: { en: 'Gallery', mr: 'छायाचित्र दालन' }, path: '/gallery/' },
    ],
  },
  {
    title: { en: 'Students', mr: 'प्रशिक्षणार्थी' },
    links: [
      { label: { en: 'All trades', mr: 'सर्व व्यवसाय' }, path: '/trades/' },
      { label: { en: 'Admissions', mr: 'प्रवेश' }, path: '/admissions/' },
      { label: { en: 'Placements', mr: 'प्लेसमेंट' }, path: '/placements/' },
      { label: { en: 'Notice board', mr: 'सूचना फलक' }, path: '/notices/' },
      { label: { en: 'Smart Campus portal', mr: 'स्मार्ट कॅम्पस पोर्टल' }, path: '/portal/' },
      { label: { en: 'Get the app', mr: 'ॲप मिळवा' }, path: '/app/' },
    ],
  },
  {
    title: { en: 'Help', mr: 'मदत' },
    links: [
      { label: { en: 'Contact us', mr: 'संपर्क' }, path: '/contact/' },
      { label: { en: 'Grievance & safety', mr: 'तक्रार निवारण व सुरक्षा' }, path: '/grievance/' },
      { label: { en: 'Right to Information', mr: 'माहितीचा अधिकार' }, path: '/rti/' },
      { label: { en: 'FAQs', mr: 'प्रश्नोत्तरे' }, path: '/faq/' },
      { label: { en: 'Downloads', mr: 'डाउनलोड' }, path: '/downloads/' },
    ],
  },
];

export const policyLinks: NavLink[] = [
  { label: { en: 'Privacy', mr: 'गोपनीयता' }, path: '/policies/privacy/' },
  { label: { en: 'Terms', mr: 'अटी' }, path: '/policies/terms/' },
  { label: { en: 'Copyright', mr: 'प्रताधिकार' }, path: '/policies/copyright/' },
  { label: { en: 'Hyperlinking', mr: 'हायपरलिंक' }, path: '/policies/hyperlinking/' },
  { label: { en: 'Disclaimer', mr: 'अस्वीकरण' }, path: '/policies/disclaimer/' },
  { label: { en: 'Accessibility', mr: 'सुलभता' }, path: '/accessibility/' },
  { label: { en: 'Sitemap', mr: 'संकेतस्थळ नकाशा' }, path: '/sitemap/' },
];
