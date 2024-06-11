const { body, param } =  require("express-validator");
const { checkErrors } =  require(".");

const validateRequirement = [
  body('applicationName')
    .notEmpty()
    .withMessage('Application name is required')
    .isString()
    .withMessage('Application name must be a string'),

  body('requiredDocuments')
    .isArray()
    .withMessage('Required documents must be an array'),

  body('requiredSteps')
    .isArray()
    .withMessage('Required steps must be an array'),

  body('requiredSteps.*.from')
    .optional()
    .isString()
    .withMessage('Step "from" must be a string'),

  body('requiredSteps.*.to')
    .optional()
    .isString()
    .withMessage('Step "to" must be a string'),

  body('requiredSteps.*.role')
    .optional()
    .isString()
    .withMessage('Role must be a string'),
    
    checkErrors,
];


module.exports = {
  validateRequirement,
};