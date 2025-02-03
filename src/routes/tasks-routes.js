import express from 'express';

import { createTask, getTaskById, getTasks } from '../controllers/tasks-controllers.js';


export const tasksRoute = express.Router();


tasksRoute.get('/tasks/:taskId', getTaskById);

tasksRoute.get('/tasks', getTasks);

tasksRoute.post('/tasks', createTask);

