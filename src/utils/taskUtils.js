

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

const compareTasks = (a, b) => {

    const priorityA = a.isCompleted ? 'completed' : a.priority;
    const priorityB = b.isCompleted ? 'completed' : b.priority;

    if (priorityOrder[priorityA] !== priorityOrder[priorityB]) {
        return priorityOrder[priorityA] - priorityOrder[priorityB];
    }

    return new Date(a.dueDate) - new Date(b.dueDate);
};

const merge = (left, right) => {
    let result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (compareTasks(left[i], right[j]) <= 0) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
};

export const mergeSort = (tasks) => {
    if (tasks.length <= 1) return tasks;

    const mid = Math.floor(tasks.length / 2);
    const left = mergeSort(tasks.slice(0, mid));
    const right = mergeSort(tasks.slice(mid));

    return merge(left, right);
};
