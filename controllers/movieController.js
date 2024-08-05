const Movie = require('../models/movie');
const Actor = require('../models/actor');
const asyncHandler = require('express-async-handler');

// Helper function
async function getMovieCast(movie) {
  return await Actor.find({ movies: movie._id }).exec();
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
  const cast = await getMovieCast(movie);

  res.render('./movie/movie_detail', { movie: movie, cast: cast });
});

// Movie create get
exports.movie_create_get = (req, res, next) => {
  res.render('./movie/movie_create', { movie: '' });
};

// Movie create post
exports.movie_create_post = asyncHandler(async (req, res, next) => {
  // Implement form handling
  // Implement error handling
  const { title, release_date, summary, picture } = req.body;
  const movie = new Movie({
    title,
    release_date,
    summary,
    picture,
  });
  await movie.save();
  res.redirect(movie.url);
});

// Movie updated
exports.movie_update_get = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  res.render('./movie/movie_create', { movie: movie });
});

exports.movie_update_post = asyncHandler(async (req, res, next) => {
  const { title, release_date, summary, picture } = req.body;
  const movie = new Movie({
    title,
    release_date,
    summary,
    picture,
    _id: req.params.id,
  });
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, movie, {});
  res.redirect(updatedMovie.url);
});

// Movie delete
exports.movie_delete = asyncHandler(async (req, res, next) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.redirect('/movies');
});
