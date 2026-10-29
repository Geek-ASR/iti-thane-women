import type { Metadata } from 'next';
import { Mail, MapPin, Navigation, Phone, TrainFront } from 'lucide-react';
import { t, tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { institute } from '@/content/institute';
import { buttonClass, PageHero, Section } from '@/components/ui';
import { EnquiryForm } from '@/components/public/EnquiryForm';
import { MapEmbed } from '@/components/public/MapEmbed';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/contact/', lang === 'mr' ? 'संपर्क' : 'Contact us', lang === 'mr' ? 'पत्ता, दूरध्वनी, ई-मेल, नकाशा व संपर्क अर्ज.' : 'Address, phone numbers, email, directions and an enquiry form for Govt. ITI (Women), Kopri Colony, Thane (East).');
}

export default async function Contact({ params }: Props) {
  const { lang } = await params;
  const ui = t(lang);
  const mr = lang === 'mr';
  const offices = [
    { label: institute.dveto.label, email: institute.dveto.email },
    { label: institute.regionalOffice.label, email: institute.regionalOffice.email },
  ];
  return (
    <>
      <PageHero lang={lang} title={mr ? 'संपर्क' : 'Contact us'} lead={mr ? 'आम्ही आपल्या प्रश्नांची उत्तरे देण्यास तत्पर आहोत.' : 'We are happy to answer your questions about admissions, trades and campus life.'} crumbs={[{ label: ui.contact }]} />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {institute.phones.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} className="group rounded-3xl bg-white p-6 shadow-soft ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 group-hover:bg-brand-700 group-hover:text-white">
                <Phone className="size-5" aria-hidden />
              </span>
              <p className="mt-4 text-sm text-stone-500">{tx(p.label, lang)}</p>
              <p className="mt-0.5 text-lg font-bold text-brand-950">{p.display}</p>
            </a>
          ))}
          <a href={`mailto:${institute.email}`} className="group rounded-3xl bg-white p-6 shadow-soft ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 group-hover:bg-brand-700 group-hover:text-white">
              <Mail className="size-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm text-stone-500">{ui.email}</p>
            <p className="mt-0.5 text-lg font-bold break-all text-brand-950">{institute.email}</p>
          </a>
          <a href={institute.directionsUrl} target="_blank" rel="noopener noreferrer" className="group rounded-3xl bg-brand-900 p-6 text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className="grid size-12 place-items-center rounded-2xl bg-marigold-400 text-brand-950">
              <Navigation className="size-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm text-white/65">{ui.directions}</p>
            <p className="mt-0.5 text-lg font-bold">Kopri Colony, Thane (E)</p>
          </a>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-line">
              <p className="flex items-center gap-2 font-semibold text-brand-950">
                <MapPin className="size-5 text-brand-600" aria-hidden />
                {mr ? 'पत्ता' : 'Address'}
              </p>
              <address className="mt-3 text-stone-700 not-italic">
                <span className="block font-semibold">{tx(institute.name, lang)}</span>
                {institute.addressLines[lang].map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </address>
            </div>
            <div className="rounded-3xl bg-white p-6 ring-1 ring-line">
              <p className="flex items-center gap-2 font-semibold text-brand-950">
                <TrainFront className="size-5 text-brand-600" aria-hidden />
                {mr ? 'कसे पोहोचावे' : 'Getting here'}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-stone-700">
                <li>{mr ? 'ठाणे रेल्वे स्थानक (पूर्व बाजू) येथून सुमारे १०–१५ मिनिटे चालत.' : 'About a 10–15 minute walk from the east side of Thane railway station.'}</li>
                <li>{mr ? 'जवळचा बस थांबा: ठाणे स्टेशन (पूर्व) कोपरी.' : 'Nearest bus stop: Thane Station (East) Kopri.'}</li>
                <li>{mr ? 'शासकीय तांत्रिक विद्यालयाच्या परिसरात संस्था आहे.' : 'The institute is inside the Government Technical High School campus.'}</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-paper p-6 ring-1 ring-line">
              <p className="font-semibold text-brand-950">{mr ? 'वरिष्ठ कार्यालये' : 'Supervising offices'}</p>
              <ul className="mt-3 space-y-3 text-sm">
                {offices.map((o) => (
                  <li key={o.email}>
                    <span className="block text-stone-700">{tx(o.label, lang)}</span>
                    <a href={`mailto:${o.email}`} className="font-semibold text-brand-700 hover:underline">{o.email}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <MapEmbed lang={lang} className="min-h-96" />
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="display-tight font-display text-3xl font-semibold text-brand-950 sm:text-4xl">{mr ? 'आम्हाला संदेश पाठवा' : 'Send us a message'}</h2>
            <p className="mt-4 text-stone-600">{mr ? 'प्रवेशाबद्दल प्रश्न असल्यास प्रवेश पानावरील चौकशी अर्ज वापरा.' : 'For admission questions you can also use the callback form on the Admissions page.'}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${institute.phones[0].tel}`} className={buttonClass('primary')}>
                <Phone className="size-4" aria-hidden /> {ui.call}
              </a>
              <a href={`mailto:${institute.email}`} className={buttonClass('outline')}>
                <Mail className="size-4" aria-hidden /> {ui.email}
              </a>
            </div>
          </div>
          <div className="rounded-3xl bg-paper p-5 ring-1 ring-line sm:p-8">
            <EnquiryForm lang={lang} type="contact" />
          </div>
        </div>
      </Section>
    </>
  );
}
