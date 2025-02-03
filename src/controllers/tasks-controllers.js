import { calculatePriority, mergeSort } from '../utils/taskUtils.js';

let DUMMY_TASKS = [
	{
		id: '12345',
		title: 'Fix login bug',
		description:
			'Resolve the issue preventing users from logging in with Google OAuth.',
		priority: 'high',
		dueDate: '2025-02-03',
		isCritical: true,
		isCompleted: false,
	},
    {
		id: '678911',
		title: 'Buy pants',
		description:
			'Buy new pair of pants.',
		priority: 'medium',
		dueDate: '2025-02-12',
		isCritical: false,
		isCompleted: false,
	},
	{
		id: '17181921',
		title: 'Book plane tickets',
		description:
			'Book plane tickets for April trip.',
		priority: 'high',
		dueDate: '2025-02-04',
		isCritical: true,
		isCompleted: false,
	},
	{
		id: '100129',
		title: 'Get new coffee machine',
		description:
			'You need to replace your old coffee machine.',
		priority: 'low',
		dueDate: '2025-02-26',
		isCritical: false,
		isCompleted: false,
	}
];

export const createTask = (req, res, next) => {
	const { title, description, dueDate, isCritical } = req.body;

	const priority = calculatePriority(isCritical, dueDate);

	const createdTask = {
		id: crypto.randomUUID(),
		title,
		description,
		priority,
		dueDate,
		isCompleted: false,
	};

    DUMMY_TASKS.push(createdTask);

    res.status(201).json({task: createdTask});
};

export const getTaskById = (req, res, next) => {
	const targetId = req.params.taskId;

	const targetTask = DUMMY_TASKS.find((task) => {
		return task.id === targetId;
	})

	if (!targetTask) {
		const error = new Error('Could not find task with provided ID.')
		error.code = 404;
		return next(error);
	}

	res.json({ targetTask });
}

export const getTasksByPriority = (req, res, next) => {
	const { sort } = req.query;

	if (sort === 'priority') {
		const sortedTasks = mergeSort(DUMMY_TASKS);
		return res.json({ tasks: sortedTasks });
	}

	res.json({ tasks: DUMMY_TASKS});
}