import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema(
  {
    partySize: { type: Number, required: true, min: 1, max: 20 },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm (24h)
    seatingType: { type: String, enum: ['Standard','Bar','Lounge'], required: true },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    occasion: { type: String, default: '' },
    specialRequest: { type: String, default: '' },

    status: { type: String, enum: ['held','confirmed','cancelled'], default: 'confirmed' }
  },
  { timestamps: true }
);

ReservationSchema.index({ date: 1, time: 1, seatingType: 1 });

export default mongoose.model('Reservation', ReservationSchema);
