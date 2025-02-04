import app, { connectDB } from './app.js';

const port = process.env.PORT;
const host = process.env.HOST;

const startServer = async () => {
	await connectDB();
	app.listen(port, () => {
		console.log(`Server running: http://${host}:${port}`);
	});
};

startServer();
