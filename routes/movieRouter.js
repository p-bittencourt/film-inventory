const router = require('express').Router();
const movie_controller = require('../controllers/movieController');

router.get('/', movie_controller.movie_list);

router.get('/create', movie_controller.movie_create_get);

router.post('/create', movie_controller.movie_create_post);

router.get('/:id', movie_controller.movie_detail);

module.exports = router;
