import express from 'express';

import { tasksRoute } from './tasks-routes.js';

export const routes = express.Router();

routes.use('/api/tasks', tasksRoute);