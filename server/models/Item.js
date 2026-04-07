const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Lost', 'Found'], default: 'Lost' },
  college: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Additional Dev 2 fields like image, location, etc. can be added here
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
