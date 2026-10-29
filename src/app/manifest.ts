import type { MetadataRoute } from 'next';
import { BASE_PATH } from '@/lib/config';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Govt. ITI (Women), Thane — Smart Campus',
    short_name: 'ITI Thane',
    description: 'Attendance, quizzes and placements for trainees of Govt. ITI (Women), Thane.',
    start_url: `${BASE_PATH}/portal/`,
    scope: `${BASE_PATH}/`,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fbfaf7',
    theme_color: '#1d1856',
    lang: 'en-IN',
    icons: [
      { src: `${BASE_PATH}/icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { src: `${BASE_PATH}/icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
      { src: `${BASE_PATH}/icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
