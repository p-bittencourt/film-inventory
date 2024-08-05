const Actor = require('../models/actor');
const Movie = require('../models/movie');
const asyncHandler = require('express-async-handler');

// Display all actors
exports.actor_list = asyncHandler(async (req, res, next) => {
  const allActors = await Actor.find().exec();
  const moviesByActor = [];
  // loop through all actors in the list to get the movies they feature in
  for (const actor in allActors) {
    const movie = await getMoviesFeaturing(allActors[actor]);
    moviesByActor.push(movie);
  }
  res.render('./actor/actor_list', {
    actors: allActors,
    movies: moviesByActor,
  });
});

// Get actor form
exports.actor_create_get = asyncHandler(async (req, res, next) => {
  const allMovies = await Movie.find().exec();
  res.render('./actor/actor_create', { actor: '', movies: allMovies });
});

// Post actor form
exports.actor_create_post = asyncHandler(async (req, res, next) => {
  // Implement form handling
  // Implement error handling
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
  await actor.save();
  res.redirect(actor.url);
});

// Actor detail page
exports.actor_detail = asyncHandler(async (req, res, next) => {
  const actor = await Actor.findById(req.params.id).exec();
  const moviesByActor = await getMoviesFeaturing(actor);

  res.render('./actor/actor_detail', { actor: actor, movies: moviesByActor });
});

// Actor updated
exports.actor_update_get = asyncHandler(async (req, res, next) => {
  const actor = await Actor.findById(req.params.id);
  const allMovies = await Movie.find().exec();
  res.render('./actor/actor_create', { actor: actor, movies: allMovies });
});

exports.actor_update_post = asyncHandler(async (req, res, next) => {
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
  const updatedActor = await Actor.findByIdAndUpdate(req.params.id, actor, {});
  res.redirect(updatedActor.url);
});

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
  return moviesByActor;
}
