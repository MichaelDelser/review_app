// users.js
const express = require('express');
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();

// Add to favourites
router.post('/favourites', authMiddleware, validate([
  check('userId').isMongoId().withMessage('Invalid user ID'),
  check('movieId').isMongoId().withMessage('Invalid movie ID')
]), async (req, res) => {
  const { userId, movieId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findByIdAndUpdate(userId, { $push: { favourites: movieId } }, { new: true, session });
    await session.commitTransaction();
    session.endSession();
    res.json(user);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', authMiddleware, validate([
  check('id').isMongoId().withMessage('Invalid user ID')
]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favourites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/:id', authMiddleware, validate([
  check('id').isMongoId().withMessage('Invalid user ID')
]), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, session });
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }
    await session.commitTransaction();
    session.endSession();
    res.json(user);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
