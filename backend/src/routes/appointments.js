const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const router = express.Router();

// Book an appointment (Patient)
router.post('/', async (req, res) => {
  try {
    const { patientId, professionalId, date } = req.body;

    // Check if slot is available
    const pro = await User.findById(professionalId);
    if (!pro) return res.status(404).json({ message: 'Professional not found' });

    // Check if the date is in pro's availability
    const isAvailable = pro.availability.some(slot => new Date(slot).getTime() === new Date(date).getTime());
    if (!isAvailable) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: patientId,
      professional: professionalId,
      date: new Date(date)
    });

    await appointment.save();

    // Optionally remove the slot from availability so it can't be booked again
    pro.availability = pro.availability.filter(slot => new Date(slot).getTime() !== new Date(date).getTime());
    await pro.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get appointments for a user (Patient or Pro)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query; // 'user' or 'pro' passed as query param for simplicity

    let query = {};
    if (role === 'pro') {
      query = { professional: userId };
    } else {
      query = { patient: userId };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate('professional', 'name score')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel appointment (Patient only as per requirements "Modifier ou annuler uniquement ses propres rendez-vous")
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // In real app, verify that the logged-in user owns this appointment
    
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Optionally add the slot back to professional's availability
    const pro = await User.findById(appointment.professional);
    if (pro) {
      pro.availability.push(appointment.date);
      await pro.save();
    }

    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
