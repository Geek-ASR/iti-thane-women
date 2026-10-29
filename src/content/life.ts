import type { L } from '@/lib/i18n';

export const activities: { id: string; icon: string; title: L; desc: L; images: string[] }[] = [
  { id: 'visits', icon: 'Factory', title: { en: 'Industrial visits', mr: 'औद्योगिक भेटी' }, desc: { en: 'Trade-wise visits to factories, garment units and service centres so trainees see real production lines and workplaces.', mr: 'कारखाने, वस्त्र उद्योग व सेवा केंद्रांना व्यवसायनिहाय भेटी — प्रत्यक्ष उत्पादन व कार्यस्थळांचा अनुभव.' }, images: ['visit-1', 'visit-2', 'visit-3'] },
  { id: 'ojt', icon: 'HardHat', title: { en: 'On-the-job training', mr: 'प्रत्यक्ष कामावरील प्रशिक्षण (OJT)' }, desc: { en: 'Weeks of supervised work at partner companies — from Tata Power’s solar and power systems to electronics assembly floors.', mr: 'भागीदार कंपन्यांमध्ये देखरेखीखाली प्रत्यक्ष काम — टाटा पॉवरच्या सौर व वीज प्रणालींपासून इलेक्ट्रॉनिक्स जोडणी विभागांपर्यंत.' }, images: ['ojt-drill', 'ojt-helmets', 'ojt-tatapower-1', 'ojt-solar', 'ojt-assembly', 'ojt-tatapower-2'] },
  { id: 'exhibitions', icon: 'Lightbulb', title: { en: 'Technical exhibitions', mr: 'तंत्र प्रदर्शन' }, desc: { en: 'Trainees build and present working models — smart-city projects, garment collections and more — at institute and state-level exhibitions.', mr: 'प्रशिक्षणार्थी स्मार्ट सिटी प्रकल्प, पोशाख संग्रह असे कार्यरत मॉडेल तयार करून संस्था व राज्यस्तरीय प्रदर्शनांत सादर करतात.' }, images: ['exhibition-3', 'exhibition-1', 'exhibition-2'] },
  { id: 'annual', icon: 'Drama', title: { en: 'Annual function', mr: 'वार्षिक स्नेहसंमेलन' }, desc: { en: 'A celebration of talent — dance, drama and music on stage, with prizes for academic and sporting excellence.', mr: 'कलागुणांचा उत्सव — नृत्य, नाट्य व संगीत सादरीकरण तसेच शैक्षणिक व क्रीडा यशासाठी पारितोषिके.' }, images: ['annual-3', 'annual-1', 'annual-2'] },
  { id: 'sports', icon: 'Trophy', title: { en: 'Sports & games', mr: 'क्रीडा' }, desc: { en: 'Annual sports with kho-kho, badminton, chess and carrom keep trainees active and confident.', mr: 'खो-खो, बॅडमिंटन, बुद्धिबळ व कॅरम यांसह वार्षिक क्रीडा स्पर्धा.' }, images: ['sports-kho-kho', 'sports-chess', 'sports-carrom'] },
  { id: 'womens-day', icon: 'Heart', title: { en: 'International Women’s Day', mr: 'जागतिक महिला दिन' }, desc: { en: 'Rangoli, talks by women achievers and mentoring sessions — including a Schindler India women-officers’ mentoring programme.', mr: 'रांगोळी, यशस्वी महिलांची व्याख्याने व मार्गदर्शन सत्रे — शिंडलर इंडियाच्या महिला अधिकाऱ्यांच्या मार्गदर्शन कार्यक्रमासह.' }, images: ['womens-day-rangoli', 'womens-day-panel'] },
  { id: 'udyam', icon: 'Rocket', title: { en: 'Udyam — entrepreneurship', mr: 'उद्यम — उद्योजकता' }, desc: { en: 'The Udyam Shiksha programme builds an entrepreneurial mindset — trainees design products, pitch ideas and learn self-defence. A Student Leadership Programme followed for 64 trainees.', mr: 'उद्यम शिक्षा उपक्रमातून उद्योजकीय मानसिकता — उत्पादन रचना, कल्पना सादरीकरण व स्वसंरक्षण प्रशिक्षण. त्यानंतर ६४ प्रशिक्षणार्थींसाठी विद्यार्थी नेतृत्व कार्यक्रम.' }, images: ['udyam-1', 'udyam-5', 'udyam-2', 'udyam-3'] },
  { id: 'celebrations', icon: 'Flower2', title: { en: 'Jayanti & festivals', mr: 'जयंती व उत्सव' }, desc: { en: 'Birth anniversaries of national icons and festivals are observed together on campus.', mr: 'राष्ट्रपुरुषांच्या जयंती व सण-उत्सव परिसरात एकत्र साजरे केले जातात.' }, images: ['jayanti-1', 'jayanti-2'] },
  { id: 'green', icon: 'Sprout', title: { en: 'Cleanliness & plantation', mr: 'स्वच्छता व वृक्षारोपण' }, desc: { en: 'Swachhata drives and tree plantation keep the campus clean and green.', mr: 'स्वच्छता मोहीम व वृक्षारोपणातून परिसर स्वच्छ व हरित.' }, images: ['plantation-drive', 'cleanliness-drive', 'plantation-garden'] },
];

