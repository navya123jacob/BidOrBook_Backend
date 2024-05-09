import express,{ Express,NextFunction,Request,Response } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
// import { errorMiddleware } from "../../../useCase/middleware/errorMiddleWare";

// import morgan from 'morgan'

// Routes
import { userRoute } from "../routes/userRoute";
// import { adminRoute } from "../routes/adminRoute";
// import { doctorRoute } from "../routes/doctorRoute";
// import { conversationRoute } from "../routes/conversationRoute";
// import { messageRoute } from "../routes/messageRoute";


const app: Express = express()
const router = express.Router();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
// app.use(morgan('dev'))


//cors setup
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
    methods:['GET','POST','PUT','PATCH','DELETE'],
    optionsSuccessStatus:204    
}))
// Mount userRoute with the router instance
app.post('/signup', (req: Request, res: Response, next: NextFunction)=>{
  res.json({'navya':1})
});
// app.use('/admin',adminRoute(express.Router()))
// app.use('/doctor',doctorRoute(express.Router()))
// app.use('/conversation',conversationRoute(express.Router()))
// app.use('/message',messageRoute(express.Router()))

// unknown url
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    // const error = new Error(`route ${req.originalUrl} isn't found`) as any;
    // error.statusCode = 404;
    // next(error);
    res.json({'vavaaa':100})
  });
  // Here, Request is a type provided by the Express.js framework.
  
// app.use(errorMiddleware)

export default app