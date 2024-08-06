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
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);
  res.render('./genre/genre_create', { genre: genre });
});

// Genre update post
exports.genre_update_post = [
  // Validate and sanitize field
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name is required'),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name, _id: req.params.id });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages
      res.render('./genre/genre_create', {
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid
      const updatedGenre = await Genre.findByIdAndUpdate(
        req.params.id,
        genre,
        {}
      );
      res.redirect(updatedGenre.url);
    }
  }),
];

// Genre delete
exports.genre_delete = asyncHandler(async (req, res, next) => {
  await Genre.findByIdAndDelete(req.params.id);
  res.redirect('/genres');
});
