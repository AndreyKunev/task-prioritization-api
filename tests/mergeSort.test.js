import { mergeSort } from '../src/utils/taskUtils.js';

const priorityOrder = {
	high: 1,
	medium: 2,
	low: 3,
	completed: 4,
};

describe('mergeSort function', () => {
	test('Sorts tasks by priority first, then by due date when sorting by priority', () => {
		const tasks = [
			{
				title: 'Task 1',
				priority: 'medium',
				dueDate: '2025-02-15',
				isCompleted: false,
			},
			{
				title: 'Task 2',
				priority: 'high',
				dueDate: '2025-02-10',
				isCompleted: false,
			},
			{
				title: 'Task 3',
				priority: 'low',
				dueDate: '2025-02-20',
				isCompleted: false,
			},
			{
				title: 'Task 4',
				priority: 'high',
				dueDate: '2025-02-05',
				isCompleted: false,
			},
			{
				title: 'Task 5',
				priority: 'medium',
				dueDate: '2025-02-12',
				isCompleted: false,
			},
		];

		const sortedTasks = mergeSort(tasks, 'priority');

		expect(sortedTasks.map((task) => task.title)).toEqual([
			'Task 4',
			'Task 2',
			'Task 5',
			'Task 1',
			'Task 3',
		]);
	});

	test('Sorts tasks by due date when sorting by dueDate', () => {
		const tasks = [
			{ title: 'Task A', dueDate: '2025-02-15' },
			{ title: 'Task B', dueDate: '2025-02-10' },
			{ title: 'Task C', dueDate: '2025-02-20' },
			{ title: 'Task D', dueDate: '2025-02-05' },
			{ title: 'Task E', dueDate: '2025-02-12' },
		];

		const sortedTasks = mergeSort(tasks, 'dueDate');

		expect(sortedTasks.map((task) => task.title)).toEqual([
			'Task D',
			'Task B',
			'Task E',
			'Task A',
			'Task C',
		]);
	});

	test('Places completed tasks at the end when sorting by priority', () => {
		const tasks = [
			{
				title: 'Task A',
				priority: 'medium',
				dueDate: '2025-02-10',
				isCompleted: false,
			},
			{
				title: 'Task B',
				priority: 'high',
				dueDate: '2025-02-05',
				isCompleted: false,
			},
			{
				title: 'Task C',
				priority: 'low',
				dueDate: '2025-02-20',
				isCompleted: false,
			},
			{
				title: 'Task D',
				priority: 'high',
				dueDate: '2025-02-07',
				isCompleted: false,
			},
			{
				title: 'Task E',
				priority: 'medium',
				dueDate: '2025-02-12',
				isCompleted: true,
			},
		];

		const sortedTasks = mergeSort(tasks, 'priority');

		expect(sortedTasks.map((task) => task.title)).toEqual([
			'Task B',
			'Task D',
			'Task A',
			'Task C',
			'Task E',
		]);
	});

	test('Handles empty array', () => {
		expect(mergeSort([], 'priority')).toEqual([]);
		expect(mergeSort([], 'dueDate')).toEqual([]);
	});

	test('Handles single task array', () => {
		const singleTask = [
			{
				title: 'Only Task',
				priority: 'high',
				dueDate: '2025-02-10',
				isCompleted: false,
			},
		];
		expect(mergeSort(singleTask, 'priority')).toEqual(singleTask);
		expect(mergeSort(singleTask, 'dueDate')).toEqual(singleTask);
	});

	test('Stable sorting for tasks with identical priority and due date', () => {
		const tasks = [
			{ id: 1, priority: 'medium', dueDate: '2025-02-10' },
			{ id: 2, priority: 'medium', dueDate: '2025-02-10' },
			{ id: 3, priority: 'medium', dueDate: '2025-02-10' },
		];

		const sortedTasks = mergeSort(tasks, 'priority');

		expect(sortedTasks).toEqual(tasks);
	});

	test('Handles tasks with missing or undefined priority values', () => {
		const tasks = [
			{ id: 1, priority: 'high', dueDate: '2025-02-15' },
			{ id: 2, priority: undefined, dueDate: '2025-02-12' },
			{ id: 3, priority: 'low', dueDate: '2025-02-10' },
			{ id: 4, priority: null, dueDate: '2025-02-11' },
		];

		const sortedTasks = mergeSort(tasks, 'priority');

		expect(sortedTasks.map((t) => t.id)).toEqual([1, 3, 4, 2]);
	});

	test('Handles tasks with missing or undefined due date values', () => {
		const tasks = [
			{ id: 1, dueDate: '2025-02-15' },
			{ id: 2, dueDate: undefined },
			{ id: 3, dueDate: '2025-02-10' },
			{ id: 4, dueDate: null },
		];

		const sortedTasks = mergeSort(tasks, 'dueDate');

		expect(sortedTasks[0].id).toBe(3);
		expect(sortedTasks[1].id).toBe(1);

		const lastTwoIds = sortedTasks.slice(-2).map((t) => t.id);
		expect(new Set(lastTwoIds)).toEqual(new Set([4, 2])); // order doesn't matter here
	});
});
