const Movie = require('../models/movie');
const asyncHandler = require('express-async-handler');

// Movie list
exports.movie_list = asyncHandler(async (req, res, next) => {
  const allMovies = await Movie.find().exec();
  res.render('./movie/movie_list', { movies: allMovies });
});

// Movie detail
exports.movie_detail = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id).exec();
  res.render('./movie/movie_detail', { movie: movie });
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
