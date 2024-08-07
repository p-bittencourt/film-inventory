const Movie = require('../models/movie');
const Actor = require('../models/actor');
const Genre = require('../models/genre');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Helper function
async function getMovieCast(movie) {
  return await Actor.find({ movies: movie._id }).exec();
}

async function getGenreObjects(genres) {
  const genreNames = [];
  for (const genre in genres) {
    const genreName = await Genre.findById(genres[genre]).exec();
    genreNames.push(genreName);
  }
  return genreNames;
}

// Movie list
exports.movie_list = asyncHandler(async (req, res, next) => {
  // get all movies from the db
  const allMovies = await Movie.find().exec();
  // loop through the movies and get the cast from each one to send to the view
  const movieCast = [];
  for (eachMovie of allMovies) {
    const cast = await getMovieCast(eachMovie);
    movieCast.push(cast);
  }
  res.render('./movie/movie_list', {
    movies: allMovies,
    cast: movieCast,
  });
});

// Movie detail
exports.movie_detail = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id).exec();
  const actors = await Actor.find().exec();
  const cast = await getMovieCast(movie);
  const genres = await getGenreObjects(movie.genre);

  res.render('./movie/movie_detail', {
    movie: movie,
    cast: cast,
    genres: genres,
    actors: actors,
  });
});

// Movie create get
exports.movie_create_get = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().exec();
  res.render('./movie/movie_create', { movie: '', genres: allGenres });
});

// Movie create post
exports.movie_create_post = [
  // Validate and sanitize fields
  body('title')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Title is required.'),
  body('summary')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Summary is required.'),
  body('release_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage('Invalid release date'),
  body('picture')
    .trim()
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Invalid url'),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);

    const { title, release_date, summary, picture, genre } = req.body;
    const movie = new Movie({
      title,
      release_date,
      summary,
      picture,
      genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitzed value/errors messages.
      res.render('./movie/movie_create', {
        movie: movie,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid. Save actor
      await movie.save();
      res.redirect(movie.url);
    }
  }),
];

// Movie updated
exports.movie_update_get = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  const allGenres = await Genre.find().exec();
  res.render('./movie/movie_create', { movie: movie, genres: allGenres });
});

exports.movie_update_post = [
  // Validate and sanitize fields
  body('title')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Title is required.'),
  body('summary')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Summary is required.'),
  body('release_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage('Invalid release date'),
  body('picture')
    .trim()
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Invalid url'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const { title, release_date, summary, picture, genre } = req.body;
    const movie = new Movie({
      title,
      release_date,
      summary,
      picture,
      genre,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitzed value/errors messages.
      res.render('./movie/movie_create', {
        movie: movie,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid. Save actor
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        movie,
        {}
      );
      res.redirect(updatedMovie.url);
    }
  }),
];

// Movie delete
exports.movie_delete = asyncHandler(async (req, res, next) => {
  const movieId = req.params.id;
  await Actor.updateMany(
    { movies: movieId },
    { $pull: { movies: movieId } }
  ).exec();

  await Movie.findByIdAndDelete(movieId);
  res.redirect('/movies');
});
