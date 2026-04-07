import express from 'express';
import { contactOwner } from '../controllers/contactController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /items/:itemId/contact
// Phase 6: Apply authMiddleware to protect the route
router.post('/:itemId/contact', authMiddleware, contactOwner);

export default router;
