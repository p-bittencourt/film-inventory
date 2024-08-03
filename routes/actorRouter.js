const router = require('express').Router();
const Actor = require('../models/actor');

// ACTOR ROUTES

/* const testActors = [
  {
    name: 'Leonardo DiCaprio',
    age: 46,
    nationality: 'American',
    picture: 'https://example.com/leonardo.jpg',
    movies: ['Inception', 'Titanic', 'The Revenant'],
    url: '/actors/1',
  },
  {
    name: 'Natalie Portman',
    age: 40,
    nationality: 'Israeli-American',
    picture: 'https://example.com/natalie.jpg',
    movies: ['Black Swan', 'V for Vendetta', 'Thor'],
    url: '/actors/2',
  },
  {
    name: 'Denzel Washington',
    age: 66,
    nationality: 'American',
    picture: 'https://example.com/denzel.jpg',
    movies: ['Training Day', 'Fences', 'The Equalizer'],
    url: '/actors/3',
  },
]; */

router.get('/', async (req, res, next) => {
  const allActors = await Actor.find().exec();
  res.render('./actor/actor_list', { actors: allActors });
});

router.get('/create', (req, res, next) => {
  res.render('./actor/actor_create');
});

router.post('/create', async (req, res, next) => {
  try {
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
      // movies: movies,
    });
    await actor.save();
    console.log('actor saved');
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const actor = await Actor.findById(req.params.id).exec();
  res.render('./actor/actor_detail', { actor: actor });
});

module.exports = router;
