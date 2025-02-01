import express from 'express';
import dotenv from 'dotenv';

import { routes } from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;


app.use(express.json());

app.use('/', routes)

app.listen(port, () => {
	console.log(
		`server running : http://${host}:${port}`
	);
});
