import { api } from '@/lib/api';
import { DEMO_MODE } from '@/lib/config';
import { compressImage } from '@/lib/portal';

const MAX_BYTES = 8 * 1024 * 1024;

/** Uploads a file to the backend (images are resized first). Demo mode returns an inline data URL. */
export async function uploadFile(file: File): Promise<{ id: string; url: string }> {
  if (file.size > MAX_BYTES) throw new Error('File is larger than 8 MB.');
  const isImage = file.type.startsWith('image/') && file.type !== 'image/svg+xml';
  const blob: Blob = isImage ? await compressImage(file, DEMO_MODE ? 1000 : 1600, DEMO_MODE ? 0.72 : 0.82) : file;
  if (DEMO_MODE) {
    if (blob.size > 900 * 1024) throw new Error('In preview mode please use images under 1 MB (files are stored in this browser).');
    const url = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(new Error('Could not read the file.'));
      r.readAsDataURL(blob);
    });
    return { id: url, url };
  }
  const form = new FormData();
  form.append('file', blob, isImage ? file.name.replace(/\.\w+$/, '.webp') : file.name);
  return api<{ id: string; url: string }>('/files', { method: 'POST', body: form });
}
