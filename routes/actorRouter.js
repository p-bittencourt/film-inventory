const router = require('express').Router();
const actor_controller = require('../controllers/actorController');

router.get('/', actor_controller.actor_list);

router.get('/create', actor_controller.actor_create_get);

router.post('/create', actor_controller.actor_create_post);

router.get('/:id', actor_controller.actor_detail);

module.exports = router;

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
