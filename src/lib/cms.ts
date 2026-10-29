'use client';

import { useEffect, useState } from 'react';
import { DEMO_MODE } from '@/lib/config';
import { api, fileUrl } from '@/lib/api';
import { isBundledImage } from '@/components/Img';
import { readDemoCms } from '@/lib/demo/cms-store';
import type { CmsCollection, CmsItem, SiteSettings } from '@/lib/types';
import type { L } from '@/lib/i18n';
import { seedNotices, downloads as seedDownloads, type Notice, type NoticeCategory, type DownloadItem } from '@/content/updates';
import { events as seedEvents, gallery as seedGallery, type EventItem } from '@/content/life';
import { staffGroups, type StaffGroup } from '@/content/staff';

/* ---------- CMS data shapes (flat, bilingual fields) ---------- */
export type NoticeData = { title_en: string; title_mr: string; body_en: string; body_mr: string; category: NoticeCategory; date: string; pinned?: boolean; link?: string; attachment?: string };
export type EventData = { title_en: string; title_mr: string; body_en: string; body_mr: string; date: string; tag_en: string; tag_mr: string; image?: string };
export type GalleryData = { caption_en: string; caption_mr: string; category: string; image: string };
export type DownloadData = { title_en: string; title_mr: string; desc_en: string; desc_mr: string; url: string; group: DownloadItem['group']; kind: DownloadItem['kind'] };
export type StaffData = { name: string; post_en: string; post_mr: string; group: string; trade?: string };

const l = (en?: string, mr?: string): L => ({ en: en ?? '', mr: mr || en || '' });

/** A gallery photo is either a bundled image (manifest key) or an uploaded file URL. */
export type GalleryEntry = { key: string; image?: string; src?: string; category: string; caption: L };

export const mappers = {
  notices: (it: CmsItem): Notice => {
    const d = it.data as NoticeData;
    return { id: it.id, date: d.date, category: d.category, pinned: !!d.pinned, title: l(d.title_en, d.title_mr), body: l(d.body_en, d.body_mr), link: d.attachment ? fileUrl(d.attachment) : d.link || undefined };
  },
  events: (it: CmsItem): EventItem => {
    const d = it.data as EventData;
    return { id: it.id, date: d.date, title: l(d.title_en, d.title_mr), body: l(d.body_en, d.body_mr), tag: l(d.tag_en || 'Campus', d.tag_mr || 'परिसर'), image: d.image ? (isBundledImage(d.image) ? d.image : fileUrl(d.image)) : undefined };
  },
  gallery: (it: CmsItem): GalleryEntry => {
    const d = it.data as GalleryData;
    return { key: it.id, category: d.category, caption: l(d.caption_en, d.caption_mr), ...(isBundledImage(d.image) ? { image: d.image } : { src: fileUrl(d.image) }) };
  },
  downloads: (it: CmsItem): DownloadItem => {
    const d = it.data as DownloadData;
    return { title: l(d.title_en, d.title_mr), desc: l(d.desc_en, d.desc_mr), url: fileUrl(d.url), group: d.group, kind: d.kind };
  },
  staff: (it: CmsItem): StaffData => it.data as StaffData,
};

/* ---------- Seeds (bundled content in CMS shape) — used by the demo server and the backend seed ---------- */
export const cmsSeed = {
  notices: (): NoticeData[] => seedNotices.map((n) => ({ title_en: n.title.en, title_mr: n.title.mr, body_en: n.body.en, body_mr: n.body.mr, category: n.category, date: n.date, pinned: !!n.pinned, link: n.link ?? '' })),
  events: (): EventData[] => seedEvents.map((e) => ({ title_en: e.title.en, title_mr: e.title.mr, body_en: e.body.en, body_mr: e.body.mr, date: e.date, tag_en: e.tag.en, tag_mr: e.tag.mr, image: e.image ?? '' })),
  gallery: (): GalleryData[] => seedGallery.map((g) => ({ caption_en: g.caption.en, caption_mr: g.caption.mr, category: g.category, image: g.image })),
  downloads: (): DownloadData[] => seedDownloads.map((d) => ({ title_en: d.title.en, title_mr: d.title.mr, desc_en: d.desc.en, desc_mr: d.desc.mr, url: d.url, group: d.group, kind: d.kind })),
  staff: (): StaffData[] => staffGroups.flatMap((g) => g.members.map((m) => ({ name: m.name, post_en: m.post.en, post_mr: m.post.mr, group: g.id, trade: m.trade ?? '' }))),
};

const fallbacks = {
  notices: () => seedNotices,
  events: () => seedEvents,
  gallery: () => seedGallery.map((g, i): GalleryEntry => ({ key: `g${i}`, image: g.image, category: g.category, caption: g.caption })),
  downloads: () => seedDownloads,
  staff: () => cmsSeed.staff(),
};

type Mapped = { notices: Notice; events: EventItem; gallery: GalleryEntry; downloads: DownloadItem; staff: StaffData };

const sortItems = (items: CmsItem[]) => [...items].filter((i) => i.status === 'published').sort((a, b) => a.sort - b.sort);

/**
 * Public content hook. Demo: bundled content, replaced by admin edits saved in this browser.
 * Live: fetched from the API (with the bundled content as a fallback if the API is unreachable).
 */
export function useCollection<C extends keyof Mapped>(collection: C): { items: Mapped[C][] | null; loading: boolean } {
  const fallback = fallbacks[collection]() as Mapped[C][];
  const [items, setItems] = useState<Mapped[C][] | null>(DEMO_MODE ? fallback : null);

  useEffect(() => {
    let alive = true;
    const map = mappers[collection] as (it: CmsItem) => Mapped[C];
    if (DEMO_MODE) {
      const load = () => {
        const cms = readDemoCms();
        const list = cms?.[collection as CmsCollection];
        setItems(list ? sortItems(list).map(map) : (fallbacks[collection]() as Mapped[C][]));
      };
      load();
      window.addEventListener('iti-demo-cms', load);
      window.addEventListener('storage', load);
      return () => {
        window.removeEventListener('iti-demo-cms', load);
        window.removeEventListener('storage', load);
      };
    }
    api<CmsItem[]>(`/cms/${collection}`)
      .then((list) => alive && setItems(sortItems(list).map(map)))
      .catch(() => alive && setItems(fallbacks[collection]() as Mapped[C][]));
    return () => {
      alive = false;
    };
  }, [collection]);

  return { items, loading: items === null };
}

export const defaultSettings: SiteSettings = {
  tickerEnabled: true,
  admissionOpen: false,
  admissionBanner_en: '',
  admissionBanner_mr: '',
  officeHours_en: '',
  officeHours_mr: '',
};

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  useEffect(() => {
    let alive = true;
    if (DEMO_MODE) {
      const load = () => setSettings({ ...defaultSettings, ...(readDemoCms()?.settings ?? {}) });
      load();
      window.addEventListener('iti-demo-cms', load);
      return () => window.removeEventListener('iti-demo-cms', load);
    }
    api<SiteSettings>('/settings')
      .then((s) => alive && setSettings({ ...defaultSettings, ...s }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return settings;
}

/** Regroup flat staff rows into directory groups (keeps the bundled group titles). */
export const groupStaff = (rows: StaffData[]): StaffGroup[] =>
  staffGroups
    .map((g) => ({ ...g, members: rows.filter((r) => r.group === g.id).map((r) => ({ name: r.name, post: l(r.post_en, r.post_mr), trade: r.trade || undefined })) }))
    .filter((g) => g.members.length > 0);
