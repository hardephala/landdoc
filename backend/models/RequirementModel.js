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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RequiredStep',
    },
  ],
});

const Requirement = mongoose.model('Requirement', requirementSchema);

module.exports = Requirement;
