import type { CmsCollection, CmsItem, SiteSettings } from '@/lib/types';

/** Demo-mode CMS lives in its own small key so public pages can read it without loading the demo server. */
export const DEMO_CMS_KEY = 'iti.demo.cms.v1';

export type DemoCms = Partial<Record<CmsCollection, CmsItem[]>> & { settings?: SiteSettings };

export function readDemoCms(): DemoCms | null {
  try {
    const raw = localStorage.getItem(DEMO_CMS_KEY);
    return raw ? (JSON.parse(raw) as DemoCms) : null;
  } catch {
    return null;
  }
}

export function writeDemoCms(cms: DemoCms) {
  try {
    localStorage.setItem(DEMO_CMS_KEY, JSON.stringify(cms));
    window.dispatchEvent(new Event('iti-demo-cms'));
  } catch {
    /* quota exceeded or storage blocked — demo edits stay in memory only */
  }
}
