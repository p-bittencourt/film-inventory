const Genre = require('../models/genre');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Display all genres
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().exec();
  res.render('./genre/genre_list', { genres: allGenres });
});

// Get genre form
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render('./genre/genre_create', { genre: '' });
});

// Post genre form
exports.genre_create_post = [
  // Validate an sanitize field
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name is required'),
  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages
      res.render('./genre/genre_create', {
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid
      await genre.save();
      res.redirect(genre.url);
    }
  }),
];

// Genre detail page
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();
  res.render('./genre/genre_detail', { genre: genre });
});

// Genre update get

// Genre update post

// Genre delete