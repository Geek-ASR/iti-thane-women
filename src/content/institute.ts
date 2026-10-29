import type { L } from '@/lib/i18n';

/**
 * Institute facts. Sources: institute presentations (2022-23 grading PPT, institute profile PPT),
 * DPR submitted to the Tribal Development Department, and the institute page on mumbai.dvet.gov.in.
 */
export const institute = {
  name: {
    en: 'Rajmata Jijau Government Industrial Training Institute (Women), Thane',
    mr: 'राजमाता जिजाऊ शासकीय औद्योगिक प्रशिक्षण संस्था (मुलींची), ठाणे',
  } satisfies L,
  short: { en: 'Govt. ITI (Women), Thane', mr: 'शासकीय आय.टी.आय. (मुलींची), ठाणे' } satisfies L,
  established: '1992-07-24',
  grNo: 'TSA-4590(495)',
  ncvtCode: 'GU27000230',
  region: { en: 'Mumbai Region, DVET', mr: 'मुंबई विभाग, व्य.शि.प्र.सं.' } satisfies L,
  address: {
    en: 'C/o Govt. Technical High School, Kopri Colony, Thane (East), Maharashtra 400603',
    mr: 'द्वारा शासकीय तांत्रिक विद्यालय, कोपरी कॉलनी, ठाणे (पूर्व), महाराष्ट्र ४००६०३',
  } satisfies L,
  addressLines: {
    en: ['C/o Govt. Technical High School', 'Kopri Colony, Thane (East)', 'Thane, Maharashtra 400603'],
    mr: ['द्वारा शासकीय तांत्रिक विद्यालय', 'कोपरी कॉलनी, ठाणे (पूर्व)', 'ठाणे, महाराष्ट्र ४००६०३'],
  },
  phones: [
    { label: { en: 'Office (landline)', mr: 'कार्यालय (दूरध्वनी)' }, display: '022-2532 5112', tel: '+912225325112' },
    { label: { en: 'Office (mobile)', mr: 'कार्यालय (मोबाईल)' }, display: '+91 82866 14508', tel: '+918286614508' },
  ],
  email: 'iti.thaneg@dvet.gov.in',
  dveto: { label: { en: 'District Vocational Education & Training Office, Thane', mr: 'जिल्हा व्यवसाय शिक्षण व प्रशिक्षण अधिकारी कार्यालय, ठाणे' } satisfies L, email: 'dveto.thane@dvet.edu.in' },
  regionalOffice: { label: { en: 'Regional Office, DVET Mumbai', mr: 'प्रादेशिक कार्यालय, व्य.शि.प्र.सं. मुंबई' } satisfies L, email: 'ro.mumbai@dvet.edu.in' },
  officialPage: 'https://mumbai.dvet.gov.in/thane-institutes/iti-thane-girls/',
  grievanceForm: 'https://forms.gle/Mo4vbJQ6oJmMq6Vb6',
  geo: { lat: 19.17995, lng: 72.97195 },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=19.17995%2C72.97195',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=19.17995%2C72.97195',
  mapEmbed: 'https://maps.google.com/maps?q=19.17995,72.97195&z=17&output=embed',
  principal: { name: 'Mrs. Smita S. Mane', title: { en: 'Principal', mr: 'प्राचार्य' } satisfies L },
};

export const keyStats = [
  { value: 1992, label: { en: 'Established', mr: 'स्थापना' }, plain: true },
  { value: 11, label: { en: 'NCVT trades', mr: 'व्यवसाय' } },
  { value: 21, label: { en: 'Units', mr: 'तुकड्या' } },
  { value: 392, label: { en: 'Seats every year', mr: 'प्रवेश क्षमता' } },
  { value: 95, suffix: '%', label: { en: 'Average pass rate', mr: 'सरासरी निकाल' } },
  { value: 90, suffix: '%', prefix: '~', label: { en: 'Apprenticeship rate', mr: 'शिकाऊ उमेदवारी' } },
] as const;

export const campusFacts = [
  { value: '14,100 m²', label: { en: 'Shared campus land (GTHS Thane)', mr: 'एकूण परिसर (शा.तां.वि. ठाणे)' } },
  { value: '2,008 m²', label: { en: 'Workshop & admin building (G+3)', mr: 'कार्यशाळा व प्रशासकीय इमारत (G+3)' } },
  { value: '657 m²', label: { en: 'Girls’ hostel (G+1)', mr: 'मुलींचे वसतिगृह (G+1)' } },
  { value: '80 kW', label: { en: 'Sanctioned power load', mr: 'मंजूर विद्युत भार' } },
  { value: '1,200+', label: { en: 'Library books', mr: 'ग्रंथालयातील पुस्तके' } },
  { value: '10', label: { en: 'CSR MoUs with industry', mr: 'उद्योगांसोबत CSR करार' } },
];

