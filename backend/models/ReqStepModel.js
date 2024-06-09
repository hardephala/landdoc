const mongoose = require('mongoose');

const reqstepSchema = new mongoose.Schema({
  requirement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement',
  },
  steporderno: {
    type: Number
  },
  stepstatus: {
    type: String
  },
  userprofile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const RequiredStep = mongoose.model('RequiredStep', reqstepSchema);

module.exports = RequiredStep;