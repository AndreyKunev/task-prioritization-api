import mongoose from 'mongoose';

import { calculatePriority, mergeSort } from '../utils/taskUtils.js';
import { analyzeSentiment } from '../utils/sentimentAnalysis.js';
import { Task } from '../models/task.js';
import { HttpError } from '../models/http-error.js';

export const createTask = async (req, res, next) => {
	const { title, description, dueDate, isCritical } = req.body;

	const priority = calculatePriority(isCritical, dueDate);
	const sentiment = await analyzeSentiment(description);

	const createdTask = new Task({
		title,
		description,
		priority,
		dueDate,
		isCompleted: false,
		sentiment
	});
	try {
		await createdTask.save();
	} catch (err) {
		return next(
			new HttpError('Creating task failed. Please try again.', 500)
		);
	}

	return res.status(201).json({ task: createdTask });
};

export const getTaskById = async (req, res, next) => {
	const targetId = req.params.taskId;

	if (!mongoose.Types.ObjectId.isValid(targetId)) {
		return next(new HttpError('Invalid task ID format.', 400));
	}

	let targetTask;

	try {
		targetTask = await Task.findById(targetId);
	} catch (err) {
		return next(
			new HttpError('Failed to get task.', 500)
		);
	}

	if (!targetTask) {
		return next(new HttpError('Could not find task for provided ID.', 404));
	}

	return res.json({ task: targetTask.toObject({ getters: true }) });
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

		if (req.query.sort === 'priority' || req.query.sort === 'dueDate') {
			tasks = mergeSort(tasks, req.query.sort);
		}

		return res.json({ tasks });
	} catch (err) {
		return next(new HttpError('Something went wrong. Could not retrieve tasks.', 500));
	}
};

export const updateTask = async (req, res, next) => {
	const targetId = req.params.taskId;

	if (!mongoose.Types.ObjectId.isValid(targetId)) {
		return next(new HttpError('Invalid task ID format.', 400));
	}

	const { title, description, dueDate, isCompleted, isCritical } = req.body;

	try {
		let priority = undefined;
		if (isCritical !== undefined || dueDate) {
			priority = calculatePriority(isCritical, dueDate);
		}
		
		let sentiment; 
		if (description) {
			sentiment = await analyzeSentiment(description);
		}

		const updatedTask = await Task.findByIdAndUpdate(
			targetId,
			{
				title,
				description,
				dueDate,
				isCompleted,
				...(sentiment && { sentiment }),
				...(priority && { priority }),
			},
			{ new: true, runValidators: true }
		);

		if (!updatedTask) {
			return next(
				new HttpError('Could not find task with provided ID.', 404)
			);
		}

		return res
			.status(200)
			.json({ task: updatedTask.toObject({ getters: true }) });
	} catch (err) {
		return next(
			new HttpError('Something went wrong. Could not update task.', 500)
		);
	}
};

export const deleteTask = async (req, res, next) => {
	const targetId = req.params.taskId;

	if (!mongoose.Types.ObjectId.isValid(targetId)) {
		return next(new HttpError('Invalid task ID format.', 400));
	}

	try {
		await Task.findByIdAndDelete(targetId);
	} catch (err) {
		return next(
			new HttpError('Something went wrong. Could not delete task.', 500)
		);
	}

	return res.status(200).json({ message: 'Task deleted' });
};
