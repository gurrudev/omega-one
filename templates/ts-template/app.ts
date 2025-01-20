import express, {
    Application,
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from 'express';
import createHttpError from 'http-errors';
import cors from 'cors';
import morgan from 'morgan';
import router from './router/routes';
import fs from 'fs';
import path from 'path';
import { createStream } from 'rotating-file-stream';
import { engine } from 'express-handlebars';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.engine('html', engine({ extname: '.html' }));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = createStream('access.log', {
    interval: '7d', // rotate weekly
    path: logDirectory,
});

app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req: Request, res: Response) => {
    res.render('index');
});

app.use('/api', router);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new createHttpError.NotFound());
});

const errorHandler: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(err.status || 500);
    res.json({
        message: err.message || 'Internal Server Error',
    });
};

app.use(errorHandler);

export default app;