export type EventItem = { id: string; date: string; title: L; body: L; image?: string; tag: L };

const tagCsr: L = { en: 'CSR', mr: 'CSR' };
const tagPlacement: L = { en: 'Placement', mr: 'प्लेसमेंट' };
const tagCampus: L = { en: 'Campus', mr: 'परिसर' };
const tagSkill: L = { en: 'Skill development', mr: 'कौशल्य विकास' };

/** Events recorded by the institute (DVET institute page and institute presentations). */
export const events: EventItem[] = [
  { id: 'schindler-scholarship-2023', date: '2023-06-15', tag: tagCsr, title: { en: 'Schindler India scholarships for 50 trainees', mr: 'शिंडलर इंडियाकडून ५० प्रशिक्षणार्थींना शिष्यवृत्ती' }, body: { en: 'Under its CSR programme, Schindler India awarded scholarships to 50 eligible and needy trainees of the institute.', mr: 'CSR उपक्रमांतर्गत शिंडलर इंडियाने संस्थेतील ५० पात्र व गरजू प्रशिक्षणार्थींना शिष्यवृत्ती प्रदान केली.' } },
  { id: 'dmart-cosmetology-2023', date: '2023-05-10', tag: tagCsr, image: 'lab-cosmetology', title: { en: 'D’Mart equips the Cosmetology lab', mr: 'डी-मार्टकडून कॉस्मेटोलॉजी प्रयोगशाळा सुसज्ज' }, body: { en: 'D’Mart provided furniture and professional equipment for the Cosmetology lab, benefiting 48 trainees every year.', mr: 'डी-मार्टने कॉस्मेटोलॉजी प्रयोगशाळेसाठी फर्निचर व व्यावसायिक उपकरणे दिली — दरवर्षी ४८ प्रशिक्षणार्थींना लाभ.' } },
  { id: 'asb-electrician-2023', date: '2023-04-20', tag: tagCsr, image: 'lab-inauguration-1', title: { en: 'Renovated Electrician lab inaugurated', mr: 'नूतनीकृत वीजतंत्री प्रयोगशाळेचे उद्घाटन' }, body: { en: 'ASB International, Ambernath renovated the Electrician lab under CSR. The new workshop was inaugurated with industry representatives and staff.', mr: 'ASB इंटरनॅशनल, अंबरनाथ यांनी CSR अंतर्गत वीजतंत्री प्रयोगशाळेचे नूतनीकरण केले. उद्योग प्रतिनिधी व कर्मचाऱ्यांच्या उपस्थितीत नव्या कार्यशाळेचे उद्घाटन झाले.' } },
  { id: 'womens-day-2023', date: '2023-03-08', tag: tagCampus, image: 'womens-day-panel', title: { en: 'International Women’s Day 2023', mr: 'जागतिक महिला दिन २०२३' }, body: { en: 'Trainees celebrated Women’s Day with a rangoli competition and an interaction with women achievers from different fields.', mr: 'रांगोळी स्पर्धा व विविध क्षेत्रांतील यशस्वी महिलांशी संवाद साधून महिला दिन साजरा करण्यात आला.' } },
  { id: 'leadership-2022', date: '2022-04-01', tag: tagSkill, image: 'udyam-5', title: { en: 'Student Leadership Programme for 64 trainees', mr: '६४ प्रशिक्षणार्थींसाठी विद्यार्थी नेतृत्व कार्यक्रम' }, body: { en: 'A two-month leadership programme conducted with Udyam Shiksha Upakram to build confidence, teamwork and communication.', mr: 'आत्मविश्वास, संघभावना व संवाद कौशल्यासाठी उद्यम शिक्षा उपक्रमासोबत दोन महिन्यांचा नेतृत्व कार्यक्रम.' } },
  { id: 'annual-2022', date: '2022-04-05', tag: tagCampus, image: 'annual-3', title: { en: 'Annual function 2021–22', mr: 'वार्षिक स्नेहसंमेलन २०२१–२२' }, body: { en: 'Trainees presented dance and cultural performances; prizes were awarded for academic, cultural and sports achievements.', mr: 'प्रशिक्षणार्थींनी नृत्य व सांस्कृतिक कार्यक्रम सादर केले; शैक्षणिक, सांस्कृतिक व क्रीडा यशासाठी पारितोषिके देण्यात आली.' } },
  { id: 'entrepreneurship-2022', date: '2022-03-01', tag: tagSkill, image: 'udyam-1', title: { en: 'Udyam entrepreneurship training', mr: 'उद्यम उद्योजकता प्रशिक्षण' }, body: { en: 'A one-month entrepreneurial training where trainees developed and presented their own product ideas.', mr: 'एका महिन्याच्या उद्योजकता प्रशिक्षणात प्रशिक्षणार्थींनी स्वतःच्या उत्पादन कल्पना विकसित करून सादर केल्या.' } },
  { id: 'womens-mentoring', date: '2021-03-06', tag: tagCsr, title: { en: 'Women empowerment mentoring by Schindler India', mr: 'शिंडलर इंडियाचा महिला सक्षमीकरण मार्गदर्शन कार्यक्रम' }, body: { en: 'On the occasion of Women’s Day, women officers of Schindler India shared their success stories, mentored trainees on careers and answered their questions.', mr: 'महिला दिनानिमित्त शिंडलर इंडियाच्या महिला अधिकाऱ्यांनी आपल्या यशोगाथा सांगितल्या, करिअरबाबत मार्गदर्शन केले व शंकांचे निरसन केले.' } },
  { id: 'job-fair-2021', date: '2021-02-16', tag: tagPlacement, title: { en: 'Job fair for ITI graduates', mr: 'आय.टी.आय. उत्तीर्णांसाठी रोजगार मेळावा' }, body: { en: 'Organised with BTRI Thane and Maharashtra State Electricity Distribution Co. Ltd., Vashi — about 90 candidates from 7 institutes participated.', mr: 'BTRI ठाणे व महाराष्ट्र राज्य विद्युत वितरण कंपनी, वाशी यांच्या सहकार्याने आयोजन — ७ संस्थांतील सुमारे ९० उमेदवार सहभागी.' } },
  { id: 'schindler-lab-2021', date: '2021-01-08', tag: tagCsr, image: 'lab-electrician-schindler', title: { en: 'Schindler Electrician Lab (23 machines) inaugurated', mr: 'शिंडलर वीजतंत्री प्रयोगशाळेचे (२३ यंत्रे) उद्घाटन' }, body: { en: 'Developed by Schindler India in 2020–21, the lab with 23 machines was inaugurated in the presence of the Hon. Joint Director, DVET and senior Schindler India officials.', mr: 'शिंडलर इंडियाने २०२०–२१ मध्ये विकसित केलेल्या २३ यंत्रांच्या प्रयोगशाळेचे उद्घाटन मा. सहसंचालक, व्य.शि.प्र.सं. व शिंडलर इंडियाच्या वरिष्ठ अधिकाऱ्यांच्या उपस्थितीत झाले.' } },
];

