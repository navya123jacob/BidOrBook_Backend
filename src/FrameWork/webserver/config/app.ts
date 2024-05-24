import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from "path";
import userRoute from "../routes/userRoute";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 204
}));
app.use(express.static(path.join(__dirname, '../public')));

// Mount your routes
app.use('/', userRoute);

// Fallback route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    res.json({ 'vavaaa': 100 });
});

export default app;