export const vision: L = {
  en: 'To create skilled, self-reliant and employable women professionals through high-quality vocational training.',
  mr: 'दर्जेदार व्यावसायिक प्रशिक्षणाद्वारे कुशल, स्वावलंबी व रोजगारक्षम महिला व्यावसायिक घडवणे.',
};

export const mission: L[] = [
  { en: 'Deliver industry-oriented training on modern equipment.', mr: 'आधुनिक उपकरणांवर उद्योगाभिमुख प्रशिक्षण देणे.' },
  { en: 'Develop entrepreneurship and leadership skills.', mr: 'उद्योजकता व नेतृत्व कौशल्ये विकसित करणे.' },
  { en: 'Promote women’s empowerment and financial independence.', mr: 'महिला सक्षमीकरण व आर्थिक स्वावलंबनास चालना देणे.' },
  { en: 'Enhance employability and self-employment opportunities.', mr: 'रोजगारक्षमता व स्वयंरोजगाराच्या संधी वाढवणे.' },
];

export const history: L = {
  en: 'Government ITI (Women), Thane began functioning on 24 July 1992 under Government Resolution TSA-4590(495) as one of Maharashtra’s dedicated industrial training institutes for girls. Housed on the green campus of the Government Technical High School at Kopri Colony, the institute has grown from a handful of units into 11 trades and 21 units across electrical, electronics, IT, healthcare technology, beauty, apparel and office-management sectors. Seven units are reserved for Scheduled Tribe girls, who are also offered hostel accommodation on campus. Over the years the institute has been part of national reform programmes — the World Bank–assisted Vocational Training Improvement Project, STRIVE and DAKSH — and has partnered with leading companies to rebuild its laboratories under CSR.',
  mr: 'शासकीय औद्योगिक प्रशिक्षण संस्था (मुलींची), ठाणे ही संस्था शासन निर्णय क्र. TSA-4590(495) अन्वये २४ जुलै १९९२ रोजी मुलींसाठीच्या विशेष औद्योगिक प्रशिक्षण संस्थांपैकी एक म्हणून सुरू झाली. कोपरी कॉलनी येथील शासकीय तांत्रिक विद्यालयाच्या हिरव्यागार परिसरात असलेली ही संस्था आज विद्युत, इलेक्ट्रॉनिक्स, माहिती तंत्रज्ञान, वैद्यकीय तंत्रज्ञान, सौंदर्य, वस्त्रनिर्मिती व कार्यालय व्यवस्थापन क्षेत्रातील ११ व्यवसाय व २१ तुकड्यांपर्यंत विस्तारली आहे. यापैकी सात तुकड्या अनुसूचित जमातीच्या मुलींसाठी राखीव असून त्यांच्यासाठी परिसरातच वसतिगृहाची सोय आहे. जागतिक बँक सहाय्यित व्यावसायिक प्रशिक्षण सुधार प्रकल्प (VTIP), STRIVE व DAKSH या राष्ट्रीय उपक्रमांत संस्थेचा सहभाग राहिला असून CSR अंतर्गत नामांकित कंपन्यांच्या सहकार्याने प्रयोगशाळांचे आधुनिकीकरण करण्यात आले आहे.',
};

