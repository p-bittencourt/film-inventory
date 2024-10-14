const Movie = require('../models/movie');
const Actor = require('../models/actor');
const Genre = require('../models/genre');
const Director = require('../models/director');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Helper function
async function getMovieCast(movie) {
  return await Actor.find({ movies: movie._id }).exec();
}

async function getGenreObjects(genres) {
  const genreObjects = [];
  for (const genre in genres) {
    const genreObject = await Genre.findById(genres[genre]).exec();
    genreObjects.push(genreObject);
  }
  return genreObjects;
}

async function getDirectorObjects(directors) {
  const directorObjects = [];
  for (const director in directors) {
    const directorObject = await Director.findById(directors[director]).exec();
    directorObjects.push(directorObject);
  }
  return directorObjects;
}

// Movie list
exports.movie_list = asyncHandler(async (req, res, next) => {
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
    console.log(actor);
    console.log(actorObj);
    if (actorObj) {
      query._id = { $in: actorObj.movies }; // assumes 'movies' is an array in Actor model
    }
  }

  // get all movies from the db
  const filteredMovies = await Movie.find(query)
    .populate('genre director')
    .exec();

  // order movies alhabetically
  const sortedMovies = filteredMovies
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  const movieCast = [];
  const movieDirectors = [];

  // loop through the movies and get the cast and director from each one to send to the view
  for (eachMovie of sortedMovies) {
    const cast = await getMovieCast(eachMovie);
    const directors = await getDirectorObjects(eachMovie.director);
    movieCast.push(cast);
    movieDirectors.push(directors);
  }

  // get all cast, directors and genres to send to the view for filtering
  const allGenres = await Genre.find().exec();
  const allDirectors = await Director.find().exec();
  const allActors = await Actor.find().exec();

  res.render('./movie/movie_list', {
    movies: sortedMovies,
    cast: movieCast,
    movieDirectors: movieDirectors,
    allGenres: allGenres,
    allDirectors: allDirectors,
    allActors: allActors,
  });
});

// Movie detail
exports.movie_detail = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id).exec();
  const actors = await Actor.find().exec();
  const cast = await getMovieCast(movie);
  const genres = await getGenreObjects(movie.genre);
  const directors = await getDirectorObjects(movie.director);

  const availableActors = actors.filter(
    (actor) => !cast.some((castActor) => castActor.id === actor.id)
  );

  res.render('./movie/movie_detail', {
    movie: movie,
    directors: directors,
    cast: cast,
    genres: genres,
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
    let directorIds = [];
    if (Array.isArray(director)) {
      directorIds = director;
    } else if (director) {
      directorIds = [director];
    }

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
      if (directorIds.length) {
        for (const directorId in directorIds) {
          const director = await Director.findById(directorIds[directorId]);
          if (!director.movies.includes(movie._id)) {
            director.movies.push(movie._id);
            await director.save();
          }
        }
      }
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
    let directorIds = [];
    if (Array.isArray(director)) {
      directorIds = director;
    } else if (director) {
      directorIds = [director];
    }

    const movie = new Movie({
      title,
      release_date,
      summary,
      picture,
      genre: Array.isArray(genre) ? genre : genre ? [genre] : [],
      director: directorIds,
      _id: req.params.id,
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
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        movie,
        {}
      );

      // Assign director to the movie
      if (directorIds.length) {
        for (const directorId in directorIds) {
          const director = await Director.findById(directorIds[directorId]);
          if (!director.movies.includes(movie._id)) {
            director.movies.push(movie._id);
            await director.save();
          }
        }
      }

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
  await Director.updateMany(
    { movies: movieId },
    { $pull: { movies: movieId } }
  ).exec();

  await Movie.findByIdAndDelete(movieId);
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
