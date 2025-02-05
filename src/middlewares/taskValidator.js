import { body } from 'express-validator';

const createTaskValidations = [
	body('title').notEmpty().withMessage('Title is required'),
	body('description')
		.optional()
		.isLength({ min: 3 })
		.withMessage('Description must be at least 3 characters long'),
	body('dueDate')
		.optional()
		.isISO8601()
		.toDate()
		.withMessage('Due date must be a valid date'),
];

const updateTaskValidations = [
	body('title').optional().notEmpty().withMessage('Title cannot be empty'),
	body('description')
		.optional()
		.isLength({ min: 3 })
		.withMessage('Description must be at least 3 characters long'),
	body('dueDate')
		.optional()
		.isISO8601()
		.toDate()
		.withMessage('Due date must be a valid date'),
];

const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

export const validateCreateTask = [
	...createTaskValidations,
	handleValidationErrors,
];

export const validateUpdateTask = [
	...updateTaskValidations,
	handleValidationErrors,
];
