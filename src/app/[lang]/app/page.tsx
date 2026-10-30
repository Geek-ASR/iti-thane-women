import type { Metadata } from 'next';
import QRCode from 'qrcode';
import { ChevronDown } from 'lucide-react';
import { DEMO_MODE, SITE_URL } from '@/lib/config';
import { tx, type L, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { Icon } from '@/components/Icon';
import { PageHero, Section, SectionHeading } from '@/components/ui';
import { InstallButton, InstallSteps, ShareApp } from '@/components/public/InstallApp';

type Props = { params: Promise<{ lang: Locale }> };

/** The link to share: /app/ opens this page in the visitor's language. */
const APP_LINK = `${SITE_URL}/app/`;

const features: { icon: string; title: L; desc: L }[] = [
  { icon: 'QrCode', title: { en: 'Attendance in seconds', mr: 'काही सेकंदांत उपस्थिती' }, desc: { en: 'Scan the class QR code to mark yourself present, and see your % for exam eligibility.', mr: 'वर्गातील QR कोड स्कॅन करून उपस्थिती नोंदवा आणि परीक्षा पात्रतेसाठी तुमची टक्केवारी पाहा.' } },
  { icon: 'ListChecks', title: { en: 'Quizzes & results', mr: 'प्रश्नमंजुषा व निकाल' }, desc: { en: 'Take timed tests, get instant results and review your answers.', mr: 'वेळबद्ध चाचण्या द्या, त्वरित निकाल मिळवा आणि उत्तरे तपासा.' } },
  { icon: 'BriefcaseBusiness', title: { en: 'Jobs & apprenticeships', mr: 'नोकरी व शिकाऊ उमेदवारी' }, desc: { en: 'Apply to verified openings with a ready-made resume.', mr: 'तयार रेझ्युमेसह पडताळलेल्या संधींसाठी अर्ज करा.' } },
  { icon: 'UsersRound', title: { en: 'For instructors too', mr: 'निदेशकांसाठीही' }, desc: { en: 'Run attendance, see reports and set quizzes from your phone.', mr: 'फोनवरूनच उपस्थिती घ्या, अहवाल पाहा व प्रश्नमंजुषा तयार करा.' } },
];

const faqs: { q: L; a: L }[] = [
  { q: { en: 'Is the app free?', mr: 'ॲप मोफत आहे का?' }, a: { en: 'Yes — free for every trainee, instructor and employer.', mr: 'होय — सर्व प्रशिक्षणार्थी, निदेशक व नियोक्त्यांसाठी मोफत.' } },
  {
    q: { en: 'Why isn’t it on the Play Store?', mr: 'ॲप Play Store वर का नाही?' },
    a: { en: 'It doesn’t need to be. The app installs straight from this page, takes very little space and updates itself whenever you open it online.', mr: 'त्याची गरज नाही. ॲप थेट या पानावरून इंस्टॉल होते, फार कमी जागा घेते आणि ऑनलाइन उघडताच आपोआप अपडेट होते.' },
  },
  {
    q: { en: 'I don’t see an install option.', mr: 'इंस्टॉलचा पर्याय दिसत नाही.' },
    a: {
      en: 'Open this page in Chrome (Android) or Safari (iPhone). If the link opened inside another app such as Instagram or Facebook, first tap ⋮ or the share icon and choose “Open in browser”.',
      mr: 'हे पान Chrome (Android) किंवा Safari (iPhone) मध्ये उघडा. Instagram, Facebook सारख्या दुसऱ्या ॲपमध्ये लिंक उघडली असल्यास आधी ⋮ किंवा शेअर आयकॉन दाबून “Open in browser” निवडा.',
    },
  },
  {
    q: { en: 'How do I remove it?', mr: 'ॲप काढायचे कसे?' },
    a: { en: 'Like any other app: press and hold the ITI Thane icon, then choose Uninstall (Android) or Remove App (iPhone).', mr: 'इतर ॲपप्रमाणेच: ITI Thane आयकॉनवर दाबून धरा आणि Uninstall (Android) किंवा Remove App (iPhone) निवडा.' },
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(
    lang,
    '/app/',
    lang === 'mr' ? 'ॲप मिळवा' : 'Get the app',
    lang === 'mr'
      ? 'ITI Thane स्मार्ट कॅम्पस ॲप तुमच्या Android फोन किंवा iPhone वर इंस्टॉल करा — उपस्थिती, प्रश्नमंजुषा व नोकरीच्या संधी. मोफत, Play Store ची गरज नाही.'
      : 'Install the ITI Thane Smart Campus app on your Android phone or iPhone — attendance, quizzes and jobs. Free, no Play Store needed.',
    '/brand/og-app.jpg',
  );
}

export default async function GetTheApp({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  const qr = await QRCode.toString(APP_LINK, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#120f3a', light: '#ffffff' } });
  return (
    <>
      <PageHero
        lang={lang}
        title={mr ? 'ITI Thane ॲप मिळवा' : 'Get the ITI Thane app'}
        lead={mr ? 'उपस्थिती, प्रश्नमंजुषा व नोकरीच्या संधी — एकाच ॲपमध्ये, तुमच्या फोनवर.' : 'Attendance, quizzes and job openings — in one app on your phone.'}
        crumbs={[{ label: mr ? 'ॲप' : 'Get the app' }]}
        image={
          <figure className="ml-auto w-fit rounded-[1.75rem] bg-white p-5 text-center shadow-lift">
            <div role="img" aria-label={mr ? 'ॲपच्या लिंकचा QR कोड' : 'QR code for the app link'} className="size-52 [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: qr }} />
            <figcaption className="mt-3 text-sm font-semibold text-brand-950">{mr ? 'फोनच्या कॅमेऱ्याने स्कॅन करा' : 'Scan with your phone’s camera'}</figcaption>
          </figure>
        }
      >
        <InstallButton lang={lang} />
      </PageHero>

      <Section id="how-to-install" className="scroll-mt-16" labelledBy="install-h">
        <SectionHeading id="install-h" align="center" eyebrow={mr ? 'इंस्टॉल कसे करावे' : 'How to install'} title={mr ? 'तीन टॅपमध्ये इंस्टॉल करा' : 'Install in three taps'} />
        <InstallSteps lang={lang} />
        {DEMO_MODE && (
          <p className="mx-auto mt-6 max-w-2xl rounded-2xl bg-marigold-50 px-4 py-3 text-center text-sm text-marigold-900 ring-1 ring-marigold-200">
            {mr ? 'पूर्वावलोकन: संस्थेचा सर्व्हर सुरू होईपर्यंत ॲपमध्ये नमुना माहिती दिसते, जी फक्त तुमच्या फोनवर साठवली जाते.' : 'Preview: until the institute’s server goes live, the app shows sample data that is stored only on your phone.'}
          </p>
        )}
      </Section>

      <Section className="bg-white" labelledBy="app-features-h">
        <SectionHeading id="app-features-h" eyebrow={mr ? 'ॲपमध्ये काय आहे' : 'What’s inside'} title={mr ? 'तुमचा अभ्यासक्रम, तुमच्या खिशात' : 'Your course, in your pocket'} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <li key={f.title.en} className="rounded-2xl bg-paper p-5 ring-1 ring-line">
              <span className="grid size-11 place-items-center rounded-xl bg-marigold-400 text-brand-950">
                <Icon name={f.icon} className="size-5" />
              </span>
              <p className="mt-4 font-semibold text-brand-950">{tx(f.title, lang)}</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{tx(f.desc, lang)}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="share-h">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <ShareApp lang={lang} link={APP_LINK} qr={qr} headingId="share-h" />
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-950 sm:text-3xl">{mr ? 'प्रश्नोत्तरे' : 'Questions'}</h2>
            <ul className="mt-5 space-y-3">
              {faqs.map((f) => (
                <li key={f.q.en}>
                  <details className="group rounded-2xl bg-white ring-1 ring-line open:shadow-soft">
                    <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 text-left text-[1.02rem] font-semibold text-brand-950">
                      {tx(f.q, lang)}
                      <ChevronDown className="mt-0.5 size-5 shrink-0 text-brand-600 transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <p className="-mt-1 px-5 pb-5 text-[0.95rem] leading-relaxed text-stone-600">{tx(f.a, lang)}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
