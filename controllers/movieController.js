const Movie = require('../models/movie');
const Actor = require('../models/actor');
const Genre = require('../models/genre');
const Director = require('../models/director');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Helper function
function getDirectorIds(director) {
  return Array.isArray(director) ? director : director ? [director] : [];
}

// Movie list
exports.movie_list = asyncHandler(async (req, res, next) => {
  // Allow for filtering the movie list
  const { genre, director, actor } = req.query;

  const query = {};
  if (genre) {
    query.genre = genre;
  }
  if (director) {
    query.director = director;
  }
  if (actor) {
    // Fetch actor and use their associated movie list
    const actorObj = await Actor.findById(actor).exec();
    if (actorObj) {
      query._id = { $in: actorObj.movies }; // assumes 'movies' is an array in Actor model
    }
  }

  // Get all movies from the db
  const filteredMovies = await Movie.find(query)
    .populate('genre director')
    .exec();

  // Sort movies alhabetically
  const sortedMovies = filteredMovies
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  // Fetch all registered actors and sort alphabetically
  const allActors = await Actor.find().exec();
  allActors.sort((a, b) => a.name.localeCompare(b.name));

  // Map actors and directors to their respective movies
  const movieCast = sortedMovies.map((movie) =>
    allActors.filter((actor) => actor.movies.includes(movie._id))
  );

  // Fetch and sort genres for filtering
  const allGenres = await Genre.find().exec();
  allGenres.sort((a, b) => a.name.localeCompare(b.name));

  // Fetch and sort directors for filtering
  const allDirectors = await Director.find().exec();
  allDirectors.sort((a, b) => a.name.localeCompare(b.name));

  // Render the page
  res.render('./movie/movie_list', {
    movies: sortedMovies,
    cast: movieCast,
    movieDirectors: sortedMovies.map((movie) => movie.director),
    allGenres,
    allDirectors,
    allActors,
  });
});

// Movie detail
exports.movie_detail = asyncHandler(async (req, res, next) => {
  // Fetch the movie and populate genres and directors
  const movie = await Movie.findById(req.params.id)
    .populate('genre director')
    .exec();
  // Fetch the movie cast
  const cast = await Actor.find({ movies: movie._id }).exec();

  const allActors = await Actor.find().exec();

  const availableActors = allActors.filter(
    (actor) => !cast.some((castActor) => castActor.id === actor.id)
  );

  res.render('./movie/movie_detail', {
    movie,
    directors: movie.director,
    cast,
    genres: movie.genre,
    actors: availableActors,
  });
});

// Movie create get
exports.movie_create_get = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().exec();
  const allDirectors = await Director.find().exec();
  res.render('./movie/movie_create', {
    movie: '',
    genres: allGenres,
    directors: allDirectors,
  });
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
  body('genre.*')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid genre ID'),
  body('director.*')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid director ID'),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);

    const { title, release_date, summary, picture, genre, director } = req.body;

    // Get director ids from the form
    let directorIds = getDirectorIds(director);

    const movie = new Movie({
      title,
      release_date,
      summary,
      picture,
      genre: Array.isArray(genre) ? genre : genre ? [genre] : [],
      director: directorIds,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitzed value/errors messages.
      const allGenres = await Genre.find().exec();
      const allDirectors = await Director.find().exec();
      res.render('./movie/movie_create', {
        movie: movie,
        genres: allGenres,
        directors: allDirectors,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid. Save actor
      await movie.save();
      // Assign director to the movie
      await Director.updateMany(
        { _id: { $in: directorIds } },
        { $addToSet: { movies: movie._id } }
      ).exec();

      res.redirect(movie.url);
    }
  }),
];

// Movie updated
exports.movie_update_get = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  const allGenres = await Genre.find().exec();
  const allDirectors = await Director.find().exec();
  res.render('./movie/movie_create', {
    movie: movie,
    genres: allGenres,
    directors: allDirectors,
  });
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
  body('genre.*')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid genre ID'),
  body('director.*')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid director ID'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const { title, release_date, summary, picture, genre, director } = req.body;

    // Get director ids from the form
    let directorIds = getDirectorIds(director);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitzed value/errors messages.
      const allGenres = await Genre.find().exec();
      const allDirectors = await Director.find().exec();
      return res.render('./movie/movie_create', {
        movie: {
          title,
          release_date,
          summary,
          picture,
          genre: Array.isArray(genre) ? genre : genre ? [genre] : [],
          director: directorIds,
          _id: req.params.id,
        },
        genres: allGenres,
        directors: allDirectors,
        errors: errors.array(),
      });
    }

    // Data is valid.
    // Handle synchronization between director and movie objects
    const existingMovie = await Movie.findById(req.params.id).exec();
    const currentDirectorIds = existingMovie.director.map((director) =>
      director.toString()
    );

    // Find directors that were removed and remove movie reference in the director object
    const removedDirectors = currentDirectorIds.filter(
      (id) => !directorIds.includes(id)
    );
    if (removedDirectors.length) {
      await Director.updateMany(
        { _id: { $in: removedDirectors } },
        { $pull: { movies: req.params.id } }
      ).exec();
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        release_date,
        summary,
        picture,
        genre: Array.isArray(genre) ? genre : genre ? [genre] : [],
        director: directorIds,
      },
      { new: true }
    ).exec();

    await Director.updateMany(
      { _id: { $in: directorIds } },
      { $addToSet: { movies: req.params.id } }
    ).exec();

    res.redirect(updatedMovie.url);
  }),
];

// Movie delete
exports.movie_delete = asyncHandler(async (req, res, next) => {
  const movieId = req.params.id;

  // To ensure that either all references get deleted or none do,
  // We could use a MongoDB transaction, however, the free tier for this exercise doesn't support it.
  // So we won't implement transaction handling.
  // const session = await mongoose.startSession();
  // session.startTransaction();

  // Remove movie references from actors and directors in parallel
  await Promise.all([
    Actor.updateMany(
      { movies: movieId },
      { $pull: { movies: movieId } }
    ).exec(),
    Director.updateMany(
      { movies: movieId },
      { $pull: { movies: movieId } }
    ).exec(),
  ]);

  // Delete the movie
  await Movie.findByIdAndDelete(movieId);

  // Redirect to the movies list page
  res.redirect('/movies');
});

// Add actor from movie_detail view
exports.movie_add_actor = asyncHandler(async (req, res, next) => {
  const movieId = req.params.id;
  const actor = await Actor.findById(req.body['add-cast']).exec();

  actor.movies.push(movieId);

  await actor.save();

  res.redirect(`/movies/${movieId}`);
});
