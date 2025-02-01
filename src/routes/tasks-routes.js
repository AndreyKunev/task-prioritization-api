import express from 'express';

import { createTask } from '../controllers/tasks-controllers.js';


export const tasksRoute = express.Router();


tasksRoute.post('/', createTask);
