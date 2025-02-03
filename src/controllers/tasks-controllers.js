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
		description: 'Buy new pair of pants.',
		priority: 'medium',
		dueDate: '2025-02-12',
		isCritical: false,
		isCompleted: false,
	},
	{
		id: '17181921',
		title: 'Book plane tickets',
		description: 'Book plane tickets for April trip.',
		priority: 'high',
		dueDate: '2025-02-04',
		isCritical: true,
		isCompleted: false,
	},
	{
		id: '100129',
		title: 'Get new coffee machine',
		description: 'You need to replace your old coffee machine.',
		priority: 'low',
		dueDate: '2025-02-26',
		isCritical: false,
		isCompleted: false,
	},
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

	res.status(201).json({ task: createdTask });
};

export const getTaskById = (req, res, next) => {
	const targetId = req.params.taskId;

	const targetTask = DUMMY_TASKS.find((task) => {
		return task.id === targetId;
	});

	if (!targetTask) {
		const error = new Error('Could not find task with provided ID.');
		error.code = 404;
		return next(error);
	}

	res.json({ targetTask });
};

export const getTasks = (req, res, next) => {
	let result = [...DUMMY_TASKS];

	const { sort } = req.query;

	if (sort === 'priority') {
		result = mergeSort(DUMMY_TASKS);
	}

	if (req.query.filter && req.query.value !== undefined) {
		const filterKey = req.query.filter;
		const filterValue = req.query.value;

		result = result.filter((task) => {
			if (typeof task[filterKey] === 'boolean') {
				return task[filterKey] === (filterValue === 'true');
			}
			return task[filterKey].toString().toLowerCase() === filterValue;
		});
	}

	res.json({ tasks: result });
};

export const updateTask = (req, res, next) => {
	const targetId = req.params.taskId;
	const { title, description, dueDate, isCompleted, isCritical } = req.body;

	const targetIndex = DUMMY_TASKS.findIndex((task) => task.id === targetId);
	const updatedTask ={...DUMMY_TASKS[targetIndex]};

	if (!updatedTask) {
		const error = new Error('Could not find task with provided ID.');
		error.code = 404;
		return next(error);
	}

	if (title) {
		updatedTask.title = title;
	}

	if (description) {
		updatedTask.description = description;
	}

	if (dueDate) {
		updatedTask.dueDate = dueDate;
	}

	if (isCompleted) {
		updatedTask.isCompleted = isCompleted;
	}

	if (isCritical) {
		updatedTask.isCritical = isCritical;
	}

	if (isCritical && dueDate) {
		const newPriority = calculatePriority(isCritical, dueDate);
		updatedTask.priority = newPriority;
	}

	DUMMY_TASKS[targetIndex] = updatedTask;

	res.status(200).json({ task: updatedTask });

};

export const deleteTask = (req, res, next) => {
	const targetId = req.params.taskId;

	const targetIndex = DUMMY_TASKS.find((task) => task.id === targetId);

	if (targetIndex === -1) {
		const error = new Error('Could not find task with provided ID.');
		error.code = 404;
		return next(error);
	}

	DUMMY_TASKS = DUMMY_TASKS.filter((task) => task.id != targetId);

	res.status(200).json({ message: "Task deleted" });
}