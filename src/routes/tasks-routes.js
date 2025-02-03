import express from 'express';

import { createTask, getTaskById, getTasksByPriority } from '../controllers/tasks-controllers.js';


export const tasksRoute = express.Router();


tasksRoute.get('/tasks/:taskId', getTaskById);

tasksRoute.get('/tasks', getTasksByPriority);

tasksRoute.post('/tasks', createTask);

