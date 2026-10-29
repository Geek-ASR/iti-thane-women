import { BASE_PATH } from '@/lib/config';

const pick = `(function(){var b=${JSON.stringify(BASE_PATH)};var l='en';try{var s=localStorage.getItem('iti.lang');if(s==='mr'||s==='en')l=s;else if((navigator.language||'').toLowerCase().indexOf('mr')===0)l='mr';}catch(e){}location.replace(b+'/'+l+'/'+location.hash);})();`;

/** Root: send visitors to their language (saved preference, then browser language, else English). */
export default function RootRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`2; url=${BASE_PATH}/en/`} />
      <link rel="canonical" href={`${BASE_PATH}/en/`} />
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      <main className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p className="font-display text-2xl font-semibold text-brand-950">Govt. ITI (Women), Thane</p>
          <p className="mt-1 text-stone-600">शासकीय औद्योगिक प्रशिक्षण संस्था (मुलींची), ठाणे</p>
          <div className="mt-6 flex justify-center gap-3">
            <a className="rounded-full bg-brand-700 px-5 py-2.5 font-semibold text-white" href={`${BASE_PATH}/en/`}>
              English
            </a>
            <a className="rounded-full bg-marigold-400 px-5 py-2.5 font-semibold text-brand-950" href={`${BASE_PATH}/mr/`} lang="mr">
              मराठी
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
