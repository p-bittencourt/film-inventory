const router = require('express').Router();
const actor_controller = require('../controllers/actorController');

router.get('/', actor_controller.actor_list);

router.get('/create', actor_controller.actor_create_get);

router.post('/create', actor_controller.actor_create_post);

router.get('/edit/:id', actor_controller.actor_update_get);

router.post('/edit/:id', actor_controller.actor_update_post);

router.delete('/:id', actor_controller.actor_delete);

router.get('/:id', actor_controller.actor_detail);

module.exports = router;
