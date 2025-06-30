const Appointment = require('../models/Appointment');

exports.bookAppointment = async (req, res) => {
  try {
    const { customer, doctor, doctorProfile, date, documents, notes } = req.body;
    const appointment = new Appointment({ customer, doctor, doctorProfile, date, documents, notes });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { userId, role } = req.query;
    let filter = {};
    if (role === 'customer') filter.customer = userId;
    if (role === 'doctor') filter.doctor = userId;
    const appointments = await Appointment.find(filter)
      .populate('customer', 'name email')
      .populate('doctor', 'name email')
      .populate('doctorProfile');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment status updated', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateVisitSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const { visitSummary, followUpInstructions } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { visitSummary, followUpInstructions },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Visit summary updated', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 