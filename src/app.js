import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { routes } from './routes/index.js';
import { notFoundHandler } from './middlewares/not-found-handler.js';
import { defaultErrorHandler } from './middlewares/default-error-handler.js';


dotenv.config();

const app = express();
const mongoURI = process.env.MONGO_URI;

app.use(express.json());

app.use('/', routes);

app.use(notFoundHandler);

app.use(defaultErrorHandler)

export const connectDB = async () => {
	try {
		await mongoose.connect(mongoURI);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

export default app;
