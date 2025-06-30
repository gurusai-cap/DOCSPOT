const express = require('express');
const router = express.Router();
const { createDoctorProfile, getDoctors, approveDoctor } = require('../controllers/doctorController');
const auth = require('../middleware/auth');

router.post('/profile', auth, createDoctorProfile);
router.get('/', getDoctors);
router.put('/approve/:id', approveDoctor); // Admin approval
// TEMPORARY PUBLIC ROUTE FOR DEBUGGING
router.post('/public-profile', require('../controllers/doctorController').createDoctorProfile);

module.exports = router; 