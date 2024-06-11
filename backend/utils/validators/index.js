//
const { validationResult } = require("express-validator");
const respond = require("../respond");

/****
 * @params props is like a referennce to find a dupulicate document
 * @params model is a Moongose.model like User
 */
const isDuplicate = async (props, model) => {
  const key = Object.keys(props)[0];
  const dup = await model.where(key, "==", props[key]).get();
  return dup.empty == false;
};

const isEmpty = (string) => {
  if (string == "" || string == null) return true;

  return false;
};

/**
 * Duplicate validator, is a validation helper that validates a value based on the query passed
 * @param value - value to search!
 * @param query - param @Schema ->@User.model
 */
const duplicateValidator = async (value, query, Model) => {
  if (value) {
    const _isDuplicate = await isDuplicate({ [query]: value }, Model);
    if (_isDuplicate) throw new Error(`${query} is taken`);
  }

  return true;
};

const checkErrors = (req, res, next) => {
  let errorValidation = validationResult(req);
  const errors = {};
  if (!errorValidation.isEmpty()) {
    // this will minify the errors for the frontend guys
    for (let error of errorValidation?.array({ onlyFirstError: true })) {
      const { path, msg } = error;

      errors[path] = msg;
    }

    return respond(res, 400, "validation error", errors);
  }

  return next();
};

module.exports = {
  isDuplicate,
  duplicateValidator,
  checkErrors,
};
