import type { L } from '@/lib/i18n';

export type Partner = { name: string; short?: string; kind: L };

const csr: L = { en: 'CSR partner', mr: 'CSR भागीदार' };
const mou: L = { en: 'MoU partner', mr: 'सामंजस्य करार' };
const ojt: L = { en: 'OJT & training', mr: 'OJT व प्रशिक्षण' };

/** Industry partners named in the institute’s records. Shown as text marks (no third-party logos). */
export const partners: Partner[] = [
  { name: 'Schindler India', kind: csr },
  { name: 'D’Mart', kind: csr },
  { name: 'SGS India, Vikhroli', short: 'SGS Vikhroli', kind: csr },
  { name: 'ASB International', kind: csr },
  { name: 'Ashida Electronics', kind: csr },
  { name: 'Spectrum', kind: csr },
  { name: 'Skoda Auto Volkswagen India', short: 'Skoda Auto VW India', kind: mou },
  { name: 'SRF Foundation', kind: mou },
  { name: 'Mahindra & Mahindra', kind: mou },
  { name: 'Tata Power', kind: ojt },
  { name: 'Siemens', kind: ojt },
  { name: 'L&T Skill Academy', kind: ojt },
];

export const csrLabs: { trade: L; partner: string }[] = [
  { trade: { en: 'Electrician lab', mr: 'वीजतंत्री प्रयोगशाळा' }, partner: 'Schindler India Pvt. Ltd.' },
  { trade: { en: 'Electrician workshop renovation', mr: 'वीजतंत्री कार्यशाळा नूतनीकरण' }, partner: 'ASB International, Ambernath' },
  { trade: { en: 'COPA lab', mr: 'COPA प्रयोगशाळा' }, partner: 'D’Mart' },
  { trade: { en: 'COPA lab', mr: 'COPA प्रयोगशाळा' }, partner: 'SGS Vikhroli' },
  { trade: { en: 'Basic Cosmetology lab', mr: 'बेसिक कॉस्मेटोलॉजी प्रयोगशाळा' }, partner: 'D’Mart' },
  { trade: { en: 'ICTSM lab', mr: 'ICTSM प्रयोगशाळा' }, partner: 'SGS Vikhroli' },
  { trade: { en: 'Medical Electronics lab', mr: 'मेडिकल इलेक्ट्रॉनिक्स प्रयोगशाळा' }, partner: 'SGS Vikhroli' },
  { trade: { en: 'IT lab', mr: 'IT प्रयोगशाळा' }, partner: 'Ashida Electronics' },
  { trade: { en: 'IoRobotics lab', mr: 'IoRobotics प्रयोगशाळा' }, partner: 'Spectrum' },
  { trade: { en: 'Hostel upgrade', mr: 'वसतिगृह उन्नतीकरण' }, partner: 'Spectrum' },
  { trade: { en: 'Garden landscaping', mr: 'बगीचा विकास' }, partner: 'SGS Vikhroli' },
  { trade: { en: 'Campus wall painting', mr: 'परिसर भिंत चित्रकला' }, partner: 'SGS Vikhroli' },
];

export const csrActivities: { date: string; partner: string; activity: L; beneficiaries: number }[] = [
  { date: '2023-06', partner: 'Schindler India', activity: { en: 'Scholarships for trainees', mr: 'प्रशिक्षणार्थींना शिष्यवृत्ती' }, beneficiaries: 50 },
  { date: '2023-05', partner: 'D’Mart', activity: { en: 'Cosmetology lab furniture & equipment', mr: 'कॉस्मेटोलॉजी प्रयोगशाळा फर्निचर व उपकरणे' }, beneficiaries: 48 },
  { date: '2023-04', partner: 'ASB International, Ambernath', activity: { en: 'Electrician lab renovation', mr: 'वीजतंत्री प्रयोगशाळा नूतनीकरण' }, beneficiaries: 40 },
];

export const mous: { partner: string; scope: L; from: string; to: string }[] = [
  { partner: 'Skoda Auto Volkswagen India Pvt. Ltd.', scope: { en: 'Set-up of an IoT lab with hardware & software, with AMC support', mr: 'हार्डवेअर व सॉफ्टवेअरसह IoT प्रयोगशाळा उभारणी व AMC सहाय्य' }, from: '2021-12-15', to: '2022-12-15' },
  { partner: 'SRF Foundation', scope: { en: 'Training in digital, employability and green skills', mr: 'डिजिटल, रोजगारक्षमता व हरित कौशल्यांचे प्रशिक्षण' }, from: '2021-09-20', to: '2022-09-20' },
  { partner: 'Mahindra & Mahindra', scope: { en: 'Skill-based training programme', mr: 'कौशल्याधारित प्रशिक्षण कार्यक्रम' }, from: '2021-10-10', to: '2022-10-10' },
];

export const ojtPrograms: { companies: string; trade: L; duration: L; trainees: number }[] = [
  { companies: 'Ashida Electronics, Tata Power', trade: { en: 'Electronics Mechanic', mr: 'इलेक्ट्रॉनिक्स मेकॅनिक' }, duration: { en: '15 days', mr: '१५ दिवस' }, trainees: 60 },
  { companies: 'MIC Engineers, Axis Control, Ratio Electricals', trade: { en: 'Electrician', mr: 'वीजतंत्री' }, duration: { en: '1 month', mr: '१ महिना' }, trainees: 40 },
  { companies: 'Ajna Lens, Harshachi Solutions', trade: { en: 'ICTSM', mr: 'ICTSM' }, duration: { en: '15 days', mr: '१५ दिवस' }, trainees: 30 },
  { companies: 'Trademan Garments', trade: { en: 'Sewing Technology', mr: 'शिवणकाम तंत्रज्ञान' }, duration: { en: '1 month', mr: '१ महिना' }, trainees: 20 },
  { companies: 'Trademan Garments', trade: { en: 'Fashion Design & Technology', mr: 'फॅशन डिझाइन व तंत्रज्ञान' }, duration: { en: '1 month', mr: '१ महिना' }, trainees: 20 },
  { companies: 'Lucky Beauty Clinic & Academy', trade: { en: 'Cosmetology', mr: 'कॉस्मेटोलॉजी' }, duration: { en: '15 days', mr: '१५ दिवस' }, trainees: 46 },
];

export const facultyDevelopment: { programme: L; by: string; date: string; days: number }[] = [
  { programme: { en: 'Safety training', mr: 'सुरक्षितता प्रशिक्षण' }, by: 'Siemens', date: '2022-10', days: 3 },
  { programme: { en: 'Pedagogy training', mr: 'अध्यापनशास्त्र प्रशिक्षण' }, by: 'Tata & Siemens', date: '2022-09', days: 3 },
  { programme: { en: 'Trainers’ training', mr: 'प्रशिक्षकांचे प्रशिक्षण' }, by: 'L&T Skill Academy', date: '2022-06', days: 5 },
];

export const outcomes = [
  { value: '~90%', label: { en: 'of pass-outs get apprenticeships', mr: 'उत्तीर्ण प्रशिक्षणार्थींना शिकाऊ उमेदवारी' } },
  { value: '~85%', label: { en: 'employment / self-employment', mr: 'रोजगार / स्वयंरोजगार' } },
  { value: '10', label: { en: 'CSR MoUs signed', mr: 'CSR सामंजस्य करार' } },
  { value: '216', label: { en: 'trainees in OJT (one year)', mr: 'प्रशिक्षणार्थी OJT मध्ये (एका वर्षात)' } },
];
