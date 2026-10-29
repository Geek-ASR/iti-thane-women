import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-brand-950 p-6 text-center text-white">
      <div aria-hidden className="bg-dots absolute inset-0 opacity-50" />
      <div className="relative">
        <p className="font-display text-8xl font-semibold text-marigold-400">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Page not found</h1>
        <p lang="mr" className="mt-1 text-lg text-white/80">
          हे पान सापडले नाही
        </p>
        <p className="mx-auto mt-4 max-w-md text-white/70">The page may have moved. Use the links below to continue.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/en/" className="rounded-full bg-marigold-400 px-5 py-2.5 font-semibold text-brand-950">
            Home
          </Link>
          <Link href="/mr/" lang="mr" className="rounded-full bg-white/10 px-5 py-2.5 font-semibold ring-1 ring-white/25">
            मुख्यपृष्ठ
          </Link>
          <Link href="/portal/" className="rounded-full bg-white/10 px-5 py-2.5 font-semibold ring-1 ring-white/25">
            Student Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
