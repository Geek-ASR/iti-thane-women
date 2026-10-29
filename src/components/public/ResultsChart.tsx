'use client';

import { ColumnChart } from '@/components/charts';
import { results } from '@/content/institute';
import type { Locale } from '@/lib/i18n';

export function ResultsChart({ lang }: { lang: Locale }) {
  const mr = lang === 'mr';
  const data = results.map((r) => ({
    label: r.session.replace('Aug ', ''),
    value: r.passPct,
    detail: mr ? `${r.appeared} पैकी ${r.passed} उत्तीर्ण` : `${r.passed} of ${r.appeared} passed`,
  }));
  const maxIdx = data.reduce((m, d, i) => (d.value > data[m].value ? i : m), 0);
  return (
    <ColumnChart
      data={data}
      labelIdx={[maxIdx, data.length - 1]}
      format={(v) => `${Number.isInteger(v) ? v : v.toFixed(1)}%`}
      caption={mr ? 'प्रवेश सत्रनिहाय निकालाची टक्केवारी, २०१६–२०२३' : 'Pass percentage by admission session, 2016–2023'}
      headers={[mr ? 'प्रवेश सत्र' : 'Admission session', mr ? 'निकाल' : 'Pass rate']}
      height={190}
    />
  );
}
