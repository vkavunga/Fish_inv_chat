const mongoose = require('mongoose');

const fishSchema = new mongoose.Schema({
  fishName: String,
  placeOfCatch: String,
  catchLocation: String,
  qrImageUrl: String,
  fishImageUrl: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fish', fishSchema);
