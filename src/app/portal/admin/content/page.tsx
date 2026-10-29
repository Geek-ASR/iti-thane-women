'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { localDay } from '@/lib/dates';
import { useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Eye, EyeOff, ImagePlus, Pencil, Plus, Trash } from 'lucide-react';
import { api, errorMessage, fileUrl } from '@/lib/api';
import { BASE_PATH } from '@/lib/config';
import { fmtDate, useApi, useToast } from '@/lib/portal';
import { uploadFile } from '@/lib/upload';
import type { CmsCollection, CmsItem } from '@/lib/types';
import { noticeCategories } from '@/content/updates';
import { galleryCategories } from '@/content/life';
import { staffGroups } from '@/content/staff';
import { imageSrc, isBundledImage } from '@/components/Img';
import { Guard } from '@/components/portal/Guard';
import { Button, Card, cx, Empty, ErrorNote, Field, Input, Loading, Modal, PageHeader, Select, Tabs, Textarea, Toggle } from '@/components/portal/kit';

type FieldDef = { key: string; label: string; type: 'text' | 'textarea' | 'date' | 'select' | 'toggle' | 'image' | 'file' | 'url'; options?: { value: string; label: string }[]; required?: boolean; hint?: string; half?: boolean };
type Schema = { label: string; singular: string; titleKey: string; subKey?: (d: Record<string, unknown>) => string; fields: FieldDef[]; publicPath: string };

