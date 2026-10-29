import type { L } from '@/lib/i18n';

export type Facility = {
  id: string;
  icon: string;
  title: L;
  desc: L;
  images: string[];
  partner?: string;
  points?: L[];
};

export const facilities: Facility[] = [
  {
    id: 'electrician',
    icon: 'Zap',
    title: { en: 'Electrician workshops', mr: 'वीजतंत्री कार्यशाळा' },
    desc: { en: 'A high-bay workshop renovated by ASB International and a second lab with 23 machines developed by Schindler India — motors, panels, wiring boards and safety stations.', mr: 'ASB इंटरनॅशनलने नूतनीकरण केलेली मोठी कार्यशाळा व शिंडलर इंडियाने २३ यंत्रांसह विकसित केलेली दुसरी प्रयोगशाळा — मोटर, पॅनेल, वायरिंग बोर्ड व सुरक्षा व्यवस्था.' },
    images: ['lab-electrician-hall', 'lab-electrician-schindler', 'lab-electrician-workshop'],
    partner: 'Schindler India · ASB International',
  },
  {
    id: 'electronics',
    icon: 'Cpu',
    title: { en: 'Electronics & power-electronics labs', mr: 'इलेक्ट्रॉनिक्स व पॉवर इलेक्ट्रॉनिक्स प्रयोगशाळा' },
    desc: { en: 'Modular benches, trainer kits, oscilloscopes and power-electronics system boards for hands-on circuit work.', mr: 'मॉड्युलर बेंच, ट्रेनर किट, ऑसिलोस्कोप व पॉवर इलेक्ट्रॉनिक्स प्रणाली बोर्डवर प्रत्यक्ष सर्किट सराव.' },
    images: ['lab-electronics', 'lab-power-electronics', 'trade-electronics-1'],
    partner: 'SGS Vikhroli',
  },
  {
    id: 'ictsm',
    icon: 'Network',
    title: { en: 'ICTSM & IT labs', mr: 'ICTSM व IT प्रयोगशाळा' },
    desc: { en: 'Networked computer labs for hardware, networking and system-maintenance training, with an IT lab supported by Ashida Electronics.', mr: 'हार्डवेअर, नेटवर्किंग व प्रणाली देखभाल प्रशिक्षणासाठी नेटवर्कयुक्त संगणक प्रयोगशाळा; आशिदा इलेक्ट्रॉनिक्सच्या सहकार्याने IT प्रयोगशाळा.' },
    images: ['lab-ictsm', 'trade-ictsm-1', 'lab-computer-2'],
    partner: 'SGS Vikhroli · Ashida Electronics',
  },
  {
    id: 'medical',
    icon: 'HeartPulse',
    title: { en: 'Medical electronics lab', mr: 'मेडिकल इलेक्ट्रॉनिक्स प्रयोगशाळा' },
    desc: { en: 'ECG recorder, BP apparatus, OT lighting and biomedical trainer kits for the Technician Medical Electronics trade.', mr: 'टेक्निशियन मेडिकल इलेक्ट्रॉनिक्स व्यवसायासाठी ECG रेकॉर्डर, रक्तदाब उपकरण, OT प्रकाशयोजना व वैद्यकीय ट्रेनर किट.' },
    images: ['trade-tme-1', 'trade-tme-2'],
    partner: 'SGS Vikhroli',
  },
  {
    id: 'copa',
    icon: 'Monitor',
    title: { en: 'COPA computer labs', mr: 'COPA संगणक प्रयोगशाळा' },
    desc: { en: 'Modern computer labs with headsets and a large display for office software, web and programming practice.', mr: 'ऑफिस सॉफ्टवेअर, वेब व प्रोग्रामिंग सरावासाठी हेडसेट व मोठ्या डिस्प्लेसह आधुनिक संगणक प्रयोगशाळा.' },
    images: ['trade-copa-1', 'lab-copa', 'lab-computer'],
    partner: 'D’Mart · SGS Vikhroli',
  },
  {
    id: 'iot',
    icon: 'Wifi',
    title: { en: 'IoT & IoRobotics lab', mr: 'IoT व IoRobotics प्रयोगशाळा' },
    desc: { en: 'Sensors, microcontrollers, robotics kits and workstations for the new IoT trade.', mr: 'नव्या IoT व्यवसायासाठी सेन्सर, मायक्रोकंट्रोलर, रोबोटिक्स किट व वर्कस्टेशन.' },
    images: ['lab-iorobotics'],
    partner: 'Skoda Auto Volkswagen India · Spectrum',
  },
  {
    id: 'cosmetology',
    icon: 'Sparkles',
    title: { en: 'Cosmetology salon lab', mr: 'कॉस्मेटोलॉजी सलून प्रयोगशाळा' },
    desc: { en: 'A salon-style lab with styling stations, mirrors and professional equipment, furnished by D’Mart.', mr: 'स्टायलिंग स्टेशन, आरसे व व्यावसायिक उपकरणांसह सलूनसारखी प्रयोगशाळा — डी-मार्टकडून सुसज्ज.' },
    images: ['lab-cosmetology', 'lab-cosmetology-2'],
    partner: 'D’Mart',
  },
  {
    id: 'apparel',
    icon: 'Scissors',
    title: { en: 'Sewing & fashion studios', mr: 'शिवणकाम व फॅशन स्टुडिओ' },
    desc: { en: 'Industrial sewing machines, cutting tables and design boards for Sewing Technology and Fashion Design.', mr: 'शिवणकाम तंत्रज्ञान व फॅशन डिझाइनसाठी औद्योगिक शिलाई यंत्रे, कटिंग टेबल व डिझाइन बोर्ड.' },
    images: ['lab-sewing', 'trade-sewing-1', 'trade-fdt-1'],
  },
  {
    id: 'idd',
    icon: 'PencilRuler',
    title: { en: 'Interior design drafting studio', mr: 'इंटिरियर डिझाइन ड्राफ्टिंग स्टुडिओ' },
    desc: { en: 'Drafting tables in a naturally lit studio for technical drawing and space planning.', mr: 'तांत्रिक रेखाचित्र व जागा नियोजनासाठी नैसर्गिक प्रकाशातील ड्राफ्टिंग टेबल.' },
    images: ['trade-idd-1', 'trade-idd-2'],
  },
  {
    id: 'av',
    icon: 'Projector',
    title: { en: 'Audio-visual room & smart classroom', mr: 'दृकश्राव्य कक्ष व स्मार्ट वर्ग' },
    desc: { en: 'Interactive display, projector and computer workstations for seminars, expert lectures and digital lessons.', mr: 'चर्चासत्रे, तज्ज्ञांची व्याख्याने व डिजिटल अध्यापनासाठी इंटरॲक्टिव्ह डिस्प्ले, प्रोजेक्टर व संगणक.' },
    images: ['av-room'],
  },
];

