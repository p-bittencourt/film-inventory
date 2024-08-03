const Actor = require('../models/actor');
const Movie = require('../models/movie');
const asyncHandler = require('express-async-handler');

// Display all actors
exports.actor_list = asyncHandler(async (req, res, next) => {
  const allActors = await Actor.find().exec();
  res.render('./actor/actor_list', { actors: allActors });
});

// Get actor form
exports.actor_create_get = asyncHandler(async (req, res, next) => {
  const allMovies = await Movie.find().exec();
  res.render('./actor/actor_create', { movies: allMovies });
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
  // await actor.save();
  console.log(actor);
  // res.redirect(actor.url);
});

// Actor detail page
exports.actor_detail = asyncHandler(async (req, res, next) => {
  const actor = await Actor.findById(req.params.id).exec();
  res.render('./actor/actor_detail', { actor: actor });
});

// Actor updated
exports.actor_update = (req, res, next) => {
  res.send('actor update not yet implemented');
};

// Actor delete
exports.actor_delete = (req, res, next) => {
  res.send('actor delete not yet implemented');
};
