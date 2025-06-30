const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'DoctorProfile' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'scheduled', 'cancelled', 'completed'], default: 'pending' },
  documents: [{ type: String }], // File paths
  notes: { type: String },
  visitSummary: { type: String },
  followUpInstructions: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', appointmentSchema); 