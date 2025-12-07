const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  professional: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
