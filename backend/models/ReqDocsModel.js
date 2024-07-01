const mongoose = require('mongoose');

const reqdocumentSchema = new mongoose.Schema({
  document: {
    type: String,
  },
  fee: {
    type: Number,
  },
});

const RequiredDocument = mongoose.model('RequiredDocument', reqdocumentSchema);

module.exports = RequiredDocument;
