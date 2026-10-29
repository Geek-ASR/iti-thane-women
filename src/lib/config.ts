export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://geek-asr.github.io/iti-thane-women').replace(/\/$/, '');
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

/** Without a backend URL the portal runs on an in-browser demo store. */
export const DEMO_MODE = !API_URL;

/** Prefix a /public path with the deploy base path (next/link does this itself). */
export const asset = (path: string) => `${BASE_PATH}${path}`;

export const BUILD_DATE = process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString().slice(0, 10);
