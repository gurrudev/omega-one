import express, {
    Application,
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from "express";
import { Server } from "http";
const app: Application = express();
import createHttpError from "http-errors";
import router from "./router/routes";

app.use("/", router);

const PORT: string = process.env.PORT || "3000";

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new createHttpError.NotFound());
});

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
        message: err.message || "Internal Server Error",
    });
};

app.use(errorHandler);

const server: Server = app.listen(PORT, () => {
    console.log(`Server is live on port: ${PORT} 🚀`);
});
