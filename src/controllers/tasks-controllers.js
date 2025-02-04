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

    try {
        let priority = undefined;
        if (isCritical !== undefined && dueDate) {
            priority = calculatePriority(isCritical, dueDate);
        }

        const updatedTask = await Task.findByIdAndUpdate(
            targetId,
            { title, description, dueDate, isCompleted, isCritical, ...(priority && { priority }) }, 
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Could not find task with provided ID.' });
        }

        res.status(200).json({ task: updatedTask.toObject({ getters: true }) });
    } catch (err) {
        next(new Error('Something went wrong. Could not update task.'));
    }
};


export const deleteTask = async (req, res, next) => {
	const targetId = req.params.taskId;

	try {
		await Task.findByIdAndDelete(targetId);
	} catch (err) {
		const error = new Error('Something went wrong. Could not delete task.');
		error.code = 500;
		return next(error);
	}


	res.status(200).json({ message: 'Task deleted' });
};


