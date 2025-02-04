import { calculatePriority, mergeSort } from '../utils/taskUtils.js';
import { Task } from '../models/task.js';

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

export const createTask = async (req, res, next) => {
	const { title, description, dueDate, isCritical } = req.body;

	const priority = calculatePriority(isCritical, dueDate);

	const createdTask = new Task({
		title,
		description,
		priority,
		dueDate,
		isCompleted: false,
	});
	try {
		await createdTask.save();
	} catch (err) {
		const error = new Error('Creating task failed. Please try again.');
		error.code = 500;
		return next(error);
	}

	res.status(201).json({ task: createdTask });
};

export const getTaskById = async (req, res, next) => {
	const targetId = req.params.taskId;
	let targetTask;

	try {
		targetTask = await Task.findById(targetId);
	} catch (err) {
		const error = new Error('Something went wrong, could not find task.');
		error.code = 500;
		return next(error);
	}

	if (!targetTask) {
		const error = new Error('Could not find task for provided ID.');
		error.code = 404;
		return next(error);
	}

	res.json({ task: targetTask.toObject({ getters: true }) });
};

export const getTasks = async (req, res, next) => {
    try {
        let query = {};

        if (req.query.filter && req.query.value !== undefined) {
            const filterKey = req.query.filter;
            let filterValue = req.query.value;

            if (filterValue === 'true') filterValue = true;
            if (filterValue === 'false') filterValue = false;

            query[filterKey] = filterValue;
        }

        let tasks = await Task.find(query);

        if (req.query.sort === 'priority') {
            tasks = mergeSort(tasks);
        }

        res.json({ tasks });
    } catch (error) {
        next(error); 
    }
};

export const updateTask = async (req, res, next) => {
	const targetId = req.params.taskId;
	const { title, description, dueDate, isCompleted, isCritical } = req.body;

	let task;
	try {
		task = await Task.findById(targetId);
	} catch (err) {
		const error = new Error('Something went wrong. Could not update task.');
		error.code = 500;
		return next(error);
	}

	if (!task) {
		const error = new Error('Could not find task with provided ID.');
		error.code = 404;
		return next(error);
	}

	if (title) {
		task.title = title;
	}

	if (description) {
		task.description = description;
	}

	if (dueDate) {
		task.dueDate = dueDate;
	}

	if (isCompleted) {
		task.isCompleted = isCompleted;
	}

	if (isCritical) {
		task.isCritical = isCritical;
	}

	if (isCritical && dueDate) {
		const newPriority = calculatePriority(isCritical, dueDate);
		task.priority = newPriority;
	}

	try {
		await task.save();
	} catch (err) {
		const error = new Error('Something went wrong. Could not update task.');
		error.code = 500;
		return next(error);
	}

	res.status(200).json({ task: task.toObject({ getters: true }) });
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

	res.status(200).json({ message: 'Task deleted' });
};
