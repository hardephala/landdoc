const Requirement = require('../models/RequirementModel.js');
const RequiredDocument = require('../models/ReqDocsModel.js');
const RequiredStep = require('../models/ReqStepModel.js');

const createRequirement = async (req, res) => {
  try {
    const { applicationName, requiredDocuments, requiredSteps } = req.body;
    const requiredDocumentsArray = Object.entries(requiredDocuments).map(([document, fee]) => ({
      document,
      fee,
    }));

    const createdDocuments = await RequiredDocument.create(requiredDocumentsArray);
    const requirement = new Requirement({
      applicationName,
      requiredDocuments: createdDocuments.map(doc => doc._id),
      requiredSteps,
    });

    await requirement.save();

    const populatedRequirement = await Requirement.populate(requirement, {
      path: 'requiredDocuments', 
    });

    res.json({ status: 'success', message: 'Saved successfully', requirement:populatedRequirement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed' });
  }
};

const getRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find({}).populate('requiredDocuments');
    res.json(requirements);
  } catch (error) {
    console.error(error);
    console.log("requiremennnts faiiiled");
    res.status(500).json({ error: 'Failed to retrieve the requirements' });
  }
};

const getSteps = async (req, res) => {
  try {
    const steps = await Requirement.find({}).populate('requiredSteps');
    res.json(steps);
  } catch (error) {
    console.error(error);
    console.log("steps did not get retreiiived");
    res.status(500).json({ error: 'Failed to retrieve the steps' });
  }
};

const deleteRequirement = async (req, res) => {
  const { requirementId } = req.params;
  try {
    const existingRequirement = await Requirement.findById(requirementId);
    if (!existingRequirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }
    await existingRequirement.deleteOne();

    res.json({ message: 'Requirement deleted successfully' });
  } catch (error) {
    console.error('Error deleting requirement:', error);
    res.status(500).json({ error: 'Failed to delete requirement' });
  }
};

module.exports = { createRequirement, getRequirements, getSteps, deleteRequirement };
