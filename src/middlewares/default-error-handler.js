export const defaultErrorHandler = (error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({ message: error.message || 'Unknown error occurred'});
};