import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../src/app.js';
import { Task } from '../src/models/task.js';

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();
	await mongoose.connect(mongoUri);
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

beforeEach(async () => {
	await Task.deleteMany();
});

describe('🔹 Task API CRUD Operations', () => {
	let taskId;

	test('Create a new task', async () => {
		const response = await request(app).post('/tasks').send({
			title: 'Test Task',
			description: 'Test Description',
			dueDate: '2025-02-10',
			isCompleted: false,
			isCritical: false,
			priority: 'medium',
		});

		expect(response.status).toBe(201);
		expect(response.body.task).toHaveProperty('id');
		expect(response.body.task.title).toBe('Test Task');
		taskId = response.body.task.id;
	});

	test('Retrieve all tasks', async () => {
		await Task.create({
			title: 'Sample Task',
			description: 'Sample Description',
			dueDate: '2025-02-10',
			isCompleted: false,
			isCritical: false,
			priority: 'medium',
		});

		const response = await request(app).get('/tasks');
		expect(response.status).toBe(200);
		expect(response.body.tasks.length).toBeGreaterThan(0);
	});

	test('Retrieve a task by ID', async () => {
		const newTask = await Task.create({
			title: 'Find Task',
			description: 'Find this task',
			dueDate: '2025-02-15',
			isCompleted: false,
			priority: 'medium', 
		});

		const response = await request(app).get(`/tasks/${newTask.id}`);

		console.log(response.body);

		expect(response.status).toBe(200);
		expect(response.body.task.title).toBe('Find Task'); 
	});

	test('Update a task', async () => {
		const newTask = await Task.create({
			title: 'Update Me',
			description: 'Will be updated',
			dueDate: '2025-02-20',
			isCompleted: false,
			isCritical: false,
			priority: 'medium',
		});

		const response = await request(app).put(`/tasks/${newTask.id}`).send({
			title: 'Updated Task',
			isCompleted: true,
			priority: 'high',
		});

		expect(response.status).toBe(200);
		expect(response.body.task.title).toBe('Updated Task');
		expect(response.body.task.isCompleted).toBe(true);
	});

	test('Delete a task', async () => {
		const newTask = await Task.create({
			title: 'Delete Me',
			description: 'Will be deleted',
			dueDate: '2025-02-20',
			isCompleted: false,
			isCritical: false,
			priority: 'medium',
		});

		const response = await request(app).delete(`/tasks/${newTask.id}`);
		expect(response.status).toBe(200);
		expect(response.body.message).toBe('Task deleted');

		const checkTask = await Task.findById(newTask.id);
		expect(checkTask).toBeNull();
	});
});
