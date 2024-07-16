import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import 'dotenv/config';
import { getTweets, handleCallback } from './twitter/api';
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	session({
		secret: "qwertyhxaq34578nbvcsw34578",
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
	})
)

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.get('/', getTweets);
app.get('/callback', handleCallback);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
