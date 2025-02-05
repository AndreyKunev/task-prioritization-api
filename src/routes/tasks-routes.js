import express from 'express';

import {
	createTask,
	deleteTask,
	getTaskById,
	getTasks,
	updateTask,
} from '../controllers/tasks-controllers.js';
import {
	validateCreateTask,
	validateUpdateTask,
} from '../middlewares/taskValidator.js';

export const tasksRoute = express.Router();

tasksRoute.get('/tasks/:taskId', getTaskById);

tasksRoute.get('/tasks', getTasks);

tasksRoute.put('/tasks/:taskId', validateUpdateTask, updateTask);

tasksRoute.delete('/tasks/:taskId', deleteTask);

tasksRoute.post('/tasks', validateCreateTask, createTask);