export const principalMessage: { paragraphs: L[] } = {
  paragraphs: [
    {
      en: 'Women make up nearly half of India’s population, and that strength must take its full place in nation-building. Empowering a woman begins with making her financially self-reliant — which is why the Government places such emphasis on employment and self-employment through skill training, and has set up dedicated Industrial Training Institutes for girls across the state.',
      mr: 'भारतातील लोकसंख्येत महिलांचे प्रमाण जवळपास ५०% आहे. राष्ट्र उभारणीत या शक्तीचा सहभाग वाढणे आवश्यक आहे. महिलेला आर्थिकदृष्ट्या स्वावलंबी करणे हे सक्षमीकरणाचे पहिले पाऊल आहे. म्हणूनच शासनाने कौशल्य प्रशिक्षणाद्वारे रोजगार व स्वयंरोजगारावर भर दिला असून राज्यात मुलींसाठी स्वतंत्र औद्योगिक प्रशिक्षण संस्था सुरू केल्या आहेत.',
    },
    {
      en: 'Our institute is an important centre for women’s technical and vocational training in Thane district. Seven of our units are reserved exclusively for tribal girls, who receive a subsistence allowance / scholarship of ₹500 per month — and ₹600 per month for those living in our hostel. Trainees from economically weaker groups in all categories receive a stipend of ₹40 per month, and open-category trainees from the economically weaker section are eligible for reimbursement of training fees by the Government. Every year, 60 eligible and needy trainees also receive a scholarship of ₹5,000 each from Schindler India Pvt. Ltd.',
      mr: 'ठाणे जिल्ह्यातील महिलांच्या तांत्रिक व व्यावसायिक प्रशिक्षणासाठी आमची संस्था एक महत्त्वाचे केंद्र आहे. संस्थेतील सात तुकड्या केवळ आदिवासी मुलींसाठी राखीव असून त्यांना दरमहा ₹५०० निर्वाह भत्ता / शिष्यवृत्ती व वसतिगृहात राहणाऱ्या प्रशिक्षणार्थींना दरमहा ₹६०० दिले जातात. सर्व प्रवर्गातील आर्थिकदृष्ट्या दुर्बल घटकातील प्रशिक्षणार्थींना दरमहा ₹४० विद्यावेतन दिले जाते, तर खुल्या प्रवर्गातील आर्थिकदृष्ट्या दुर्बल प्रशिक्षणार्थींना प्रशिक्षण शुल्काची प्रतिपूर्ती शासनाकडून केली जाते. याशिवाय दरवर्षी ६० पात्र व गरजू प्रशिक्षणार्थींना शिंडलर इंडिया प्रा. लि. कडून प्रत्येकी ₹५,००० शिष्यवृत्ती दिली जाते.',
    },
    {
      en: 'Trainees who successfully complete their course are guided towards apprenticeships, employment and self-employment. I warmly invite every woman and girl to make full use of these training facilities created especially for her.',
      mr: 'अभ्यासक्रम यशस्वीपणे पूर्ण करणाऱ्या प्रशिक्षणार्थींना शिकाऊ उमेदवारी, रोजगार व स्वयंरोजगार मिळवण्यासाठी मार्गदर्शन केले जाते. महिलांसाठी खास निर्माण केलेल्या या प्रशिक्षण सुविधांचा सर्व महिला व मुलींनी पुरेपूर लाभ घ्यावा, असे मी आवाहन करते.',
    },
  ],
};

/** Scholarships & financial support (from the Principal's published message). */
export const support = [
  { amount: '₹500', per: { en: 'per month', mr: 'दरमहा' }, title: { en: 'Tribal girls’ allowance', mr: 'आदिवासी मुलींसाठी भत्ता' }, desc: { en: 'Subsistence allowance / scholarship for ST trainees.', mr: 'अनुसूचित जमातीच्या प्रशिक्षणार्थींसाठी निर्वाह भत्ता / शिष्यवृत्ती.' } },
  { amount: '₹600', per: { en: 'per month', mr: 'दरमहा' }, title: { en: 'Hostel residents', mr: 'वसतिगृहातील प्रशिक्षणार्थी' }, desc: { en: 'Allowance for trainees admitted to and staying in the hostel.', mr: 'वसतिगृहात प्रवेश घेऊन राहणाऱ्या प्रशिक्षणार्थींसाठी भत्ता.' } },
  { amount: '₹5,000', per: { en: 'per year', mr: 'दरवर्षी' }, title: { en: 'Schindler India scholarship', mr: 'शिंडलर इंडिया शिष्यवृत्ती' }, desc: { en: 'For 60 eligible and needy trainees every year.', mr: 'दरवर्षी ६० पात्र व गरजू प्रशिक्षणार्थींसाठी.' } },
  { amount: '₹40', per: { en: 'per month', mr: 'दरमहा' }, title: { en: 'EWS stipend', mr: 'आर्थिक दुर्बल घटक विद्यावेतन' }, desc: { en: 'For trainees of all categories from economically weaker groups.', mr: 'सर्व प्रवर्गातील आर्थिकदृष्ट्या दुर्बल प्रशिक्षणार्थींसाठी.' } },
  { amount: '100%', per: { en: 'fee reimbursement', mr: 'शुल्क प्रतिपूर्ती' }, title: { en: 'Training-fee reimbursement', mr: 'प्रशिक्षण शुल्क प्रतिपूर्ती' }, desc: { en: 'For open-category trainees from the economically weaker section.', mr: 'खुल्या प्रवर्गातील आर्थिकदृष्ट्या दुर्बल प्रशिक्षणार्थींसाठी.' } },
];

