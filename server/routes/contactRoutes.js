const express = require('express');
const { contactOwner } = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /items/:itemId/contact
// Phase 6: Apply authMiddleware to protect the route
router.post('/:itemId/contact', authMiddleware, contactOwner);

module.exports = router;