export const library = {
  title: { en: 'Library', mr: 'ग्रंथालय' } satisfies L,
  desc: { en: 'Over 1,200 books — trade theory, NIMI reference books, workshop calculation, engineering drawing and employability skills — roughly one for every trainee.', mr: '१,२०० पेक्षा अधिक पुस्तके — व्यवसाय सिद्धांत, NIMI संदर्भ ग्रंथ, कार्यशाळा गणित, अभियांत्रिकी रेखाचित्र व रोजगारक्षमता कौशल्ये — जवळपास प्रत्येक प्रशिक्षणार्थीसाठी एक.' } satisfies L,
};

export const hostel = {
  title: { en: 'Girls’ hostel', mr: 'मुलींचे वसतिगृह' } satisfies L,
  desc: {
    en: 'A two-storey (G+1, 657 m²) hostel on campus provides safe accommodation for Scheduled Tribe trainees, with furnished rooms, a kitchen and a dining area. Hostel residents receive an allowance of ₹600 per month. The hostel was upgraded with CSR support from Spectrum.',
    mr: 'परिसरातील दुमजली (G+1, ६५७ चौ.मी.) वसतिगृहात अनुसूचित जमातीच्या प्रशिक्षणार्थींसाठी सुरक्षित निवासाची सोय आहे — सुसज्ज खोल्या, स्वयंपाकघर व भोजनकक्ष. वसतिगृहातील प्रशिक्षणार्थींना दरमहा ₹६०० भत्ता दिला जातो. स्पेक्ट्रमच्या CSR सहकार्याने वसतिगृहाचे उन्नतीकरण करण्यात आले आहे.',
  } satisfies L,
  images: ['hostel-building', 'hostel-room', 'hostel-kitchen', 'hostel-dining'],
  points: [
    { en: 'For Scheduled Tribe (ST) trainees', mr: 'अनुसूचित जमातीच्या प्रशिक्षणार्थींसाठी' },
    { en: 'Inside the institute campus', mr: 'संस्थेच्या परिसरातच' },
    { en: '₹600 monthly allowance', mr: 'दरमहा ₹६०० भत्ता' },
    { en: 'Furnished rooms, kitchen & dining', mr: 'सुसज्ज खोल्या, स्वयंपाकघर व भोजनकक्ष' },
  ] satisfies L[],
};