/** Admission & examination results by admission session (institute records). */
export const results = [
  { session: 'Aug 2016', seats: 298, admitted: 285, appeared: 265, passed: 255 },
  { session: 'Aug 2017', seats: 267, admitted: 244, appeared: 238, passed: 230 },
  { session: 'Aug 2018', seats: 322, admitted: 277, appeared: 264, passed: 252 },
  { session: 'Aug 2019', seats: 276, admitted: 240, appeared: 220, passed: 208 },
  { session: 'Aug 2020', seats: 252, admitted: 202, appeared: 190, passed: 177 },
  { session: 'Aug 2021', seats: 276, admitted: 263, appeared: 218, passed: 210 },
  { session: 'Aug 2022', seats: 300, admitted: 294, appeared: 244, passed: 234 },
  { session: 'Aug 2023', seats: 276, admitted: 263, appeared: 216, passed: 200 },
].map((r) => ({ ...r, passPct: Math.round((r.passed / r.appeared) * 1000) / 10, fillPct: Math.round((r.admitted / r.seats) * 1000) / 10 }));

export const schemes = [
  { name: 'VTIP', title: { en: 'Vocational Training Improvement Project', mr: 'व्यावसायिक प्रशिक्षण सुधार प्रकल्प' }, desc: { en: 'World Bank–assisted national programme to modernise ITIs.', mr: 'आय.टी.आय. आधुनिकीकरणासाठी जागतिक बँक सहाय्यित राष्ट्रीय प्रकल्प.' } },
  { name: 'STRIVE', title: { en: 'Skills Strengthening for Industrial Value Enhancement', mr: 'औद्योगिक मूल्यवृद्धीसाठी कौशल्य बळकटीकरण' }, desc: { en: 'Improves training quality and industry linkage in ITIs.', mr: 'आय.टी.आय. मधील प्रशिक्षणाचा दर्जा व उद्योगांशी संबंध दृढ करणे.' } },
  { name: 'DAKSH', title: { en: 'DAKSH', mr: 'दक्ष' }, desc: { en: 'Upgradation support for trades and training infrastructure.', mr: 'व्यवसाय व प्रशिक्षण पायाभूत सुविधांच्या उन्नतीसाठी सहाय्य.' } },
];

export const achievements: { title: L; desc: L; icon: string }[] = [
  { icon: 'Trophy', title: { en: '95% average pass rate', mr: 'सरासरी ९५% निकाल' }, desc: { en: 'Consistently above 92% for eight admission sessions (2016–2023).', mr: 'सलग आठ प्रवेश सत्रांत (२०१६–२०२३) ९२% पेक्षा अधिक निकाल.' } },
  { icon: 'Handshake', title: { en: 'Labs rebuilt with industry', mr: 'उद्योगांच्या सहकार्याने प्रयोगशाळा' }, desc: { en: 'Schindler, D’Mart, SGS, ASB International, Ashida and Spectrum have developed labs under CSR.', mr: 'शिंडलर, डी-मार्ट, SGS, ASB इंटरनॅशनल, आशिदा व स्पेक्ट्रम यांनी CSR अंतर्गत प्रयोगशाळा विकसित केल्या.' } },
  { icon: 'Rocket', title: { en: 'Entrepreneurship & leadership', mr: 'उद्योजकता व नेतृत्व' }, desc: { en: 'Udyam Shiksha entrepreneurship training and a two-month Student Leadership Programme for 64 trainees.', mr: 'उद्यम शिक्षा उद्योजकता प्रशिक्षण व ६४ प्रशिक्षणार्थींसाठी दोन महिन्यांचा विद्यार्थी नेतृत्व कार्यक्रम.' } },
  { icon: 'Sprout', title: { en: 'Clean & green campus', mr: 'स्वच्छ व हरित परिसर' }, desc: { en: 'Regular cleanliness and plantation drives; 34 trees planted and nurtured in three years.', mr: 'नियमित स्वच्छता व वृक्षारोपण मोहीम; तीन वर्षांत ३४ वृक्षांची लागवड व संगोपन.' } },
  { icon: 'BadgeCheck', title: { en: 'Practicals as per syllabus', mr: 'अभ्यासक्रमानुसार प्रात्यक्षिके' }, desc: { en: '101 of 102 syllabus practicals conducted in the year — 99% completion.', mr: 'वर्षभरात १०२ पैकी १०१ प्रात्यक्षिके पूर्ण — ९९% पूर्तता.' } },
  { icon: 'GraduationCap', title: { en: 'Trained instructors', mr: 'प्रशिक्षित निदेशक' }, desc: { en: 'Instructors trained by Siemens, Tata and L&T Skill Academy in safety, pedagogy and train-the-trainer programmes.', mr: 'सिमेन्स, टाटा व L&T स्किल अकॅडमी यांच्याकडून सुरक्षितता, अध्यापनशास्त्र व प्रशिक्षक प्रशिक्षण.' } },
];

