export const calculatePriority = (isCritical, dueDate) => {
	if (isCritical) {
		return 'highest';
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