export type GalleryCategory = { id: string; label: L };
export const galleryCategories: GalleryCategory[] = [
  { id: 'campus', label: { en: 'Campus', mr: 'परिसर' } },
  { id: 'hostel', label: { en: 'Hostel', mr: 'वसतिगृह' } },
  { id: 'labs', label: { en: 'Laboratories', mr: 'प्रयोगशाळा' } },
  { id: 'workshops', label: { en: 'Workshops', mr: 'कार्यशाळा' } },
  { id: 'csr', label: { en: 'CSR activities', mr: 'CSR उपक्रम' } },
  { id: 'visits', label: { en: 'Industrial visits', mr: 'औद्योगिक भेटी' } },
  { id: 'ojt', label: { en: 'On-the-job training', mr: 'OJT' } },
  { id: 'exhibitions', label: { en: 'Technical exhibitions', mr: 'तंत्र प्रदर्शन' } },
  { id: 'annual', label: { en: 'Annual function', mr: 'स्नेहसंमेलन' } },
  { id: 'sports', label: { en: 'Sports', mr: 'क्रीडा' } },
  { id: 'womens-day', label: { en: 'Women’s Day', mr: 'महिला दिन' } },
  { id: 'udyam', label: { en: 'Entrepreneurship', mr: 'उद्योजकता' } },
  { id: 'celebrations', label: { en: 'Celebrations', mr: 'उत्सव' } },
];

