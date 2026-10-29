import type { L } from '@/lib/i18n';

export type Policy = { slug: string; title: L; sections: { h?: L; p: L[] }[] };

export const policies: Policy[] = [
  {
    slug: 'privacy',
    title: { en: 'Privacy policy', mr: 'गोपनीयता धोरण' },
    sections: [
      { p: [{ en: 'This website does not automatically capture any personal information that allows us to identify you individually. We collect personal information — such as your name, mobile number or email — only when you choose to submit an enquiry, grievance or registration form, and we use it solely to respond to you or to provide the requested service.', mr: 'हे संकेतस्थळ आपली वैयक्तिक ओळख पटवणारी कोणतीही माहिती आपोआप गोळा करत नाही. आपण चौकशी, तक्रार किंवा नोंदणी अर्ज स्वेच्छेने सादर केल्यासच नाव, मोबाईल क्रमांक किंवा ई-मेल अशी माहिती घेतली जाते व ती केवळ आपल्याला प्रतिसाद देण्यासाठी किंवा मागितलेली सेवा देण्यासाठी वापरली जाते.' }] },
      { h: { en: 'Portal data', mr: 'पोर्टलवरील माहिती' }, p: [{ en: 'The Smart Campus portal stores trainee records such as attendance, quiz results, profiles and job applications. This data is accessible only to authorised staff, the trainee concerned and — for job applications — the employer the trainee has applied to. Attendance may record approximate location at the moment of marking, only to verify presence on campus.', mr: 'स्मार्ट कॅम्पस पोर्टलवर उपस्थिती, प्रश्नमंजुषा निकाल, प्रोफाइल व नोकरी अर्ज अशा नोंदी ठेवल्या जातात. ही माहिती केवळ अधिकृत कर्मचारी, संबंधित प्रशिक्षणार्थी व — नोकरी अर्जांबाबत — प्रशिक्षणार्थीने अर्ज केलेल्या नियोक्त्यालाच उपलब्ध असते. उपस्थिती नोंदवताना परिसरातील उपस्थिती पडताळण्यासाठीच अंदाजे स्थान नोंदवले जाऊ शकते.' }] },
      { h: { en: 'Sharing', mr: 'माहितीची देवाणघेवाण' }, p: [{ en: 'We do not sell or share personal information with any third party for commercial purposes. Information may be disclosed only where required by law or to the Directorate of Vocational Education & Training for official purposes.', mr: 'आम्ही वैयक्तिक माहिती व्यावसायिक हेतूने कोणत्याही त्रयस्थ पक्षाला विकत किंवा देत नाही. कायद्याने आवश्यक असल्यास किंवा शासकीय कामासाठी व्यवसाय शिक्षण व प्रशिक्षण संचालनालयालाच माहिती दिली जाऊ शकते.' }] },
      { h: { en: 'Cookies & local storage', mr: 'कुकीज व स्थानिक साठवण' }, p: [{ en: 'We use your browser’s local storage only to remember preferences such as language, text size and contrast, and to keep you signed in to the portal. No advertising or tracking cookies are used.', mr: 'भाषा, अक्षर आकार व कॉन्ट्रास्ट अशा पसंती लक्षात ठेवण्यासाठी व पोर्टलवर लॉगिन राहण्यासाठीच ब्राउझरची स्थानिक साठवण वापरली जाते. जाहिरात किंवा ट्रॅकिंग कुकीज वापरल्या जात नाहीत.' }] },
    ],
  },
  {
    slug: 'terms',
    title: { en: 'Terms of use', mr: 'वापराच्या अटी' },
    sections: [
      { p: [{ en: 'This website is designed, developed and maintained for Rajmata Jijau Government Industrial Training Institute (Women), Thane, under the Directorate of Vocational Education & Training, Government of Maharashtra. Though all efforts have been made to ensure the accuracy of the content, it should not be construed as a statement of law or used for any legal purposes.', mr: 'हे संकेतस्थळ व्यवसाय शिक्षण व प्रशिक्षण संचालनालय, महाराष्ट्र शासन अंतर्गत राजमाता जिजाऊ शासकीय औद्योगिक प्रशिक्षण संस्था (मुलींची), ठाणे यांच्यासाठी तयार करण्यात आले आहे. मजकूर अचूक ठेवण्याचा सर्वतोपरी प्रयत्न केला असला तरी तो कायदेशीर विधान म्हणून किंवा कायदेशीर कारणांसाठी वापरू नये.' }] },
      { p: [{ en: 'In case of any ambiguity or doubt, users are advised to verify with the institute and/or the official notifications of DVET (dvet.gov.in) and DGT (dgt.gov.in). Admission schedules, seat matrices and fees published by DVET prevail over the information on this website.', mr: 'कोणत्याही शंकेच्या बाबतीत संस्थेकडे व/किंवा संचालनालय (dvet.gov.in) व DGT (dgt.gov.in) यांच्या अधिकृत अधिसूचनांद्वारे खात्री करावी. संचालनालयाने प्रसिद्ध केलेले प्रवेश वेळापत्रक, जागा व शुल्क या संकेतस्थळावरील माहितीपेक्षा ग्राह्य धरले जाईल.' }] },
      { h: { en: 'Portal accounts', mr: 'पोर्टल खाती' }, p: [{ en: 'Portal users must keep their passwords confidential and must not mark attendance or attempt quizzes on behalf of another person. Misuse may lead to disciplinary action under institute rules.', mr: 'पोर्टल वापरकर्त्यांनी आपला पासवर्ड गोपनीय ठेवावा व दुसऱ्याच्या वतीने उपस्थिती नोंदवू नये किंवा प्रश्नमंजुषा सोडवू नये. गैरवापर केल्यास संस्थेच्या नियमांनुसार शिस्तभंगाची कारवाई होऊ शकते.' }] },
    ],
  },
  {
    slug: 'copyright',
    title: { en: 'Copyright policy', mr: 'प्रताधिकार धोरण' },
    sections: [
      { p: [{ en: 'Material on this website may be reproduced free of charge after taking proper permission by sending a mail to iti.thaneg@dvet.gov.in. The material must be reproduced accurately and not used in a derogatory manner or in a misleading context. Wherever the material is published or issued to others, the source must be prominently acknowledged.', mr: 'iti.thaneg@dvet.gov.in वर ई-मेल पाठवून योग्य परवानगी घेतल्यानंतर या संकेतस्थळावरील मजकूर विनामूल्य पुनर्प्रकाशित करता येईल. मजकूर अचूकपणे वापरावा, अवमानकारक किंवा दिशाभूल करणाऱ्या संदर्भात वापरू नये व स्रोताचा स्पष्ट उल्लेख करावा.' }] },
      { p: [{ en: 'The permission to reproduce this material does not extend to any material identified as being the copyright of a third party, including names and marks of industry partners. Authorisation to reproduce such material must be obtained from the copyright holders concerned.', mr: 'उद्योग भागीदारांची नावे व चिन्हे यांसह त्रयस्थ पक्षाचा प्रताधिकार असलेल्या मजकुरासाठी ही परवानगी लागू नाही. अशा मजकुरासाठी संबंधित प्रताधिकारधारकांची परवानगी घ्यावी.' }] },
    ],
  },
  {
    slug: 'hyperlinking',
    title: { en: 'Hyperlinking policy', mr: 'हायपरलिंक धोरण' },
    sections: [
      { h: { en: 'Links to external websites', mr: 'बाह्य संकेतस्थळांचे दुवे' }, p: [{ en: 'At many places on this website you will find links to other websites and portals. These links are placed for your convenience. The institute is not responsible for the contents and reliability of linked websites and does not necessarily endorse the views expressed in them.', mr: 'या संकेतस्थळावर अनेक ठिकाणी इतर संकेतस्थळे व पोर्टलचे दुवे आहेत. ते आपल्या सोयीसाठी दिले आहेत. जोडलेल्या संकेतस्थळांच्या मजकुराची व विश्वासार्हतेची जबाबदारी संस्थेची नाही.' }] },
      { h: { en: 'Links to this website', mr: 'या संकेतस्थळाचे दुवे' }, p: [{ en: 'We do not object to you linking directly to information hosted on this website and no prior permission is required. However, we would like you to inform us about any links provided to this website, and we do not permit our pages to be loaded into frames on your site.', mr: 'या संकेतस्थळावरील माहितीला थेट दुवा देण्यास आमची हरकत नाही व पूर्वपरवानगीची गरज नाही. मात्र दुव्याबाबत आम्हाला कळवावे; आमची पाने आपल्या संकेतस्थळावर फ्रेममध्ये दाखवण्यास परवानगी नाही.' }] },
    ],
  },
  {
    slug: 'disclaimer',
    title: { en: 'Disclaimer', mr: 'अस्वीकरण' },
    sections: [
      { p: [{ en: 'The information on this website is provided for general guidance. While every effort is made to keep it updated and accurate, the institute accepts no liability for any loss or damage arising from its use. Statistics such as pass and apprenticeship rates are based on institute records for the periods stated.', mr: 'या संकेतस्थळावरील माहिती सर्वसाधारण मार्गदर्शनासाठी आहे. ती अद्ययावत व अचूक ठेवण्याचा प्रयत्न केला जातो, तरी तिच्या वापरामुळे होणाऱ्या कोणत्याही नुकसानीची जबाबदारी संस्था स्वीकारत नाही. निकाल व शिकाऊ उमेदवारी दर यांसारखी आकडेवारी नमूद कालावधीतील संस्थेच्या नोंदींवर आधारित आहे.' }] },
      { p: [{ en: 'Names of companies appear on this website only to acknowledge their CSR, training or recruitment association with the institute and do not imply any endorsement.', mr: 'कंपन्यांची नावे केवळ त्यांच्या CSR, प्रशिक्षण किंवा भरतीविषयक सहकार्याची नोंद म्हणून दिली आहेत; त्यातून कोणतेही समर्थन सूचित होत नाही.' }] },
    ],
  },
];

