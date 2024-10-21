const router = require('express').Router();
const director_controller = require('../controllers/directorController');
const checkPassword = require('../middleware/checkPassword');

router.get('/', director_controller.director_list);

router.get('/create', director_controller.director_create_get);

router.post('/create', checkPassword, director_controller.director_create_post);

router.get('/edit/:id', director_controller.director_update_get);

router.post(
  '/edit/:id',
  checkPassword,
  director_controller.director_update_post
);

router.delete('/:id', checkPassword, director_controller.director_delete);

router.get('/:id', director_controller.director_detail);

module.exports = router;
