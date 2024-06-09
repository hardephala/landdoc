const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  document: {
    type: String,
  },
  url: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'ActionNeeded', 'Completed'],
    default: 'Pending',
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
