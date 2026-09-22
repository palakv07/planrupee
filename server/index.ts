import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { INITIAL_LOCALS } from '../src/data/locals';
import { INITIAL_PLACE_REVIEWS, INITIAL_LOCAL_REVIEWS } from '../src/data/reviews';
import { INITIAL_PLACES } from '../src/data/places';
import { generateRoadmap } from '../src/data/roadmapGenerator';
import type { ConciergeRequest, Local, Place, Roadmap } from '../src/types';

const port = Number(process.env.PORT ?? 3001);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));

const defaultRoadmap = generateRoadmap({
  city: 'Chandigarh',
  arrivalDate: '2026-09-22',
  departureDate: '2026-09-26',
  arrivalTime: '10:00',
  departureTime: '18:00',
  travelers: '2',
  budget: 'Moderate',
  moods: ['Food', 'Culture', 'Romantic'],
  interests: ['Food', 'Cafés', 'Heritage', 'Hidden Gems']
});

const sampleRequest: ConciergeRequest = {
  id: 'cr-sample-1',
  category: 'Food',
  query: 'Arrange an authentic candlelit table at Virgin Courtyard with curated Italian tasting menu for 2 guests.',
  city: 'Chandigarh',
  timing: 'Tonight, 8:30 PM',
  budget: '₹3,000',
  travelers: '2',
  contactName: 'Aman Varma',
  contactPhone: '+91 98140 XXXXX',
  status: 'LOCAL_PARTNER',
  createdAt: '19 Sep 2026, 07:15 PM',
  updates: [
    { timestamp: '07:15 PM', stage: 'REQUEST_RECEIVED', sender: 'System', note: 'Concierge request logged and validated by PlanRupee Priority desk.' },
    { timestamp: '07:22 PM', stage: 'PLANRUPEE_CONCIERGE', sender: 'PlanRupee Concierge', note: 'Assigned to Senior Concierge Rajesh. Reviewing courtyard table availability at Virgin Courtyard.' },
    { timestamp: '07:35 PM', stage: 'LOCAL_PARTNER', sender: 'Local Partner', note: 'Virgin Courtyard GM confirmed outdoor bougainvillea pergola table. Finalizing tasting menu pairing.' }
  ]
};

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS places (id TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS locals (id TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS place_reviews (id TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS local_reviews (id TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS roadmaps (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS consultations (id TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS concierge_requests (id TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS saved_items (kind TEXT NOT NULL, item_id TEXT NOT NULL, PRIMARY KEY (kind, item_id));
  `);

  const { rows } = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM places');
  if (rows[0].count === '0') {
    await pool.query('BEGIN');
    try {
      for (const place of INITIAL_PLACES) await pool.query('INSERT INTO places (id, data) VALUES ($1, $2)', [place.id, place]);
      for (const local of INITIAL_LOCALS) await pool.query('INSERT INTO locals (id, data) VALUES ($1, $2)', [local.id, local]);
      for (const review of INITIAL_PLACE_REVIEWS) await pool.query('INSERT INTO place_reviews (id, data) VALUES ($1, $2)', [review.id, review]);
      for (const review of INITIAL_LOCAL_REVIEWS) await pool.query('INSERT INTO local_reviews (id, data) VALUES ($1, $2)', [review.id, review]);
      await pool.query('INSERT INTO roadmaps (id, data) VALUES ($1, $2)', [defaultRoadmap.id, defaultRoadmap]);
      await pool.query('INSERT INTO concierge_requests (id, data) VALUES ($1, $2)', [sampleRequest.id, sampleRequest]);
      await pool.query("INSERT INTO saved_items (kind, item_id) VALUES ('place', 'chd-rock-garden'), ('place', 'chd-pal-dhaba'), ('local', 'local-simran') ON CONFLICT DO NOTHING");
      await pool.query('COMMIT');
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  }
}

async function readJson(table: string) {
  const result = await pool.query<{ data: unknown }>(`SELECT data FROM ${table} ORDER BY data->>'id' DESC`);
  return result.rows.map(row => row.data);
}

async function bootstrap(_request: Request, response: Response) {
  const [places, locals, placeReviews, localReviews, roadmaps, consultations, conciergeRequests, saved] = await Promise.all([
    readJson('places'), readJson('locals'), readJson('place_reviews'), readJson('local_reviews'), readJson('roadmaps'),
    readJson('consultations'), readJson('concierge_requests'), pool.query<{ kind: string; item_id: string }>('SELECT kind, item_id FROM saved_items')
  ]);
  response.json({
    places, locals, placeReviews, localReviews, activeRoadmap: roadmaps[0] ?? null, myConsultations: consultations,
    myConciergeRequests: conciergeRequests, savedPlaceIds: saved.rows.filter(row => row.kind === 'place').map(row => row.item_id),
    savedLocalIds: saved.rows.filter(row => row.kind === 'local').map(row => row.item_id)
  });
}

app.get('/api/health', (_request, response) => response.json({ ok: true }));
app.get('/api/bootstrap', bootstrap);

app.put('/api/saved/:kind/:id', async (request, response) => {
  const { kind, id } = request.params;
  const existing = await pool.query('SELECT 1 FROM saved_items WHERE kind = $1 AND item_id = $2', [kind, id]);
  if (existing.rowCount) await pool.query('DELETE FROM saved_items WHERE kind = $1 AND item_id = $2', [kind, id]);
  else await pool.query('INSERT INTO saved_items (kind, item_id) VALUES ($1, $2)', [kind, id]);
  const saved = await pool.query<{ item_id: string }>('SELECT item_id FROM saved_items WHERE kind = $1', [kind]);
  response.json(saved.rows.map(row => row.item_id));
});

app.put('/api/roadmap', async (request, response) => {
  const roadmap = request.body as Roadmap;
  await pool.query('INSERT INTO roadmaps (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()', [roadmap.id, roadmap]);
  response.json(roadmap);
});

app.post('/api/consultations', async (request, response) => {
  const booking = request.body;
  await pool.query('INSERT INTO consultations (id, data) VALUES ($1, $2)', [booking.id, booking]);
  response.status(201).json(booking);
});

app.post('/api/concierge', async (request, response) => {
  const item = request.body as ConciergeRequest;
  await pool.query('INSERT INTO concierge_requests (id, data) VALUES ($1, $2)', [item.id, item]);
  response.status(201).json(item);
});

app.patch('/api/concierge/:id', async (request, response) => {
  const current = await pool.query<{ data: ConciergeRequest }>('SELECT data FROM concierge_requests WHERE id = $1', [request.params.id]);
  if (!current.rowCount) return response.status(404).json({ error: 'Request not found' });
  const item = { ...current.rows[0].data, ...request.body };
  await pool.query('UPDATE concierge_requests SET data = $2 WHERE id = $1', [request.params.id, item]);
  response.json(item);
});

app.post('/api/reviews/place', async (request, response) => {
  const review = request.body;
  await pool.query('INSERT INTO place_reviews (id, data) VALUES ($1, $2)', [review.id, review]);
  const reviews = await pool.query<{ data: { overallRating: number; placeId: string } }>('SELECT data FROM place_reviews WHERE data->>\'placeId\' = $1', [review.placeId]);
  const reviewCount = reviews.rowCount ?? 0;
  const rating = Number((reviews.rows.reduce((sum, row) => sum + row.data.overallRating, 0) / reviewCount).toFixed(1));
  await pool.query(`UPDATE places SET data = jsonb_set(jsonb_set(data, '{rating}', to_jsonb($2::numeric)), '{reviewCount}', to_jsonb($3::int)) WHERE id = $1`, [review.placeId, rating, reviewCount]);
  response.status(201).json(review);
});

app.post('/api/reviews/local', async (request, response) => {
  const review = request.body;
  await pool.query('INSERT INTO local_reviews (id, data) VALUES ($1, $2)', [review.id, review]);
  const reviews = await pool.query<{ data: { overallRating: number; localId: string } }>('SELECT data FROM local_reviews WHERE data->>\'localId\' = $1', [review.localId]);
  const reviewCount = reviews.rowCount ?? 0;
  const rating = Number((reviews.rows.reduce((sum, row) => sum + row.data.overallRating, 0) / reviewCount).toFixed(2));
  await pool.query(`UPDATE locals SET data = jsonb_set(jsonb_set(data, '{rating}', to_jsonb($2::numeric)), '{reviewCount}', to_jsonb($3::int)) WHERE id = $1`, [review.localId, rating, reviewCount]);
  response.status(201).json(review);
});

app.post('/api/places', async (request, response) => {
  const place = request.body as Place;
  await pool.query('INSERT INTO places (id, data) VALUES ($1, $2)', [place.id, place]);
  response.status(201).json(place);
});

app.patch('/api/places/:id', async (request, response) => {
  const current = await pool.query<{ data: Place }>('SELECT data FROM places WHERE id = $1', [request.params.id]);
  if (!current.rowCount) return response.status(404).json({ error: 'Place not found' });
  const place = { ...current.rows[0].data, ...request.body };
  await pool.query('UPDATE places SET data = $2 WHERE id = $1', [request.params.id, place]);
  response.json(place);
});

app.patch('/api/locals/:id', async (request, response) => {
  const current = await pool.query<{ data: Local }>('SELECT data FROM locals WHERE id = $1', [request.params.id]);
  if (!current.rowCount) return response.status(404).json({ error: 'Local not found' });
  const local = { ...current.rows[0].data, ...request.body };
  await pool.query('UPDATE locals SET data = $2 WHERE id = $1', [request.params.id, local]);
  response.json(local);
});

initializeDatabase().then(() => app.listen(port, () => console.log(`PlanRupee API listening on http://localhost:${port}`))).catch(error => {
  console.error('Unable to initialize PostgreSQL', error);
  process.exit(1);
});
