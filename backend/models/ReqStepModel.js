const mongoose = require('mongoose');

const reqstepSchema = new mongoose.Schema({
  requirement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement',
  },
  from: String,
  to: String,
  role: {
    type: String,
    ref: 'AdminRoles',
    required: true,
  }
});


const RequiredStep = mongoose.model('RequiredStep', reqstepSchema);

module.exports = RequiredStep;
