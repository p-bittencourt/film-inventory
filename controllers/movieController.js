const Movie = require('../models/movie');
const Actor = require('../models/actor');
const asyncHandler = require('express-async-handler');
const movie = require('../models/movie');

// Helper function
async function getMovieCast(movie) {
  return await Actor.find({ movies: movie._id }).exec();
}

// Movie list
exports.movie_list = asyncHandler(async (req, res, next) => {
  const allMovies = await Movie.find().exec();
  const movieCast = [];
  for (eachMovie of allMovies) {
    const cast = await getMovieCast(eachMovie);
    movieCast.push(cast);
  }
  res.render('./movie/movie_list', { movies: allMovies, cast: movieCast });
});

// Movie detail
exports.movie_detail = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id).exec();
  const cast = await getMovieCast(movie);

  res.render('./movie/movie_detail', { movie: movie, cast: cast });
});

// Movie create get
exports.movie_create_get = (req, res, next) => {
  res.render('./movie/movie_create');
};

// Movie create post
exports.movie_create_post = asyncHandler(async (req, res, next) => {
  // Implement form handling
  // Implement error handling
  const { title, release_date, summary, poster } = req.body;
  const movie = new Movie({
    title,
    release_date,
    summary,
    poster,
  });
  await movie.save();
  res.redirect(movie.url);
});

// Movie updated
exports.movie_update = (req, res, next) => {
  res.send('movie update not yet implemented');
};

// Movie delete
exports.movie_delete = (req, res, next) => {
  res.send('movie delete not yet implemented');
};