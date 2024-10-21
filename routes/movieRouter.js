const router = require('express').Router();
const movie_controller = require('../controllers/movieController');
const checkPassword = require('../middleware/checkPassword');

router.get('/', movie_controller.movie_list);

router.get('/create', movie_controller.movie_create_get);

router.post('/create', checkPassword, movie_controller.movie_create_post);

router.get('/edit/:id', movie_controller.movie_update_get);

router.post('/edit/:id', checkPassword, movie_controller.movie_update_post);

router.delete('/:id', checkPassword, movie_controller.movie_delete);

router.post('/:id/add-actor', movie_controller.movie_add_actor);

router.get('/:id', movie_controller.movie_detail);

module.exports = router;
