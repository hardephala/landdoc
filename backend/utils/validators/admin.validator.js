const { body, validationResult } = require('express-validator');
const { checkErrors } =  require(".");

// Validation rules for creating admin roles
const validateAdminRoles = [
  body('roles')
    .isArray({ min: 1 })
    .withMessage('Roles must be an array with at least one role'),
  body('roles.*')
    .isString()
    .withMessage('Each role must be a string'),

    checkErrors
];


module.exports = {
  validateAdminRoles,
};