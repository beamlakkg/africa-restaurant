import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './src/db.js';
import availabilityRouter from './src/routes/availability.routes.js';
import reservationsRouter from './src/routes/reservations.routes.js';

const app = express();

// Security & logs
app.use(helmet());
app.use(cors({ origin: '*' })); // allow your static HTML files to call API
app.use(morgan('dev'));
app.use(express.json());

// Rate limit
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

// Routes
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/availability', availabilityRouter);
app.use('/api/reservations', reservationsRouter);

// Start
const PORT = process.env.PORT || 4000;
await connectDB();
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