export type GalleryPhoto = { image: string; category: string; caption: L };
const g = (image: string, category: string, en: string, mr: string): GalleryPhoto => ({ image, category, caption: { en, mr } });

export const gallery: GalleryPhoto[] = [
  g('campus-entrance', 'campus', 'Main entrance of the institute building', 'संस्थेच्या इमारतीचे मुख्य प्रवेशद्वार'),
  g('campus-building', 'campus', 'Workshop and administrative building', 'कार्यशाळा व प्रशासकीय इमारत'),
  g('campus-walkway', 'campus', 'Tree-lined walkway on campus', 'परिसरातील वृक्षाच्छादित मार्ग'),
  g('campus-trees', 'campus', 'Shade trees around the workshops', 'कार्यशाळांभोवतीची सावली देणारी झाडे'),
  g('campus-garden', 'campus', 'Landscaped campus garden', 'सुशोभित बगीचा'),
  g('av-room', 'campus', 'Audio-visual room with interactive display', 'इंटरॲक्टिव्ह डिस्प्लेसह दृकश्राव्य कक्ष'),
  g('guest-house', 'campus', 'Guest house for women officers', 'महिला अधिकाऱ्यांसाठी अतिथीगृह'),
  g('guest-house-room', 'campus', 'Guest house room', 'अतिथीगृहातील खोली'),
  g('hostel-building', 'hostel', 'Girls’ hostel building', 'मुलींच्या वसतिगृहाची इमारत'),
  g('hostel-room', 'hostel', 'Furnished hostel room', 'वसतिगृहातील सुसज्ज खोली'),
  g('hostel-kitchen', 'hostel', 'Hostel kitchen', 'वसतिगृहातील स्वयंपाकघर'),
  g('hostel-dining', 'hostel', 'Hostel dining area', 'वसतिगृहातील भोजनकक्ष'),
  g('lab-ictsm', 'labs', 'ICTSM lab developed by SGS Vikhroli', 'SGS विक्रोळीने विकसित केलेली ICTSM प्रयोगशाळा'),
  g('lab-electronics', 'labs', 'Electronics Mechanic lab (SGS Vikhroli)', 'इलेक्ट्रॉनिक्स मेकॅनिक प्रयोगशाळा (SGS विक्रोळी)'),
  g('lab-power-electronics', 'labs', 'Power-electronics system trainers', 'पॉवर इलेक्ट्रॉनिक्स प्रणाली ट्रेनर'),
  g('lab-iorobotics', 'labs', 'IoRobotics lab developed by Spectrum', 'स्पेक्ट्रमने विकसित केलेली IoRobotics प्रयोगशाळा'),
  g('lab-cosmetology', 'labs', 'Cosmetology lab equipped by D’Mart', 'डी-मार्टने सुसज्ज केलेली कॉस्मेटोलॉजी प्रयोगशाळा'),
  g('lab-cosmetology-2', 'labs', 'Salon stations in the Cosmetology lab', 'कॉस्मेटोलॉजी प्रयोगशाळेतील सलून स्टेशन'),
  g('trade-copa-1', 'labs', 'COPA trainees in the computer lab', 'संगणक प्रयोगशाळेत COPA प्रशिक्षणार्थी'),
  g('lab-copa', 'labs', 'COPA computer lab', 'COPA संगणक प्रयोगशाळा'),
  g('lab-computer', 'labs', 'Computer lab with projector', 'प्रोजेक्टरसह संगणक प्रयोगशाळा'),
  g('trade-tme-1', 'labs', 'Medical Electronics practical session', 'मेडिकल इलेक्ट्रॉनिक्स प्रात्यक्षिक'),
  g('trade-tme-2', 'labs', 'Trainees testing biomedical circuits', 'वैद्यकीय सर्किटची चाचणी करताना प्रशिक्षणार्थी'),
  g('trade-ictsm-1', 'labs', 'ICTSM workstations', 'ICTSM वर्कस्टेशन'),
  g('trade-sp-1', 'labs', 'Secretarial Practice typing lab', 'सेक्रेटेरियल प्रॅक्टिस टंकलेखन प्रयोगशाळा'),
  g('trade-idd-1', 'labs', 'Interior Design drafting studio', 'इंटिरियर डिझाइन ड्राफ्टिंग स्टुडिओ'),
  g('lab-electrician-hall', 'workshops', 'Electrician workshop hall', 'वीजतंत्री कार्यशाळा'),
  g('lab-electrician-workshop', 'workshops', 'Electrician workshop renovated by ASB International', 'ASB इंटरनॅशनलने नूतनीकरण केलेली वीजतंत्री कार्यशाळा'),
  g('lab-electrician-schindler', 'workshops', 'Electrician Lab 2 developed by Schindler India', 'शिंडलर इंडियाने विकसित केलेली वीजतंत्री प्रयोगशाळा २'),
  g('trade-electrician-1', 'workshops', 'Electrician trainees at control panels', 'नियंत्रण पॅनेलवर वीजतंत्री प्रशिक्षणार्थी'),
  g('trade-electrician-2', 'workshops', 'Practical on motor starters', 'मोटर स्टार्टरचे प्रात्यक्षिक'),
  g('trade-electronics-1', 'workshops', 'Electronics trainee testing a circuit', 'सर्किट तपासताना इलेक्ट्रॉनिक्स प्रशिक्षणार्थी'),
  g('lab-sewing', 'workshops', 'Sewing Technology workshop', 'शिवणकाम तंत्रज्ञान कार्यशाळा'),
  g('trade-sewing-1', 'workshops', 'Trainees on industrial sewing machines', 'औद्योगिक शिलाई यंत्रांवर प्रशिक्षणार्थी'),
  g('trade-fdt-1', 'workshops', 'Fashion Design trainees sketching', 'रेखाटन करताना फॅशन डिझाइन प्रशिक्षणार्थी'),
  g('lab-inauguration-1', 'csr', 'Inauguration of the renovated Electrician lab', 'नूतनीकृत वीजतंत्री प्रयोगशाळेचे उद्घाटन'),
  g('lab-inauguration-2', 'csr', 'Pooja at the Electrician lab inauguration', 'वीजतंत्री प्रयोगशाळा उद्घाटनप्रसंगी पूजन'),
  g('visit-1', 'visits', 'Industrial visit — group photo', 'औद्योगिक भेट — समूह छायाचित्र'),
  g('visit-2', 'visits', 'Visit to a garment manufacturing unit', 'वस्त्र उत्पादन केंद्राला भेट'),
  g('visit-3', 'visits', 'Trainees at a partner workplace', 'भागीदार कार्यस्थळी प्रशिक्षणार्थी'),
  g('ojt-drill', 'ojt', 'Hands-on tool work during OJT', 'OJT दरम्यान प्रत्यक्ष साधनांवर काम'),
  g('ojt-helmets', 'ojt', 'Solar-plant field training', 'सौर प्रकल्पावर क्षेत्रीय प्रशिक्षण'),
  g('ojt-solar', 'ojt', 'Learning panel connections on site', 'प्रत्यक्ष ठिकाणी पॅनेल जोडणी शिकताना'),
  g('ojt-tatapower-1', 'ojt', 'Trainees at Tata Power', 'टाटा पॉवर येथे प्रशिक्षणार्थी'),
  g('ojt-tatapower-2', 'ojt', 'OJT batch at Tata Power', 'टाटा पॉवर येथील OJT तुकडी'),
  g('ojt-assembly', 'ojt', 'Assembly work at a partner company', 'भागीदार कंपनीत जोडणीचे काम'),
  g('exhibition-3', 'exhibitions', 'ICTSM smart-city model at the technical exhibition', 'तंत्र प्रदर्शनातील ICTSM स्मार्ट सिटी मॉडेल'),
  g('exhibition-1', 'exhibitions', 'Inauguration of the technical exhibition', 'तंत्र प्रदर्शनाचे उद्घाटन'),
  g('exhibition-2', 'exhibitions', 'Handicraft and décor display', 'हस्तकला व सजावट प्रदर्शन'),
  g('annual-3', 'annual', 'Group dance at the annual function', 'स्नेहसंमेलनातील समूह नृत्य'),
  g('annual-1', 'annual', 'Patriotic performance', 'देशभक्तीपर सादरीकरण'),
  g('annual-2', 'annual', 'Cultural performance on stage', 'रंगमंचावर सांस्कृतिक सादरीकरण'),
  g('sports-kho-kho', 'sports', 'Kho-kho match during annual sports', 'वार्षिक क्रीडा स्पर्धेतील खो-खो'),
  g('sports-chess', 'sports', 'Chess competition', 'बुद्धिबळ स्पर्धा'),
  g('sports-carrom', 'sports', 'Carrom tournament', 'कॅरम स्पर्धा'),
  g('womens-day-rangoli', 'womens-day', 'Women’s Day rangoli competition', 'महिला दिन रांगोळी स्पर्धा'),
  g('womens-day-panel', 'womens-day', 'Women’s Day programme, 8 March 2023', 'महिला दिन कार्यक्रम, ८ मार्च २०२३'),
  g('udyam-1', 'udyam', 'Udyam project showcase', 'उद्यम प्रकल्प प्रदर्शन'),
  g('udyam-2', 'udyam', 'Presenting product ideas', 'उत्पादन कल्पनांचे सादरीकरण'),
  g('udyam-3', 'udyam', 'Udyam Shiksha batch', 'उद्यम शिक्षा तुकडी'),
  g('udyam-4', 'udyam', 'Trainees with their prototypes', 'आपल्या प्रोटोटाइपसह प्रशिक्षणार्थी'),
  g('udyam-5', 'udyam', 'Student Leadership Programme', 'विद्यार्थी नेतृत्व कार्यक्रम'),
  g('jayanti-1', 'celebrations', 'Jayanti observance on campus', 'परिसरात जयंती कार्यक्रम'),
  g('jayanti-2', 'celebrations', 'Paying tribute on Jayanti', 'जयंतीनिमित्त अभिवादन'),
  g('plantation-drive', 'campus', 'Trainees planting saplings', 'रोपे लावताना प्रशिक्षणार्थी'),
  g('cleanliness-drive', 'campus', 'Campus cleanliness drive', 'परिसर स्वच्छता मोहीम'),
];
