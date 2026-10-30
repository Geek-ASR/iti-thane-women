# Govt. ITI (Women), Thane — Website & Smart Campus

Official website and Smart Campus portal for **Rajmata Jijau Government Industrial Training Institute (Women), Thane** (राजमाता जिजाऊ शासकीय औद्योगिक प्रशिक्षण संस्था (मुलींची), ठाणे) — a Government of Maharashtra institute under the Directorate of Vocational Education & Training (DVET).

**Live preview:** https://geek-asr.github.io/iti-thane-women/

---

## What’s inside

### Public website (English + मराठी)
- **Home** — hero with real campus photography, quick-access grid, key numbers, trades explorer, 8-year results chart, industry partners, Smart Campus showcase, notices & events, Principal’s message, admission call-to-action and campus map.
- **11 trade pages** — duration, eligibility, units, intake, syllabus highlights, career paths, CSR-built labs, on-the-job training partners, enquiry form and `Course` structured data.
- **Admissions guide** — DVET CAP process, timeline, eligibility by trade, an interactive document checklist (remembered on the device), scholarships & allowances, FAQs and a callback form.
- About (history, vision & mission, Principal’s message, results table, Institute Management Committee), faculty & staff directory, labs & infrastructure, girls’ hostel, student life, placements, industry & CSR, gallery (13 albums, swipeable lightbox), notice board, news & events, downloads, FAQ, contact, grievance & women’s safety, RTI, accessibility statement, sitemap and all GIGW policy pages.
- **Mobile-first**: bottom quick-navigation dock, thumb-sized targets, swipe carousels, no horizontal scrolling, click-to-load map.
- **Accessibility (GIGW / WCAG 2.1 AA)**: skip link, text-size controls (A− A A+ A++), high-contrast mode, full keyboard support, correct language tags, reduced-motion support, table views for every chart.
- **SEO**: static HTML for every page in both languages, canonical + `hreflang` alternates, Open Graph cards, `sitemap.xml`, JSON-LD (`EducationalOrganization`, `Course`, `FAQPage`).

### Smart Campus portal (`/portal/`)
| Module | Highlights |
|---|---|
| **Smart attendance** | Instructor starts a session → rotating QR code + 6-digit code (changes every 15 s, HMAC-signed). Trainees scan with the phone camera or type the code. Location check flags marks made away from campus; one phone marking several trainees is flagged. Live roster, manual override, projector view, CSV export, monthly reports, 80 % eligibility alerts. |
| **Online quizzes** | MCQ builder (or paste questions in bulk), per-trainee shuffling of questions and options, timer with auto-submit, autosave, tab-switch detection, instant results with answer review, ranks, score distribution and question-difficulty analytics. |
| **Job & placement portal** | Verified employers post jobs / apprenticeships / internships / campus drives; the placement cell approves them; trainees apply in one tap; employers move applicants through a pipeline; trainees track status. Built-in profile and printable resume. |
| **Website CMS** | The office edits notices, events, gallery, downloads and the staff directory (bilingual), and site switches such as the notice ticker and the “admissions open” banner. |
| **People & batches** | Trainee/staff/employer accounts, approvals, CSV/Excel import of trainees, temporary passwords, batch ↔ instructor mapping. |

The portal is an installable PWA (home-screen icon, offline shell). Share **`/app/`** to get people onto it: it opens an install page in the visitor's language, with a one-tap install on Android, Add to Home Screen steps for iPhone, and a QR code for desktop visitors.

---

## Preview mode vs. live mode

The site is a static export, so it can be hosted anywhere (GitHub Pages today).

- **Preview mode** (default — no `NEXT_PUBLIC_API_URL`): the portal runs on an in-browser demo server with realistic sample data that is stored only in the visitor’s browser. Everything works and nothing is shared, which makes it ideal for demonstrations. A yellow bar shows this mode and offers **Reset demo**.
- **Live mode** (`NEXT_PUBLIC_API_URL` set): the portal and CMS talk to the Smart Campus API (separate repository). Public pages keep working from bundled content even if the API is briefly unreachable.

**Demo accounts** (preview mode — one-tap buttons on the sign-in page, password `demo123`):

| Role | Sign-in |
|---|---|
| Trainee | `priya@demo.itithane.in` |
| Instructor | `instructor@demo.itithane.in` |
| Admin / TPO | `admin@demo.itithane.in` |
| Employer | `hr@konkanpower.demo` |

---

## Getting started

Requires Node.js 20.9+.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in ./out
npm run preview      # serve ./out on http://localhost:4173
npm run typecheck
```

Environment variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Smart Campus API base URL. Empty = preview mode. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for canonical links and social cards. |
| `NEXT_PUBLIC_BASE_PATH` | Sub-path when hosted at `/<repo>/` (set automatically on GitHub Pages). |

---

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

1. **Settings → Pages → Source: GitHub Actions.**
2. To go live with the backend, add **Settings → Secrets and variables → Actions → Variables**:
   - `API_URL` = `https://<your-api-host>` (no trailing slash)
   - optionally `SITE_URL` when using a custom domain
3. Re-run the workflow (**Actions → Deploy website to GitHub Pages → Run workflow**).

**Custom domain** (e.g. `itithanewomen.in`): add it under Settings → Pages, set `SITE_URL` to the domain, and the base path becomes empty automatically.

---

## Project structure

```
src/
  app/
    [lang]/…            public pages (en, mr) — statically generated
    portal/…            Smart Campus screens (client-side app)
  components/
    site/               header, mobile menu, dock, footer, ticker, search
    public/             trade cards, gallery, notices, forms, map, charts
    portal/             portal shell, UI kit, QR scanner, job widgets
  content/              all institute content (bilingual) + image manifest
  lib/
    api.ts              single data-access layer (live API or demo server)
    demo/               in-browser demo server + seed data
    cms.ts              CMS-backed content hooks with bundled fallbacks
    attendance-core.ts  rotating-token + geofence logic (mirrors the API)
public/images/          optimised WebP photos (800 / 1600 px)
scripts/                exports content & demo fixtures for the API seed
```

### Editing content
- **Without the backend**: edit the typed, bilingual files in `src/content/` (`institute.ts`, `trades.ts`, `campus.ts`, `industry.ts`, `life.ts`, `updates.ts`, `staff.ts`, `faq.ts`, `policies.ts`) and push.
- **With the backend**: notices, events, gallery, downloads, staff and site settings are managed from **Portal → Website content / Settings**.

### Photos
Photos come from the institute’s own presentations. To add or replace one, export a WebP at 800 px and 1600 px into `public/images/<name>-800.webp` / `-1600.webp`, add its width, height and placeholder colour to `src/content/images.json`, and reference `<name>` from the content files. Uploads through the CMS need none of this.

### Syncing the API seed
After changing bundled content, refresh the backend seed:

```bash
npx tsx scripts/export-cms-seed.ts     > ../api/src/seed-data/cms.json
npx tsx scripts/export-demo-fixture.ts > ../api/src/seed-data/demo.json
```

---

## Tech

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · lucide icons · `qrcode` / `jsQR` · self-hosted Google Fonts (Fraunces, Plus Jakarta Sans, Mukta, Tiro Devanagari Marathi).

Content sources: institute presentations (2022-23 grading report and institute profile), the DPR submitted by the institute, and the institute page on mumbai.dvet.gov.in.

---

Designed & developed by **Aditya Rekhe** for Govt. ITI (Women), Thane.
