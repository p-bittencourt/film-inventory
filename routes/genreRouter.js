const router = require('express').Router();
const genre_controller = require('../controllers/genreController');

router.get('/', genre_controller.genre_list);

router.get('/create', genre_controller.genre_create_get);

router.post('/create', genre_controller.genre_create_post);

// update get
router.get('/edit/:id', genre_controller.genre_update_get);

// update post
router.post('/edit/:id', genre_controller.genre_update_post);

// delete

router.get('/:id', genre_controller.genre_detail);

module.exports = router;
