const express = require('express');
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const Report = require('../models/Report');
const mongoose = require('mongoose');

const router = express.Router();

// Add a new report
router.post('/', authMiddleware, validate([
  check('referenceId').isMongoId().withMessage('Invalid reference ID'),
  check('referenceType').isIn(['Review', 'User']).withMessage('Invalid reference type'),
  check('reason').not().isEmpty().withMessage('Reason is required')
]), async (req, res) => {
  const { userId, referenceId, referenceType, reason } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const report = new Report({
      userId: req.user.userId, // Get userId from the authenticated user
      referenceId,
      referenceType,
      reason
    });

    await report.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json(report);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

// Get all reports (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Check if the authenticated user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const reports = await Report.find().populate('userId', 'username');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
