import express from 'express';

import { createTask, getTaskById, getTasks, updateTask } from '../controllers/tasks-controllers.js';


export const tasksRoute = express.Router();


tasksRoute.get('/tasks/:taskId', getTaskById);

tasksRoute.get('/tasks', getTasks);

tasksRoute.put('/tasks/:taskId', updateTask);

tasksRoute.post('/tasks', createTask);

