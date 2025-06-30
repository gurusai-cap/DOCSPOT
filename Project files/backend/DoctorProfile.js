const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: { type: String, required: true },
  location: { type: String, required: true },
  bio: { type: String },
  availableSlots: [{ type: Date }],
  documents: [{ type: String }], // File paths
});

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema); 