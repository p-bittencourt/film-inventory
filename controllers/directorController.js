const Director = require('../models/director');
const Movie = require('../models/movie');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Display all directors
exports.director_list = asyncHandler(async (req, res, next) => {
  const allDirectors = await Director.find().populate('movies').exec();

  // order alphabetically
  const sortedDirectors = allDirectors
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  res.render('./director/director_list', {
    directors: sortedDirectors,
  });
});

// Get director form
exports.director_create_get = asyncHandler(async (req, res, next) => {
  const allMovies = await sortedMovieList();
  res.render('./director/director_create', { director: '', movies: allMovies });
});

// Post actor form
exports.director_create_post = [
  // Validate and sanitize fields
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name is required'),
  body('family_name')
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 1 })
    .escape()
    .withMessage('Invalid family name'),
  body('date_of_birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage('Invalid date of birth'),
  body('date_of_death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage('Invalid date of death'),
  body('nationality')
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 1 })
    .escape()
    .withMessage('Invalid value for nationality'),
  body('picture')
    .trim()
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Invalid url'),
  body('movies.*').trim().escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);

    const {
      first_name,
      family_name,
      date_of_birth,
      date_of_death,
      nationality,
      picture,
      movies,
    } = req.body;

    let movieIds = [];
    if (Array.isArray(movies)) {
      movieIds = movies;
    } else if (movies) {
      movieIds = [movies];
    }

    const director = new Director({
      first_name,
      family_name,
      date_of_birth,
      date_of_death,
      nationality,
      picture,
      movies: movieIds,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitzed value/errors messages.
      const allMovies = await Movie.find().exec();
      res.render('./director/director_create', {
        director: director,
        movies: allMovies,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid. Save director
      await director.save();
      // Assign director to the movie
      if (movieIds.length) {
        for (const movieId in movieIds) {
          const movie = await Movie.findById(movieIds[movieId]);
          if (!movie.director.includes(director._id)) {
            movie.director.push(director._id);
            await movie.save();
          }
        }
      }
      res.redirect(director.url);
    }
  }),
];

// Director detail page
exports.director_detail = asyncHandler(async (req, res, next) => {
  const director = await Director.findById(req.params.id).exec();
  const moviesFromDirector = await getMoviesFrom(director);
  res.render('./director/director_detail', {
    director: director,
    movies: moviesFromDirector,
  });
});

// Director update
exports.director_update_get = asyncHandler(async (req, res, next) => {
  const director = await Director.findById(req.params.id);
  const allMovies = await sortedMovieList();
  res.render('./director/director_create', {
    director: director,
    movies: allMovies,
  });
});

exports.director_update_post = [
  // Validate and sanitize fields
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name is required'),
  body('family_name')
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 1 })
    .escape()
    .withMessage('Invalid family name'),
  body('date_of_birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage('Invalid date of birth'),
  body('date_of_death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage('Invalid date of death'),
  body('nationality')
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 1 })
    .escape()
    .withMessage('Invalid value for nationality'),
  body('picture')
    .trim()
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Invalid url'),
  body('movies.*').trim().escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);

    const {
      first_name,
      family_name,
      date_of_birth,
      date_of_death,
      nationality,
      picture,
      movies,
    } = req.body;

    let movieIds = [];
    if (Array.isArray(movies)) {
      movieIds = movies;
    } else if (movies) {
      movieIds = [movies];
    }

    const director = new Director({
      first_name,
      family_name,
      date_of_birth,
      date_of_death,
      nationality,
      picture,
      movies: movieIds,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitzed value/errors messages.
      const allMovies = await Movie.find().exec();
      console.log(errors);
      res.render('./director/director_create', {
        director: director,
        movies: allMovies,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid. Save director
      const updatedDirector = await Director.findByIdAndUpdate(
        req.params.id,
        director,
        {}
      );

      // Assign director to the movie
      if (movieIds.length) {
        for (const movieId in movieIds) {
          const movie = await Movie.findById(movieIds[movieId]);
          if (!movie.director.includes(director._id)) {
            movie.director.push(director._id);
            await movie.save();
          }
        }
      }

      res.redirect(updatedDirector.url);
    }
  }),
];

// Director delete
exports.director_delete = asyncHandler(async (req, res, next) => {
  const directorId = req.params.id;
  // Ensure director object is deleted from connected movies
  await Movie.updateMany(
    { director: directorId },
    { $pull: { director: directorId } }
  ).exec();

  // Delete the director
  await Director.findByIdAndDelete(directorId);
  res.redirect('/directors');
});

// Helper functions
async function getMoviesFrom(director) {
  const moviesFromDirector = [];
  for (const movieId of director.movies) {
    const movie = await Movie.findById(movieId).exec();
    moviesFromDirector.push(movie);
  }
  moviesFromDirector.sort((a, b) => a.title.localeCompare(b.title));
  return moviesFromDirector;
}

async function sortedMovieList() {
  const allMovies = await Movie.find().exec();
  allMovies.sort((a, b) => a.title.localeCompare(b.title));
  return allMovies;
}
