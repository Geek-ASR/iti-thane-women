/**
 * Exports the portal's demo dataset so the backend can load the same sample data:
 *   npx tsx scripts/export-demo-fixture.ts > ../api/src/seed-data/demo.json
 */
import { buildSeed } from '@/lib/demo/seed';

process.stdout.write(JSON.stringify(buildSeed(), null, 2) + '\n');
