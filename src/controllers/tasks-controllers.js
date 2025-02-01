import { randomUUID } from 'crypto';

import { calculatePriority } from '../utils/taskUtils.js';

let DUMMY_TASKS = [
	{
		id: '12345',
		title: 'Fix login bug',
		description:
			'Resolve the issue preventing users from logging in with Google OAuth.',
		priority: 'high',
		dueDate: '2025-02-01',
		isCompleted: false,
	},
    {
		id: '678911',
		title: 'Buy pants',
		description:
			'Buy new pair of pants.',
		priority: 'high',
		dueDate: '2025-02-12',
		isCompleted: false,
	},
];

export const createTask = (req, res, next) => {
	const { title, description, dueDate, isCritical } = req.body;

	let priority = calculatePriority(isCritical, dueDate);

	const createdTask = {
		id: crypto.randomUUID(),
		title,
		description,
		priority,
		dueDate,
		isCritical,
		isCompleted: false,
	};

    DUMMY_TASKS.push(createdTask);

    res.status(201).json({task: createdTask});
};
