import express,{ Express,NextFunction,Request,Response } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
import path from "path";

// Routes
import userRoute from "../routes/userRoute";

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
app.use(express.json());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(cookieParser());
    app.options("*", cors());
    
app.use('/',userRoute)
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  
    res.json({'vavaaa':100})
  });
 

export default app