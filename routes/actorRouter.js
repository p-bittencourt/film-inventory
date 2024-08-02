const router = require('express').Router();

// ACTOR ROUTES

const testActors = [
  {
    name: 'Leonardo DiCaprio',
    age: 46,
    nationality: 'American',
    picture: 'https://example.com/leonardo.jpg',
    movies: ['Inception', 'Titanic', 'The Revenant'],
  },
  {
    name: 'Natalie Portman',
    age: 40,
    nationality: 'Israeli-American',
    picture: 'https://example.com/natalie.jpg',
    movies: ['Black Swan', 'V for Vendetta', 'Thor'],
  },
  {
    name: 'Denzel Washington',
    age: 66,
    nationality: 'American',
    picture: 'https://example.com/denzel.jpg',
    movies: ['Training Day', 'Fences', 'The Equalizer'],
  },
];

router.get('/', (req, res, next) => {
  res.render('./actor/actor_list', { actors: testActors });
});

module.exports = router;
