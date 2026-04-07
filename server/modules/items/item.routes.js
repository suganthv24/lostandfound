import express from 'express';
import * as itemController from './item.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.post('/', itemController.createItem);
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);
router.delete('/:id', itemController.deleteItem);
router.patch('/:id/status', itemController.updateStatus);

export default router;
