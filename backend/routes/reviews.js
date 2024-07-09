const express = require('express');
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const Name = require('../models/Name');
const TitleEpisode = require('../models/TitleEpisode');
const mongoose = require('mongoose');

// Add or update a review
router.post('/', authMiddleware, validate([
  check('userId').isMongoId().withMessage('Invalid user ID'),
  check('referenceId').not().isEmpty().withMessage('Reference ID is required'),
  check('referenceType').isIn(['Movie', 'Name', 'Episode']).withMessage('Invalid reference type'),
  check('rating').isFloat({ min: 1.0, max: 10.0 }).withMessage('Rating must be between 1.0 and 10.0'),
  check('comment').optional().isString()
]), async (req, res) => {
  const { userId, referenceId, referenceType, rating, comment } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let existingReview = await Review.findOne({ userId, referenceId, referenceType });
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.updatedAt = Date.now();
      await existingReview.save();
    } else {
      const newReview = new Review({ userId, referenceId, referenceType, rating, comment });
      await newReview.save();
      if (referenceType === 'Movie') {
        await Movie.findByIdAndUpdate(referenceId, { $push: { reviews: newReview._id } }, { session });
      } else if (referenceType === 'Name') {
        await Name.findByIdAndUpdate(referenceId, { $push: { reviews: newReview._id } }, { session });
      } else if (referenceType === 'Episode') {
        await TitleEpisode.findByIdAndUpdate(referenceId, { $push: { reviews: newReview._id } }, { session });
      }
    }

    // Update average rating and number of votes for movies
    if (referenceType === 'Movie') {
      const movie = await Movie.findById(referenceId).populate('reviews').session(session);
      const ratings = movie.reviews.map(r => r.rating);
      const averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      movie.averageRating = averageRating;
      movie.numVotes = ratings.length;
      await movie.save();
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Review saved successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

// Get reviews for a reference
router.get('/:referenceType/:referenceId', validate([
  check('referenceType').isIn(['Movie', 'Name', 'Episode']).withMessage('Invalid reference type'),
  check('referenceId').not().isEmpty().withMessage('Reference ID is required')
]), async (req, res) => {
  const { referenceType, referenceId } = req.params;

  try {
    const reviews = await Review.find({ referenceId, referenceType }).populate('userId', 'username');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
