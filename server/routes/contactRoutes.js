const express = require('express');
const { contactOwner } = require('../controllers/contactController');

const router = express.Router();

// POST /items/:itemId/contact
// Note: In Phase 1 integration, add "verifyToken" middleware here
router.post('/:itemId/contact', contactOwner);

module.exports = router;