/** Institute Management Committee (as per DPR). */
export const imc = {
  chair: { name: 'Mrs. Jyotsna Wahane', role: { en: 'Chairperson', mr: 'अध्यक्ष' }, org: 'Legal Advisor, Mukand Limited, Kalwa' },
  secretary: { name: 'Mrs. Smita S. Mane', role: { en: 'Secretary (Principal)', mr: 'सचिव (प्राचार्य)' }, org: 'Govt. ITI (Women), Thane' },
  industry: [
    { name: 'Mr. Suyash Kulkarni', sector: { en: 'Electronics', mr: 'इलेक्ट्रॉनिक्स' }, org: 'Ashida Electronics, Thane' },
    { name: 'Mr. Jayendra Kulkarni', sector: { en: 'Electronics & software', mr: 'इलेक्ट्रॉनिक्स व सॉफ्टवेअर' }, org: 'Mindstix Software Labs' },
    { name: 'Mrs. Yogita Vasave', sector: { en: 'Beauty & wellness', mr: 'सौंदर्य व आरोग्य' }, org: 'EON Beauty Parlour, Shahapur' },
    { name: 'Mr. Jayant Longale', sector: { en: 'Textile', mr: 'वस्त्रोद्योग' }, org: '' },
  ],
  members: [
    { name: 'Mrs. Manjusha Deware', org: 'General Manager, District Industries Centre, Thane' },
    { name: 'Mrs. Anagha Bedekar', org: 'Entrepreneur (sole proprietor)' },
    { name: 'Mrs. Smita Waingankar', org: 'Sr. Research Associate & Programme Coordinator' },
    { name: 'Mr. Nilesh Karle', org: '' },
    { name: 'Mr. H. L. Manje', org: 'Group Instructor, Govt. ITI (Women), Thane' },
    { name: { en: 'Trainee representative', mr: 'प्रशिक्षणार्थी प्रतिनिधी' }, org: '' },
  ],
};

export const timeline: { year: string | L; title: L }[] = [
  { year: '1992', title: { en: 'Institute starts functioning at Kopri Colony, Thane (24 July).', mr: 'कोपरी कॉलनी, ठाणे येथे संस्थेचे कामकाज सुरू (२४ जुलै).' } },
  { year: '2021', title: { en: 'Schindler-developed Electrician Lab with 23 machines inaugurated (8 Jan); district job fair held (16 Feb).', mr: 'शिंडलरने विकसित केलेल्या २३ यंत्रांच्या वीजतंत्री प्रयोगशाळेचे उद्घाटन (८ जाने.); जिल्हास्तरीय रोजगार मेळावा (१६ फेब्रु.).' } },
  { year: '2021–22', title: { en: 'MoUs with Skoda Auto Volkswagen India (IoT lab), SRF Foundation and Mahindra & Mahindra.', mr: 'स्कोडा ऑटो फोक्सवॅगन इंडिया (IoT प्रयोगशाळा), SRF फाउंडेशन व महिंद्रा अँड महिंद्रा यांच्यासोबत सामंजस्य करार.' } },
  { year: '2022', title: { en: 'Udyam entrepreneurship programme and Student Leadership Programme launched.', mr: 'उद्यम उद्योजकता कार्यक्रम व विद्यार्थी नेतृत्व कार्यक्रम सुरू.' } },
  { year: '2023', title: { en: 'ASB International renovates the Electrician lab; D’Mart equips the Cosmetology lab; Schindler scholarships for 50 trainees.', mr: 'ASB इंटरनॅशनलकडून वीजतंत्री प्रयोगशाळेचे नूतनीकरण; डी-मार्टकडून कॉस्मेटोलॉजी प्रयोगशाळा; ५० प्रशिक्षणार्थींना शिंडलर शिष्यवृत्ती.' } },
  { year: { en: 'Today', mr: 'आज' }, title: { en: '11 trades, 21 units and 392 seats — with IoT added to the line-up.', mr: '११ व्यवसाय, २१ तुकड्या व ३९२ जागा — IoT व्यवसायाची भर.' } },
];
