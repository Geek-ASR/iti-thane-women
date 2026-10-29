/**
 * Prints the website's bundled content in CMS shape so the backend can seed it:
 *   npx tsx scripts/export-cms-seed.ts > ../api/src/seed-data/cms.json
 */
import { cmsSeed, defaultSettings } from '@/lib/cms';

const out = {
  notices: cmsSeed.notices(),
  events: cmsSeed.events(),
  gallery: cmsSeed.gallery(),
  downloads: cmsSeed.downloads(),
  staff: cmsSeed.staff(),
  settings: defaultSettings,
};
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
