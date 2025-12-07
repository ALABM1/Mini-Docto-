const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware to check auth (simplified)
const auth = (req, res, next) => {
  // In a real app, verify token here. For now, we assume the user is authenticated if they hit this endpoint or we can add the middleware later.
  // For the test, let's keep it open or add basic check if needed.
  next();
};

// Get all professionals sorted by score (descending)
router.get('/', async (req, res) => {
  try {
    // Filter by role 'pro' and sort by score descending
    const professionals = await User.find({ role: 'pro' })
      .select('-password') // Exclude password
      .sort({ score: -1 }); // Sort by score descending
    
    res.json(professionals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get professional by ID
router.get('/:id', async (req, res) => {
  try {
    const professional = await User.findById(req.params.id).select('-password');
    if (!professional || professional.role !== 'pro') {
      return res.status(404).json({ message: 'Professional not found' });
    }
    res.json(professional);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add availability slot (Pro only)
router.post('/availability', async (req, res) => {
  // Expecting { userId, date } in body. In real app, get userId from token.
  try {
    const { userId, date } = req.body;
    const user = await User.findById(userId);
    
    if (!user || user.role !== 'pro') {
      return res.status(403).json({ message: 'Access denied. Professionals only.' });
    }

    user.availability.push(new Date(date));
    await user.save();
    
    res.json(user.availability);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove availability slot (Pro only)
router.delete('/availability', async (req, res) => {
  try {
    const { userId, date } = req.body;
    const user = await User.findById(userId);

    if (!user || user.role !== 'pro') {
      return res.status(403).json({ message: 'Access denied. Professionals only.' });
    }

    // Remove the slot
    user.availability = user.availability.filter(slot => new Date(slot).getTime() !== new Date(date).getTime());
    await user.save();

    res.json(user.availability);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
