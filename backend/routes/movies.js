const express = require('express');
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');

const router = express.Router();

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie by ID
router.get('/:id', validate([
  check('id').isMongoId().withMessage('Invalid movie ID')
]), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new movie (Admin only)
router.post('/', authMiddleware, validate([
  check('tconst').not().isEmpty().withMessage('tconst is required'),
  check('titleType').not().isEmpty().withMessage('titleType is required'),
  check('primaryTitle').not().isEmpty().withMessage('primaryTitle is required'),
  check('originalTitle').not().isEmpty().withMessage('originalTitle is required'),
  check('isAdult').isBoolean().withMessage('isAdult must be a boolean'),
  check('startYear').isNumeric().withMessage('startYear must be a number'),
  check('genres').isArray().withMessage('genres must be an array')
]), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const movie = new Movie(req.body);
    await movie.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json(movie);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

// Update a movie (Admin only)
router.put('/:id', authMiddleware, validate([
  check('id').isMongoId().withMessage('Invalid movie ID')
]), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, session });
    if (!movie) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Movie not found' });
    }
    await session.commitTransaction();
    session.endSession();
    res.json(movie);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

// Delete a movie (Admin only)
router.delete('/:id', authMiddleware, validate([
  check('id').isMongoId().withMessage('Invalid movie ID')
]), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const movie = await Movie.findByIdAndDelete(req.params.id, { session });
    if (!movie) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Movie not found' });
    }
    await session.commitTransaction();
    session.endSession();
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
