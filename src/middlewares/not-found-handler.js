import { HttpError } from '../models/http-error.js';

export const notFoundHandler = (req, res, next) => {
	const error = new HttpError('Route not found!', 404);
	throw error;
};
