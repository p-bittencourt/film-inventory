const Movie = require('../models/movie');
const asyncHandler = require('express-async-handler');

// Movie list
exports.movie_list = asyncHandler(async (req, res, next) => {
  const allMovies = await Movie.find().exec();
  res.render('./movie/movie_list', { movies: allMovies });
});
