import express from 'express';
import cors from 'cors';
import router from './router/routes.js';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { createStream } from 'rotating-file-stream';
import { engine } from 'express-handlebars';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.engine('html', engine({ extname: '.html' }));
app.use(express.static('public'));
app.set('view engine', 'html');
const __dirname = path.dirname(new URL(import.meta.url).pathname).substring(1);
app.set('views', path.join(__dirname, 'views'));


// create a rotating write stream
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = createStream('access.log', {
    interval: '5d', // rotate daily
    path: logDirectory,
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
// Routes
app.use('/api', router);

app.get('/', (req, res) => {
    res.status(200).render('index.html');
});
// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ message: 'Page not found' });
});
// Handle other errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
