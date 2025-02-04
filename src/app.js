import express from 'express';
import mongoose from 'mongoose';

import dotenv from 'dotenv';

import { routes } from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
const mongoURI = process.env.MONGO_URI;

app.use(express.json());

app.use('/', routes);

const startServer = async () => {
	try {
		await mongoose.connect(mongoURI);
		console.log('Connected to MongoDB');

		app.listen(port, () => {
			console.log(`Server running: http://${host}:${port}`);
		});
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

startServer();
