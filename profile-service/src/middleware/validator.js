const { body } = require('express-validator');

exports.profileValidation = [
  body('bio')
    .optional()
    .trim(),
  body('location')
    .optional()
    .trim(),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('social.twitter')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid Twitter URL'),
  body('social.facebook')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid Facebook URL'),
  body('social.linkedin')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  body('social.github')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid GitHub URL')
]; 