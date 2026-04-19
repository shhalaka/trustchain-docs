const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  documentId: String,
  issuer: String,
  fileName: String,
  txHash: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', documentSchema);