const SCHEMAS: Record<CmsCollection, Schema> = {
  notices: {
    label: 'Notices', singular: 'notice', titleKey: 'title_en', publicPath: '/en/notices/',
    subKey: (d) => `${fmtDate(String(d.date ?? ''))} · ${noticeCategories.find((c) => c.id === d.category)?.label.en ?? ''}${d.pinned ? ' · Pinned' : ''}`,
    fields: [
      { key: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { key: 'title_mr', label: 'Title (Marathi)', type: 'text', hint: 'Shown on the Marathi site; English is used if left blank.' },
      { key: 'body_en', label: 'Details (English)', type: 'textarea' },
      { key: 'body_mr', label: 'Details (Marathi)', type: 'textarea' },
      { key: 'category', label: 'Category', type: 'select', options: noticeCategories.map((c) => ({ value: c.id, label: c.label.en })), half: true },
      { key: 'date', label: 'Date', type: 'date', required: true, half: true },
      { key: 'link', label: 'Link (optional)', type: 'url', hint: 'e.g. a DVET circular' },
      { key: 'attachment', label: 'Attachment (PDF or image)', type: 'file' },
      { key: 'pinned', label: 'Pin to top', type: 'toggle' },
    ],
  },
  events: {
    label: 'News & events', singular: 'event', titleKey: 'title_en', publicPath: '/en/events/',
    subKey: (d) => `${fmtDate(String(d.date ?? ''))} · ${d.tag_en ?? ''}`,
    fields: [
      { key: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { key: 'title_mr', label: 'Title (Marathi)', type: 'text' },
      { key: 'body_en', label: 'Description (English)', type: 'textarea' },
      { key: 'body_mr', label: 'Description (Marathi)', type: 'textarea' },
      { key: 'date', label: 'Date', type: 'date', required: true, half: true },
      { key: 'tag_en', label: 'Tag', type: 'select', options: ['Campus', 'CSR', 'Placement', 'Skill development', 'Sports', 'Celebration'].map((t) => ({ value: t, label: t })), half: true },
      { key: 'image', label: 'Photo', type: 'image' },
    ],
  },
  gallery: {
    label: 'Gallery', singular: 'photo', titleKey: 'caption_en', publicPath: '/en/gallery/',
    subKey: (d) => galleryCategories.find((c) => c.id === d.category)?.label.en ?? '',
    fields: [
      { key: 'image', label: 'Photo', type: 'image', required: true },
      { key: 'caption_en', label: 'Caption (English)', type: 'text', required: true },
      { key: 'caption_mr', label: 'Caption (Marathi)', type: 'text' },
      { key: 'category', label: 'Album', type: 'select', options: galleryCategories.map((c) => ({ value: c.id, label: c.label.en })) },
    ],
  },
  downloads: {
    label: 'Downloads', singular: 'download', titleKey: 'title_en', publicPath: '/en/downloads/',
    subKey: (d) => `${d.group} · ${d.kind}`,
    fields: [
      { key: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { key: 'title_mr', label: 'Title (Marathi)', type: 'text' },
      { key: 'desc_en', label: 'Short description (English)', type: 'text' },
      { key: 'desc_mr', label: 'Short description (Marathi)', type: 'text' },
      { key: 'group', label: 'Section', type: 'select', options: [{ value: 'admission', label: 'Admissions' }, { value: 'curriculum', label: 'Syllabus & curriculum' }, { value: 'forms', label: 'Forms' }, { value: 'portals', label: 'Government portals' }], half: true },
      { key: 'kind', label: 'Type', type: 'select', options: [{ value: 'pdf', label: 'PDF' }, { value: 'form', label: 'Form' }, { value: 'link', label: 'Link' }], half: true },
      { key: 'url', label: 'File or link', type: 'file', required: true, hint: 'Upload a file or paste a URL.' },
    ],
  },
  staff: {
    label: 'Staff directory', singular: 'staff member', titleKey: 'name', publicPath: '/en/staff/',
    subKey: (d) => `${d.post_en ?? ''}${d.trade ? ` · ${d.trade}` : ''} · ${staffGroups.find((g) => g.id === d.group)?.title.en ?? ''}`,
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'post_en', label: 'Post (English)', type: 'text', required: true, half: true },
      { key: 'post_mr', label: 'Post (Marathi)', type: 'text', half: true },
      { key: 'group', label: 'Section', type: 'select', options: staffGroups.map((g) => ({ value: g.id, label: g.title.en })), half: true },
      { key: 'trade', label: 'Trade (instructors)', type: 'text', half: true },
    ],
  },
};
const ORDER: CmsCollection[] = ['notices', 'events', 'gallery', 'downloads', 'staff'];

export default function ContentPage() {
  return <Guard roles={['admin']}>{() => <Content />}</Guard>;
}

function preview(v: unknown) {
  const s = String(v ?? '');
  if (!s) return '';
  return isBundledImage(s) ? imageSrc(s, 800) : fileUrl(s);
}

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const c = (ORDER.includes(params.get('c') as CmsCollection) ? params.get('c') : 'notices') as CmsCollection;
  const schema = SCHEMAS[c];
  const { data, error, loading, reload } = useApi<CmsItem[]>(`/cms/${c}?all=1`, [c]);
  const [edit, setEdit] = useState<CmsItem | { id: null; data: Record<string, unknown>; status: 'published' } | null>(null);

  async function update(item: CmsItem, body: Partial<CmsItem>) {
    try {
      await api(`/cms/${c}/${item.id}`, { method: 'PATCH', body });
      reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }
  async function remove(item: CmsItem) {
    if (!confirm('Delete this item from the website?')) return;
    try {
      await api(`/cms/${c}/${item.id}`, { method: 'DELETE' });
      toast('Deleted.');
      reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }
  async function move(i: number, dir: -1 | 1) {
    const list = data ?? [];
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    await Promise.all([api(`/cms/${c}/${list[i].id}`, { method: 'PATCH', body: { sort: list[j].sort } }), api(`/cms/${c}/${list[j].id}`, { method: 'PATCH', body: { sort: list[i].sort === list[j].sort ? list[i].sort + dir : list[i].sort } })]);
    reload();
  }

  return (
    <>
      <title>Website content</title>
      <PageHeader
        title="Website content"
        subtitle="Changes appear on the public website instantly — in English and Marathi."
        actions={
          <>
            <a href={`${BASE_PATH}${schema.publicPath}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50">
              <ExternalLink className="size-4" aria-hidden /> View on site
            </a>
            <Button variant="accent" onClick={() => setEdit({ id: null, data: c === 'notices' ? { date: localDay(), category: 'general' } : c === 'events' ? { date: localDay(), tag_en: 'Campus' } : c === 'gallery' ? { category: 'campus' } : c === 'downloads' ? { group: 'forms', kind: 'pdf' } : { group: 'engineering' }, status: 'published' })}>
              <Plus className="size-4" aria-hidden /> Add {schema.singular}
            </Button>
          </>
        }
      />
      <Tabs className="mb-5" value={c} onChange={(v) => router.replace(`/portal/admin/content/?c=${v}`)} tabs={ORDER.map((k) => ({ id: k, label: SCHEMAS[k].label }))} />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Loading />}
      {data?.length === 0 && <Empty title={`No ${schema.label.toLowerCase()} yet`} />}
      <ul className={cx(c === 'gallery' ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4' : 'space-y-2.5')}>
        {data?.map((item, i) =>
          c === 'gallery' ? (
            <li key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview(item.data.image)} alt="" loading="lazy" className={cx('aspect-[4/3] w-full bg-stone-200 object-cover', item.status === 'draft' && 'opacity-50')} />
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-semibold text-brand-950">{String(item.data.caption_en ?? '')}</p>
                <p className="text-xs text-stone-500">{schema.subKey?.(item.data)}</p>
                <div className="mt-2 flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEdit(item)} aria-label="Edit"><Pencil className="size-4" aria-hidden /></Button>
                  <Button size="sm" variant="ghost" onClick={() => update(item, { status: item.status === 'published' ? 'draft' : 'published' })} aria-label={item.status === 'published' ? 'Hide' : 'Publish'}>{item.status === 'published' ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}</Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(item)} aria-label="Delete"><Trash className="size-4 text-rose-600" aria-hidden /></Button>
                </div>
              </div>
            </li>
          ) : (
            <li key={item.id}>
              <Card className="flex items-center gap-3" padded={false}>
                <div className="flex flex-col pl-2">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid size-7 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 disabled:opacity-30" aria-label="Move up"><ArrowUp className="size-4" aria-hidden /></button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === data.length - 1} className="grid size-7 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 disabled:opacity-30" aria-label="Move down"><ArrowDown className="size-4" aria-hidden /></button>
                </div>
                <div className="min-w-0 flex-1 py-3">
                  <p className={cx('truncate font-semibold', item.status === 'draft' ? 'text-stone-400' : 'text-brand-950')}>{String(item.data[schema.titleKey] ?? 'Untitled')}</p>
                  <p className="truncate text-xs text-stone-500">{schema.subKey?.(item.data)}{item.status === 'draft' ? ' · Hidden' : ''}</p>
                </div>
                <div className="flex shrink-0 gap-1 pr-3">
                  <Button size="sm" variant="ghost" onClick={() => update(item, { status: item.status === 'published' ? 'draft' : 'published' })} aria-label={item.status === 'published' ? 'Hide from website' : 'Publish'}>{item.status === 'published' ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEdit(item)} aria-label="Edit"><Pencil className="size-4" aria-hidden /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(item)} aria-label="Delete"><Trash className="size-4 text-rose-600" aria-hidden /></Button>
                </div>
              </Card>
            </li>
          ),
        )}
      </ul>
      {edit && <Editor key={edit.id ?? 'new'} collection={c} schema={schema} item={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload(); }} />}
    </>
  );
}

function Editor({ collection, schema, item, onClose, onSaved }: { collection: CmsCollection; schema: Schema; item: { id: string | null; data: Record<string, unknown>; status: string }; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [values, setValues] = useState<Record<string, unknown>>({ ...item.data });
  const [published, setPublished] = useState(item.status !== 'draft');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState('');
  const set = (k: string, v: unknown) => setValues((x) => ({ ...x, [k]: v }));

  async function upload(key: string, file?: File) {
    if (!file) return;
    setUploading(key);
    try {
      const r = await uploadFile(file);
      set(key, r.id);
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setUploading('');
    }
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    const missing = schema.fields.find((f) => f.required && !String(values[f.key] ?? '').trim());
    if (missing) return toast(`${missing.label} is required.`, 'error');
    setBusy(true);
    try {
      const body = { data: values, status: published ? 'published' : 'draft' };
      if (item.id) await api(`/cms/${collection}/${item.id}`, { method: 'PATCH', body });
      else await api(`/cms/${collection}`, { method: 'POST', body });
      toast('Saved to the website.');
      onSaved();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={`${item.id ? 'Edit' : 'Add'} ${schema.singular}`} wide footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button busy={busy} onClick={save}>Save</Button></>}>
      <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        {schema.fields.map((f) => {
          const v = values[f.key];
          const span = f.half ? '' : 'sm:col-span-2';
          if (f.type === 'toggle') return <div key={f.key} className={span}><Toggle checked={!!v} onChange={(x) => set(f.key, x)} label={f.label} /></div>;
          if (f.type === 'image' || f.type === 'file')
            return (
              <div key={f.key} className={span}>
                <Field label={f.label} required={f.required} hint={f.hint}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {f.type === 'image' && v ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview(v)} alt="" className="h-24 w-36 rounded-xl bg-stone-200 object-cover ring-1 ring-line" />
                    ) : null}
                    <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50">
                      <ImagePlus className="size-4" aria-hidden /> {uploading === f.key ? 'Uploading…' : v ? 'Replace' : 'Upload'}
                      <input type="file" accept={f.type === 'image' ? 'image/*' : 'image/*,application/pdf'} className="sr-only" onChange={(e) => upload(f.key, e.target.files?.[0])} />
                    </label>
                    {f.type === 'file' && <Input value={String(v ?? '').startsWith('data:') ? 'Uploaded file' : String(v ?? '')} onChange={(e) => set(f.key, e.target.value)} placeholder="…or paste a link (https://)" aria-label={`${f.label} link`} />}
                  </div>
                </Field>
              </div>
            );
          return (
            <div key={f.key} className={span}>
              <Field label={f.label} htmlFor={`f-${f.key}`} required={f.required} hint={f.hint}>
                {f.type === 'textarea' ? (
                  <Textarea id={`f-${f.key}`} rows={4} value={String(v ?? '')} onChange={(e) => set(f.key, e.target.value)} />
                ) : f.type === 'select' ? (
                  <Select id={`f-${f.key}`} value={String(v ?? f.options?.[0]?.value ?? '')} onChange={(e) => set(f.key, e.target.value)}>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                ) : (
                  <Input id={`f-${f.key}`} type={f.type === 'date' ? 'date' : f.type === 'url' ? 'url' : 'text'} value={String(v ?? '')} onChange={(e) => set(f.key, e.target.value)} />
                )}
              </Field>
            </div>
          );
        })}
        <div className="sm:col-span-2">
          <Toggle checked={published} onChange={setPublished} label="Visible on the website" hint="Turn off to keep it as a hidden draft." />
        </div>
      </form>
    </Modal>
  );
}