export const accessibilityStatement: { h?: L; p: L[] }[] = [
  { p: [{ en: 'We are committed to ensuring that this website is accessible to all users irrespective of device, technology or ability. It has been built to follow the Guidelines for Indian Government Websites (GIGW) and WCAG 2.1 Level AA as closely as possible.', mr: 'उपकरण, तंत्रज्ञान किंवा क्षमता कोणतीही असो, हे संकेतस्थळ सर्वांना सुलभ असावे यासाठी आम्ही कटिबद्ध आहोत. भारतीय शासकीय संकेतस्थळ मार्गदर्शक तत्त्वे (GIGW) व WCAG 2.1 AA यांचे शक्य तितके पालन केले आहे.' }] },
  { h: { en: 'Features', mr: 'वैशिष्ट्ये' }, p: [
    { en: '“Skip to main content” link for keyboard and screen-reader users.', mr: 'कीबोर्ड व स्क्रीन रीडर वापरकर्त्यांसाठी “मुख्य मजकुराकडे जा” दुवा.' },
    { en: 'Text-size controls (A−, A, A+, A++) and a high-contrast mode in the top bar.', mr: 'वरच्या पट्टीत अक्षर आकार नियंत्रण (A−, A, A+, A++) व उच्च कॉन्ट्रास्ट मोड.' },
    { en: 'Full keyboard navigation with visible focus indicators.', mr: 'दृश्य फोकस निर्देशकांसह संपूर्ण कीबोर्ड नेव्हिगेशन.' },
    { en: 'Content in English and Marathi, with correct language tags for screen readers.', mr: 'स्क्रीन रीडरसाठी योग्य भाषा टॅगसह इंग्रजी व मराठी मजकूर.' },
    { en: 'Text alternatives for images, and animations that respect “reduce motion” settings.', mr: 'प्रतिमांसाठी पर्यायी मजकूर व “कमी हालचाल” सेटिंगचा आदर करणारी ॲनिमेशन.' },
  ] },
  { h: { en: 'Screen readers', mr: 'स्क्रीन रीडर' }, p: [{ en: 'The website works with free screen readers such as NVDA (Windows), TalkBack (Android) and VoiceOver (iOS / macOS).', mr: 'NVDA (Windows), TalkBack (Android) व VoiceOver (iOS / macOS) अशा मोफत स्क्रीन रीडरसोबत संकेतस्थळ कार्य करते.' }] },
  { h: { en: 'Feedback', mr: 'अभिप्राय' }, p: [{ en: 'If you face any difficulty in accessing information on this website, please write to iti.thaneg@dvet.gov.in so we can help and improve.', mr: 'या संकेतस्थळावरील माहिती मिळवताना अडचण आल्यास कृपया iti.thaneg@dvet.gov.in वर कळवा.' }] },
];
