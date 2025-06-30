const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const fs = require('fs');

exports.createDoctorProfile = async (req, res) => {
  let fs, logPath;
  try {
    fs = require('fs');
    logPath = require('path').join(__dirname, '../doctor_profile_debug.log');
    fs.appendFileSync(logPath, `createDoctorProfile called: ${JSON.stringify(req.body)}\n`);
  } catch (e) {}
  try {
    const { specialty, location, bio, availableSlots } = req.body;
    const user = req.user.id;
    try { fs.appendFileSync(logPath, `Parsed fields: specialty=${specialty}, location=${location}, bio=${bio}, availableSlots=${JSON.stringify(availableSlots)}, user=${user}\n`); } catch (e) {}
    const profile = new DoctorProfile({ user, specialty, location, bio, availableSlots });
    await profile.save();
    try { fs.appendFileSync(logPath, `Doctor profile created successfully.\n`); } catch (e) {}
    res.status(201).json({ message: 'Doctor profile created', profile });
  } catch (err) {
    try { fs.appendFileSync(logPath, `Error: ${err}\nError message: ${err.message}\nError stack: ${err.stack}\n`); } catch (e) {}
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const { specialty, location } = req.query;
    let filter = { };
    if (specialty) filter.specialty = specialty;
    if (location) filter.location = location;
    const doctors = await DoctorProfile.find(filter).populate('user', 'name email isApproved');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveDoctor = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, { isApproved: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Doctor approved', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 