export const guestHouse = {
  title: { en: 'Guest house for women officers', mr: 'महिला अधिकाऱ्यांसाठी अतिथीगृह' } satisfies L,
  desc: { en: 'Comfortable rooms for visiting women officers, trainers and examiners.', mr: 'भेट देणाऱ्या महिला अधिकारी, प्रशिक्षक व परीक्षकांसाठी सुसज्ज खोल्या.' } satisfies L,
  images: ['guest-house', 'guest-house-room'],
};

export const greenCampus = {
  title: { en: 'Clean & green campus', mr: 'स्वच्छ व हरित परिसर' } satisfies L,
  desc: { en: 'Tall palms and shade trees line the campus. Trainees run regular cleanliness and plantation drives — 34 trees have been planted and nurtured in the last three years, and the garden was landscaped with SGS Vikhroli’s CSR support.', mr: 'उंच माड व सावली देणारी झाडे परिसराची शोभा वाढवतात. प्रशिक्षणार्थी नियमित स्वच्छता व वृक्षारोपण मोहीम राबवतात — गेल्या तीन वर्षांत ३४ वृक्षांची लागवड व संगोपन करण्यात आले असून SGS विक्रोळीच्या CSR सहकार्याने बगीचा विकसित करण्यात आला आहे.' } satisfies L,
  images: ['campus-trees', 'plantation-drive', 'campus-garden', 'cleanliness-drive'],
};

export const safety: { icon: string; title: L; desc: L }[] = [
  { icon: 'ShieldCheck', title: { en: 'Safe, women-only campus', mr: 'सुरक्षित, केवळ महिलांसाठी परिसर' }, desc: { en: 'Watch-and-ward staff, an exclusively female trainee community and an Internal Complaints Committee.', mr: 'सुरक्षा कर्मचारी, केवळ महिला प्रशिक्षणार्थी व अंतर्गत तक्रार समिती.' } },
  { icon: 'HeartPulse', title: { en: 'First aid in every workshop', mr: 'प्रत्येक कार्यशाळेत प्रथमोपचार' }, desc: { en: 'First-aid boxes, safety charts and supervised practicals as per DGT safety norms.', mr: 'प्रथमोपचार पेटी, सुरक्षा तक्ते व DGT सुरक्षा निकषांनुसार देखरेखीखाली प्रात्यक्षिके.' } },
  { icon: 'Siren', title: { en: 'Fire safety', mr: 'अग्निसुरक्षा' }, desc: { en: 'Fire extinguishers installed across labs and corridors, with safe electrification of workshops.', mr: 'प्रयोगशाळा व मार्गिकांमध्ये अग्निशामक यंत्रे व कार्यशाळांचे सुरक्षित विद्युतीकरण.' } },
  { icon: 'Inbox', title: { en: 'Women’s complaint box', mr: 'महिला तक्रार पेटी' }, desc: { en: 'A confidential complaint box on campus, plus an online grievance form on this website.', mr: 'परिसरात गोपनीय तक्रार पेटी तसेच या संकेतस्थळावर ऑनलाइन तक्रार अर्ज.' } },
];
