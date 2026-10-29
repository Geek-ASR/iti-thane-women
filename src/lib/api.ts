import { API_URL, DEMO_MODE } from '@/lib/config';

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

const TOKEN_KEY = 'iti.token';

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string | null) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable (private mode) — session lasts for this tab only */
    }
  },
};

export type RequestOptions = { method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'; body?: unknown; query?: Record<string, string | number | boolean | undefined | null> };

const buildQuery = (q?: RequestOptions['query']) => {
  if (!q) return '';
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

/**
 * Single entry point for all data access. In demo mode requests are answered by an
 * in-browser server (lazy-loaded) with the same routes and response shapes as the backend.
 */
export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const method = opts.method ?? 'GET';
  const url = path + buildQuery(opts.query);
  if (DEMO_MODE) {
    const { demoRequest } = await import('@/lib/demo/server');
    return demoRequest<T>(method, url, opts.body, tokenStore.get());
  }
  const token = tokenStore.get();
  const isForm = typeof FormData !== 'undefined' && opts.body instanceof FormData;
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${url}`, {
      method,
      headers: {
        ...(isForm || opts.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: opts.body === undefined ? undefined : isForm ? (opts.body as FormData) : JSON.stringify(opts.body),
    });
  } catch {
    throw new ApiError(0, 'Network error — please check your connection.');
  }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) tokenStore.set(null);
    throw new ApiError(res.status, (data && (data.error as string)) || `Request failed (${res.status})`, data?.details);
  }
  return data as T;
}

/** Absolute URL for a file served by the backend (or a data: URL in demo mode). */
export const fileUrl = (idOrUrl: string | null | undefined) => {
  if (!idOrUrl) return '';
  if (/^(https?:|data:|blob:|\/)/.test(idOrUrl)) return idOrUrl;
  return `${API_URL}/api/files/${idOrUrl}`;
};

export const errorMessage = (e: unknown) => (e instanceof ApiError || e instanceof Error ? e.message : 'Something went wrong');
