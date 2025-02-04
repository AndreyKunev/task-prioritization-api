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

describe('🔹 Task API Sorting and Filtering', () => {
    beforeEach(async () => {
        await Task.deleteMany();

        await Task.insertMany([
            {
                title: 'Task A',
                description: 'First task',
                dueDate: '2025-02-20',
                isCompleted: false,
                priority: 'high',
            },
            {
                title: 'Task B',
                description: 'Second task',
                dueDate: '2025-02-10',
                isCompleted: true,
                priority: 'medium',
            },
            {
                title: 'Task C',
                description: 'Third task',
                dueDate: '2025-02-15',
                isCompleted: false,
                priority: 'low',
            },
            {
                title: 'Task D',
                description: 'Fourth task',
                dueDate: null, 
                isCompleted: false,
                priority: 'high',
            },
        ]);
    });

    test('Sort tasks by dueDate', async () => {
        const response = await request(app).get('/tasks?sort=dueDate');
        expect(response.status).toBe(200);
        
        const taskIds = response.body.tasks.map(t => t.title);
        expect(taskIds).toEqual(['Task B', 'Task C', 'Task A', 'Task D']); 
    });

    test('Sort tasks by priority', async () => {
        const response = await request(app).get('/tasks?sort=priority');
        expect(response.status).toBe(200);

        const taskIds = response.body.tasks.map(t => t.title);
        expect(taskIds).toEqual(['Task A', 'Task D', 'Task C', 'Task B']); 
    });

    test('Filter tasks by completion status (isCompleted=false)', async () => {
        const response = await request(app).get('/tasks?filter=isCompleted&value=false');
        expect(response.status).toBe(200);
        expect(response.body.tasks.length).toBe(3); 

        const taskIds = response.body.tasks.map(t => t.title);
        expect(taskIds).toEqual(['Task A', 'Task C', 'Task D']);
    });

    test('Filter tasks by priority (priority=high)', async () => {
        const response = await request(app).get('/tasks?filter=priority&value=high');
        expect(response.status).toBe(200);
        expect(response.body.tasks.length).toBe(2);

        const taskIds = response.body.tasks.map(t => t.title);
        expect(taskIds).toEqual(['Task A', 'Task D']);
    });

    test('Filter tasks by completion status and sort by dueDate', async () => {
        const response = await request(app).get('/tasks?filter=isCompleted&value=false&sort=dueDate');
        expect(response.status).toBe(200);
        
        const taskIds = response.body.tasks.map(t => t.title);
        expect(taskIds).toEqual(['Task C', 'Task A', 'Task D']); 
    });

    test('Filter tasks by priority and sort by dueDate', async () => {
        const response = await request(app).get('/tasks?filter=priority&value=high&sort=dueDate');
        expect(response.status).toBe(200);
        
        const taskIds = response.body.tasks.map(t => t.title);
        expect(taskIds).toEqual(['Task A', 'Task D']);
    });
});
