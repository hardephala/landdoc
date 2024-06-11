const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  applicationName: {
    type: String,
    required: true,
  },
  requiredDocuments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RequiredDocument',
    },
  ],
  requiredSteps: [
    {
      from: String,
      to: String,
      role: {
        type: String,
        ref: 'AdminRoles',
      }
    },
  ],
});

const Requirement = mongoose.model('Requirement', requirementSchema);

module.exports = Requirement;
