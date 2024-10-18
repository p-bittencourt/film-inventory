const Actor = require('../models/actor');
const Movie = require('../models/movie');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Display all actors
exports.actor_list = asyncHandler(async (req, res, next) => {
  const allActors = await Actor.find().populate('movies').exec();

  // order actors by alphabetical order
  const sortedActors = allActors
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  res.render('./actor/actor_list', {
    actors: sortedActors,
  });
});

// Get actor form
exports.actor_create_get = asyncHandler(async (req, res, next) => {
  const allMovies = await sortedMovieList();
  res.render('./actor/actor_create', { actor: '', movies: allMovies });
});

// Post actor form
exports.actor_create_post = [
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

    const actor = new Actor({
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
      res.render('./actor/actor_create', {
        actor: actor,
        movies: allMovies,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid. Save actor
      await actor.save();
      res.redirect(actor.url);
    }
  }),
];

// Actor detail page
exports.actor_detail = asyncHandler(async (req, res, next) => {
  const actor = await Actor.findById(req.params.id).exec();
  const moviesByActor = await getMoviesFeaturing(actor);

  res.render('./actor/actor_detail', { actor: actor, movies: moviesByActor });
});

// Actor update
exports.actor_update_get = asyncHandler(async (req, res, next) => {
  const actor = await Actor.findById(req.params.id);
  const allMovies = await sortedMovieList();
  res.render('./actor/actor_create', { actor: actor, movies: allMovies });
});

exports.actor_update_post = [
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

    const actor = new Actor({
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
      res.render('./actor/actor_create', {
        actor: actor,
        movies: allMovies,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid. Save actor
      const updatedActor = await Actor.findByIdAndUpdate(
        req.params.id,
        actor,
        {}
      );
      res.redirect(updatedActor.url);
    }
  }),
];

// Actor delete
exports.actor_delete = asyncHandler(async (req, res, next) => {
  await Actor.findByIdAndDelete(req.params.id);
  res.redirect('/actors');
});

// Helper functions
async function getMoviesFeaturing(actor) {
  const moviesByActor = [];
  for (const movieId of actor.movies) {
    const movie = await Movie.findById(movieId).exec();
    moviesByActor.push(movie);
  }
  moviesByActor.sort((a, b) => a.title.localeCompare(b.title));
  return moviesByActor;
}

async function sortedMovieList() {
  const allMovies = await Movie.find().exec();
  allMovies.sort((a, b) => a.title.localeCompare(b.title));
  return allMovies;
}
