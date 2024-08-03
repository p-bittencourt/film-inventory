const router = require('express').Router();
const movie_controller = require('../controllers/movieController');

router.get('/', movie_controller.movie_list);

module.exports = router;
