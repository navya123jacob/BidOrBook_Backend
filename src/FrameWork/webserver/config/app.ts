import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from "path";
import userRoute from "../routes/userRoute";
import adminRoute from "../routes/adminRoute"
import { bookingController } from "../routes/injection";
import '../../utils/updateAuctionStatus'

const app: Express = express();
let local=process.env.local as string
let frontend=process.env.frontend as string
console.log('Local:', process.env.local);
console.log('Frontend:', process.env.frontend);

app.use(cookieParser());
app.use(cors({
    origin: [local,frontend],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 204
}));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    
    bookingController.handleWebhook(req, res);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', userRoute);
app.use('/admin', adminRoute);

// Fallback route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ 'error': 'Not Found' });
});

export default app;
