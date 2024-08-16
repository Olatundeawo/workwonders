const { body, validationResult } = require('express-validator');

// User creation validation rules
const userCreateValidationRules = () => {
    return [
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
        body('email')
            .trim()
            .isEmail().withMessage('Invalid email format')
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        body('role')
            .trim()
            .notEmpty().withMessage('Role is required')
            .isIn(['admin', 'user']).withMessage('Invalid role type'),
        body('bio')
            .optional()
            .trim()
            .isLength({ max: 300 }).withMessage('Bio must be at most 300 characters long'),
        body('profilePicture')
            .optional()
            .trim()
            .isURL().withMessage('Profile picture must be a valid URL'),
    ];
};

// Middleware to handle validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    userCreateValidationRules,
    validate,
};
