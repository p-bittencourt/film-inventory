const router = require('express').Router();
const movie_controller = require('../controllers/movieController');

router.get('/', movie_controller.movie_list);

router.get('/create', movie_controller.movie_create_get);

router.post('/create', movie_controller.movie_create_post);

router.get('/edit/:id', movie_controller.movie_update_get);

router.post('/edit/:id', movie_controller.movie_update_post);

router.delete('/:id', movie_controller.movie_delete);

router.get('/:id', movie_controller.movie_detail);

module.exports = router;
