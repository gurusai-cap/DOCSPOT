const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, updateAppointmentStatus, updateVisitSummary } = require('../controllers/appointmentController');

router.post('/book', bookAppointment);
router.get('/', getAppointments);
router.put('/:id/status', updateAppointmentStatus);
router.put('/:id/summary', updateVisitSummary);

module.exports = router; 