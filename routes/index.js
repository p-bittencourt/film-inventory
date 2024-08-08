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
  res.redirect('/movies');
});

module.exports = router;
