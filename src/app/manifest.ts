import type { MetadataRoute } from 'next';
import { BASE_PATH } from '@/lib/config';

export const dynamic = 'force-static';

/** Phone screenshots shown in the browser's install sheet (public/screenshots, 780×1688). */
const screenshots = [
  { file: 'home', label: 'Trainee home with attendance, quizzes and job openings' },
  { file: 'attendance-qr', label: 'Instructor showing the rotating attendance QR code' },
  { file: 'marked-present', label: 'Attendance marked in seconds' },
  { file: 'jobs', label: 'Verified jobs and apprenticeships' },
];

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${BASE_PATH}/portal/`,
    name: 'Govt. ITI (Women), Thane — Smart Campus',
    short_name: 'ITI Thane',
    description: 'Mark attendance with a QR scan, take quizzes and apply for jobs — the Smart Campus app of Govt. ITI (Women), Thane.',
    start_url: `${BASE_PATH}/portal/`,
    scope: `${BASE_PATH}/`,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fbfaf7',
    theme_color: '#1d1856',
    lang: 'en-IN',
    categories: ['education'],
    icons: [
      { src: `${BASE_PATH}/icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { src: `${BASE_PATH}/icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
      { src: `${BASE_PATH}/icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    screenshots: screenshots.map((s) => ({ src: `${BASE_PATH}/screenshots/${s.file}.webp`, sizes: '780x1688', type: 'image/webp', form_factor: 'narrow' as const, label: s.label })),
  };
}
