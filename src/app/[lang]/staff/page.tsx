import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { sanctionedPosts } from '@/content/staff';
import { PageHero, Section, StatPill } from '@/components/ui';
import { StaffDirectory } from '@/components/public/Interactive';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/staff/', lang === 'mr' ? 'अधिकारी व कर्मचारी' : 'Faculty & staff', lang === 'mr' ? 'प्राचार्य, शिल्प निदेशक व कार्यालयीन कर्मचाऱ्यांची यादी.' : 'Directory of the Principal, craft instructors and office staff of Govt. ITI (Women), Thane.');
}

export default async function Staff({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  return (
    <>
      <PageHero lang={lang} title={mr ? 'अधिकारी व कर्मचारी' : 'Faculty & staff'} lead={mr ? 'अनुभवी शिल्प निदेशक व समर्पित कार्यालयीन कर्मचारी.' : 'Experienced craft instructors and a dedicated office team.'} crumbs={[{ label: mr ? 'संस्थेविषयी' : 'About', path: '/about/' }, { label: mr ? 'अधिकारी व कर्मचारी' : 'Faculty & staff' }]}>
        <div className="grid max-w-md grid-cols-3 gap-3">
          <StatPill value={sanctionedPosts.sanctioned} label={mr ? 'मंजूर पदे' : 'Sanctioned posts'} />
          <StatPill value={sanctionedPosts.filled} label={mr ? 'भरलेली पदे' : 'Filled'} />
          <StatPill value={17} label={mr ? 'शिल्प निदेशक पदे' : 'Craft instructor posts'} />
        </div>
      </PageHero>
      <Section>
        <StaffDirectory lang={lang} />
        <p className="mt-10 text-sm text-stone-500">{mr ? 'ही यादी संस्थेच्या नोंदींनुसार आहे; बदली किंवा नियुक्तीनुसार ती प्रशासन पोर्टलवरून अद्ययावत केली जाते.' : 'Directory as per institute records. It is updated from the admin portal as postings change.'}</p>
      </Section>
    </>
  );
}
