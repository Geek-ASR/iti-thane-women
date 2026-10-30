import { useCallback, useEffect, useState } from 'react';
import { BASE_PATH } from '@/lib/config';

/** Chrome's `beforeinstallprompt` event (not in the TypeScript DOM library). */
export type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

declare global {
  interface Window {
    /** Caught by the root layout's inline script, so the prompt isn't missed before React hydrates. */
    __itiInstall?: InstallPromptEvent | null;
  }
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` }).catch(() => {});
}

/** The browser's own "Install app" prompt, when it is on offer (Chrome, Edge, Samsung Internet — never iOS). */
export function useInstallPrompt() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const sync = () => setAvailable(!!window.__itiInstall);
    sync();
    window.addEventListener('iti:install', sync);
    registerServiceWorker();
    return () => window.removeEventListener('iti:install', sync);
  }, []);
  const prompt = useCallback(async () => {
    const evt = window.__itiInstall;
    if (!evt) return 'unavailable' as const;
    window.__itiInstall = null; // each prompt can be shown only once
    window.dispatchEvent(new Event('iti:install'));
    await evt.prompt();
    return (await evt.userChoice).outcome;
  }, []);
  return { available, prompt };
}
