import express from 'express';
import Reservation from '../models/Reservation.js';
import { availabilityRules } from '../validators/availability.validator.js';
import { validationResult } from 'express-validator';
import { capacities } from '../utils/time.js';

const router = express.Router();

/**
 * GET /api/availability?date=2025-07-09&time=19:30&partySize=4&seatingType=Standard
 * If seatingType omitted, returns all three types with remaining capacity.
 */
router.get('/', availabilityRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { date, time, partySize, seatingType } = req.query;
  const caps = capacities();

  const match = { date, time };
  if (seatingType) match.seatingType = seatingType;

  const cursor = await Reservation.aggregate([
    { $match: match },
    { $group: { _id: '$seatingType', total: { $sum: '$partySize' } } }
  ]);

  const booked = { Standard: 0, Bar: 0, Lounge: 0 };
  cursor.forEach(d => { booked[d._id] = d.total; });

  const remaining = {
    Standard: Math.max(0, caps.Standard - booked.Standard),
    Bar: Math.max(0, caps.Bar - booked.Bar),
    Lounge: Math.max(0, caps.Lounge - booked.Lounge)
  };

  const canFit = (type) => remaining[type] >= parseInt(partySize, 10);

  if (seatingType) {
    return res.json({
      date, time, partySize: Number(partySize), seatingType,
      remaining: remaining[seatingType],
      available: canFit(seatingType)
    });
  }

  res.json({
    date, time, partySize: Number(partySize),
    options: [
      { seatingType: 'Standard', remaining: remaining.Standard, available: canFit('Standard') },
      { seatingType: 'Bar',      remaining: remaining.Bar,      available: canFit('Bar') },
      { seatingType: 'Lounge',   remaining: remaining.Lounge,   available: canFit('Lounge') }
    ]
  });
});

export default router;
