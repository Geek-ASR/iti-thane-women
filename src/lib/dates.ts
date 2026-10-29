/** Calendar dates in the viewer's local time zone (toISOString() would shift them to UTC). */
const pad = (n: number) => String(n).padStart(2, '0');
export const localDay = (d: Date = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const localMonth = (d: Date = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
