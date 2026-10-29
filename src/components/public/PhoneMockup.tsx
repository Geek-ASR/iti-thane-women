import { Check, QrCode } from 'lucide-react';

/** Pure-CSS phone showing the Smart Campus attendance screen (no image asset needed). */
export function PhoneMockup({ lang }: { lang: 'en' | 'mr' }) {
  const mr = lang === 'mr';
  return (
    <div aria-hidden className="relative mx-auto w-[15.5rem] sm:w-[17rem]">
      <div className="rounded-[2.6rem] bg-brand-900 p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-paper">
          <div className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-brand-950" />
          <div className="bg-brand-800 px-4 pt-9 pb-5 text-white">
            <p className="text-[0.6rem] font-semibold tracking-wider text-white/60 uppercase">{mr ? 'स्मार्ट उपस्थिती' : 'Smart attendance'}</p>
            <p className="mt-0.5 text-sm font-bold">Electrician · Unit 1</p>
            <p className="text-[0.65rem] text-white/70">{mr ? 'मोटर स्टार्टर — प्रात्यक्षिक' : 'Motor starters — practical'}</p>
          </div>
          <div className="px-4 py-4">
            <div className="relative mx-auto grid size-32 place-items-center rounded-2xl bg-white shadow-soft ring-1 ring-line">
              <svg viewBox="0 0 21 21" className="size-24" shapeRendering="crispEdges">
                {QR.map((row, y) => row.split('').map((c, x) => (c === '1' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#120f3a" /> : null)))}
              </svg>
              <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-marigold-400 text-brand-950 shadow-soft">
                <QrCode className="size-4" />
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2">
              <span className="text-[0.65rem] font-semibold text-brand-800">{mr ? 'कोड' : 'Code'}</span>
              <span className="font-mono text-sm font-bold tracking-[0.3em] text-brand-950">482 913</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-brand-100">
              <div className="h-full w-2/3 rounded-full bg-brand-500" />
            </div>
            <div className="mt-4 space-y-2">
              {['Priya S.', 'Sneha K.', 'Aarti P.'].map((n, i) => (
                <div key={n} className="flex items-center gap-2 rounded-xl bg-white px-2.5 py-2 shadow-soft ring-1 ring-line">
                  <span className="grid size-6 place-items-center rounded-full bg-brand-100 text-[0.55rem] font-bold text-brand-800">{n[0]}</span>
                  <span className="flex-1 text-[0.7rem] font-semibold text-brand-950">{n}</span>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[0.55rem] font-bold text-emerald-700">
                    <Check className="size-2.5" /> {i === 2 ? '09:04' : i === 1 ? '09:02' : '09:01'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 21×21 decorative QR-style pattern (finder squares + noise) — illustrative only.
const QR = [
  '111111101011101111111',
  '100000100110001000001',
  '101110101001101011101',
  '101110100111001011101',
  '101110101100101011101',
  '100000100011001000001',
  '111111101010101111111',
  '000000001101100000000',
  '110101110010111010011',
  '010011001101000101100',
  '101100111010110011010',
  '011010000111001100101',
  '110001101001110101011',
  '000000001110010010100',
  '111111101011011100110',
  '100000101100100101001',
  '101110100011101110110',
  '101110101010010011011',
  '101110100101101100100',
  '100000101110010101011',
  '111111101001101010110',
];
