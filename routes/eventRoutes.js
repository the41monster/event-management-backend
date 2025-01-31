const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.authenticate, eventController.createEvent);
router.get('/', authMiddleware.authenticate, eventController.getEvents);
router.get('/:id', authMiddleware.authenticate, eventController.getEventById);
router.put('/:id', authMiddleware.authenticate, eventController.updateEvent);
router.delete('/:id', authMiddleware.authenticate, eventController.deleteEvent);
router.post('/:id/register', authMiddleware.authenticate, eventController.registerForEvent);

module.exports = router;