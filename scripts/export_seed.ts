import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PLACES } from '../src/data/places';
import { INITIAL_LOCALS } from '../src/data/locals';
import { INITIAL_PLACE_REVIEWS, INITIAL_LOCAL_REVIEWS } from '../src/data/reviews';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../backend/app/data');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const seedData = {
  places: INITIAL_PLACES,
  locals: INITIAL_LOCALS,
  place_reviews: INITIAL_PLACE_REVIEWS,
  local_reviews: INITIAL_LOCAL_REVIEWS
};

fs.writeFileSync(path.join(targetDir, 'seed_data.json'), JSON.stringify(seedData, null, 2), 'utf-8');
console.log('Seed data written to backend/app/data/seed_data.json');
