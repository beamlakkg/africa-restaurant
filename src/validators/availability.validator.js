import { query } from 'express-validator';

export const availabilityRules = [
  query('date').isISO8601().withMessage('date must be YYYY-MM-DD'),
  query('time').matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('time must be HH:mm 24h'),
  query('partySize').isInt({ min: 1, max: 20 }).toInt(),
  query('seatingType').optional().isIn(['Standard','Bar','Lounge'])
];
