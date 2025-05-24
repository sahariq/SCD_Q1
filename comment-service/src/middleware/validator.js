const { body } = require('express-validator');

exports.commentValidation = [
  body('blogId')
    .notEmpty()
    .withMessage('Blog ID is required'),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Comment content is required')
]; 