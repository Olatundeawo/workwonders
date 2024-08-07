const { body, validationResult } = require('express-validator');

const validateProject = [
    body('title')
        .isString()
        .withMessage('Title must be a string')
        .notEmpty()
        .withMessage('Title is required'),
    body('description')
        .isString()
        .withMessage('Description must be a string')
        .notEmpty()
        .withMessage('Description is required'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date'),
    body('status')
        .optional()
        .isIn(['ongoing', 'completed'])
        .withMessage('Status must be either ongoing or completed'),
    
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateProject;
