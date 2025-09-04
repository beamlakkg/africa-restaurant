import { body } from 'express-validator';

export const reservationRules = [
  body('partySize').isInt({ min: 1, max: 20 }).toInt(),
  body('date').isISO8601().withMessage('date must be YYYY-MM-DD'),
  body('time').matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('time must be HH:mm 24h'),
  body('seatingType').isIn(['Standard','Bar','Lounge']),

  body('firstName').isString().isLength({ min: 1 }),
  body('lastName').isString().isLength({ min: 1 }),
  body('phone').isString().isLength({ min: 6 }),
  body('email').isEmail().normalizeEmail(),

  body('occasion').optional().isString(),
  body('specialRequest').optional().isString()
];
