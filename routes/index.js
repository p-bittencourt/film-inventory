const express = require('express');

const router = express.Router();

// import and use routers
const actorRouter = require('./actorRouter');
const movieRouter = require('./movieRouter');
const genreRouter = require('./genreRouter');
const directorRouter = require('./directorRouter');

router.use('/actors', actorRouter);
router.use('/movies', movieRouter);
router.use('/genres', genreRouter);
router.use('/directors', directorRouter);

// Render index
router.get('/', (req, res, next) => {
  res.render('index');
});

// SHOW ROUTES

const testShows = [
  {
    title: 'Breaking Bad',
    director: 'Vince Gilligan',
    summary:
      'A high school chemistry teacher turned methamphetamine producer partners with a former student to create and sell the purest methamphetamine.',
    cast: ['Bryan Cranston', 'Aaron Paul'],
    poster: 'https://example.com/breakingbad.jpg',
  },
  {
    title: 'Game of Thrones',
    director: 'David Benioff',
    summary:
      'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    cast: ['Emilia Clarke', 'Kit Harington'],
    poster: 'https://example.com/gameofthrones.jpg',
  },
  {
    title: 'Stranger Things',
    director: 'The Duffer Brothers',
    summary:
      'In a small town where everyone knows everyone, a group of kids uncover a series of supernatural mysteries and government conspiracies.',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard'],
    poster: 'https://example.com/strangerthings.jpg',
  },
];

router.get('/shows', (req, res, next) => {
  res.render('./show/show_list', { shows: testShows });
});

module.exports = router;
