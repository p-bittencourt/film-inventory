const Actor = require('../models/actor');
const asyncHandler = require('express-async-handler');

// Display all actors
exports.actor_list = asyncHandler(async (req, res, next) => {
  const allActors = await Actor.find().exec();
  res.render('./actor/actor_list', { actors: allActors });
});

// Get actor form
exports.actor_create_get = (req, res, next) => {
  res.render('./actor/actor_create');
};

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
  const actor = new Actor({
    first_name,
    family_name,
    date_of_birth,
    date_of_death,
    nationality,
    picture,
    // movies,
  });
  await actor.save();
  console.log('actor saved');
  res.redirect(actor.url);
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
