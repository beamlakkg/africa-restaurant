import express from 'express';
import { validationResult } from 'express-validator';
import Reservation from '../models/Reservation.js';
import { reservationRules } from '../validators/reservation.validator.js';
import { capacities } from '../utils/time.js';

const router = express.Router();

/**
 * POST /api/reservations
 * Body: {
 *  partySize, date, time, seatingType,
 *  firstName, lastName, phone, email,
 *  occasion?, specialRequest?
 * }
 */
router.post('/', reservationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const data = req.body;
  const caps = capacities();

  // Check capacity for this slot + seatingType
  const [{ total = 0 } = {}] = await Reservation.aggregate([
    { $match: { date: data.date, time: data.time, seatingType: data.seatingType } },
    { $group: { _id: null, total: { $sum: '$partySize' } } }
  ]);

  const remaining = Math.max(0, caps[data.seatingType] - total);
  if (remaining < data.partySize) {
    return res.status(409).json({
      message: 'Selected seating is full for this time.',
      remaining,
      suggested: Object.entries(caps).map(([type, cap]) => ({ type, capacity: cap }))
    });
  }

  const saved = await Reservation.create({ ...data, status: 'confirmed' });
  res.status(201).json({ message: 'Reservation confirmed', reservation: saved });
});

/** GET /api/reservations/:id */
router.get('/:id', async (req, res) => {
  const doc = await Reservation.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
});

/** GET /api/reservations  (simple admin/testing) */
router.get('/', async (_req, res) => {
  const list = await Reservation.find().sort({ createdAt: -1 }).limit(100);
  res.json(list);
});

export default router;
