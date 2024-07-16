import express from 'express';
import cors from 'cors';
import logger from 'morgan';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.listen(PORT, () => {
	console.log(`${`Server is running on port ${PORT}`}`);
});
