const priorityOrder = { high: 1, medium: 2, low: 3, completed: 4 };

export const calculatePriority = (isCritical, dueDate) => {
	if (isCritical) {
		return 'high';
	}

	const today = new Date();
	const due = new Date(dueDate);
	const timeDifference = due - today;
	const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

	if (daysDifference <= 3) {
		return 'high';
	} else if (daysDifference <= 7) {
		return 'medium';
	} else {
		return 'low';
	}
};

const compareTasks = (a, b, sortBy) => {
	const isMissingDateA = a.dueDate === undefined || a.dueDate === null;
	const isMissingDateB = b.dueDate === undefined || b.dueDate === null;
	const dateA = isMissingDateA ? null : new Date(a.dueDate);
	const dateB = isMissingDateB ? null : new Date(b.dueDate);
	let comparisonReturn;

	if (isMissingDateA && !isMissingDateB) {
		comparisonReturn = 1;
	} else if (!isMissingDateA && isMissingDateB) {
		comparisonReturn = -1;
	} else if (!isMissingDateA && !isMissingDateB) {
		comparisonReturn = dateA - dateB;
	}

	if (sortBy === 'priority') {
		const priorityA =
			a.isCompleted || a.priority === undefined || a.priority === null
				? 'completed'
				: a.priority;
		const priorityB =
			b.isCompleted || b.priority === undefined || b.priority === null
				? 'completed'
				: b.priority;

		if (priorityOrder[priorityA] !== priorityOrder[priorityB]) {
			return priorityOrder[priorityA] - priorityOrder[priorityB];
		}

		return comparisonReturn;
	}

	if (sortBy === 'dueDate') {
		return comparisonReturn;
	}

	return 0;
};

const merge = (left, right, sortBy) => {
	let result = [];
	let i = 0,
		j = 0;

	while (i < left.length && j < right.length) {
		if (compareTasks(left[i], right[j], sortBy) <= 0) {
			result.push(left[i]);
			i++;
		} else {
			result.push(right[j]);
			j++;
		}
	}

	return result.concat(left.slice(i)).concat(right.slice(j));
};

export const mergeSort = (tasks, sortBy) => {
	if (tasks.length <= 1) return tasks;

	const mid = Math.floor(tasks.length / 2);
	const left = mergeSort(tasks.slice(0, mid), sortBy);
	const right = mergeSort(tasks.slice(mid), sortBy);

	return merge(left, right, sortBy);
};
