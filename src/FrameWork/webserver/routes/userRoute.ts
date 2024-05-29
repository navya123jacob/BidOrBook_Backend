import userController from "../../../adapter/userController";
import Userusecase from "../../../use_case/userUsecases";
import Encrypt from "../../passwordRepository/hashpassword";
import express  from "express";
import userRepository from "../../repository/userRepository";
import jwtPassword from "../../passwordRepository/jwtpassword";
import nodemailerUtils from "../../utils/sendMail";
import GenerateOTP from "../../utils/generateOtp";
import upload from "../../utils/Multer";
import asyncHandler from 'express-async-handler';
import { PostController } from "../../../adapter/postController";
import { protect } from "../../middlewares/userAuth";
import { BookingController } from "../../../adapter/bookingController";
import { BookingUseCase } from "../../../use_case/BookingUseCase";
import { BookingRepository } from "../../repository/BookingRepository";
const encrypt = new Encrypt();
const JWTPassword = new jwtPassword();
const sendMail = new nodemailerUtils();

const generateOtp= new GenerateOTP()

const repository = new userRepository(encrypt); // Pass encrypt to the userRepository constructor
const bookingRepository = new BookingRepository();

const useCase=new Userusecase(encrypt,repository,JWTPassword)

const bookingUseCase = new BookingUseCase(bookingRepository);

const controller = new userController(useCase, sendMail, generateOtp)
const pController=new PostController()
const bController=new BookingController(bookingUseCase,useCase)

const router=express.Router();

//user
router.post("/signup", (req, res) => controller.signup(req, res));
router.post("/login", (req, res) => controller.login(req, res));
router.post("/resendOtp", (req, res) => controller.resendOtp(req, res));
router.post("/verifyotp", (req, res) => controller.verifyotp(req, res));
router.post('/forgotpassword',(req, res) => controller.resetPass1(req,res));
router.post('/verifyotp2',(req, res) => controller.resetPass2(req,res));
router.post('/setpassword',(req, res) => controller.setnewpass(req,res));
router.get('/forgotresendOtp',(req, res) => controller.resendOtp2(req,res));
router.post("/logout",protect, (req, res) => controller.logout(req, res));
router.put('/clientprofile',protect, upload.single('image'),(req, res) => controller.updateUser(req, res));
router.post('/allpost',protect, (req, res) => controller.getAllPosts(req,res));
router.post('/singleposts/:id',protect, (req, res) => controller.singleUserPost(req,res));
router.get('/logout',protect,(req, res) => controller.logout(req,res));


//post
router.post('/createpost',protect, upload.single('image'),(req, res) => pController.createPost(req,res));
router.delete('/deletepost',protect,(req, res) => pController.deletePost(req,res));

//booking
router.post('/checkavailability',protect,(req, res) => bController.checkAvailability(req,res));
router.post('/makeBookingreq',protect,(req, res) => bController.makeBookingreq(req,res));
router.post('/bookingsreq', protect,(req, res) => bController.getBookingsreq(req, res));
router.post('/bookingsConfirmed', protect,(req, res) => bController.getBookingsConfirm(req, res));
router.post('/marked', protect,(req, res) => bController.getMarked(req, res));



export default router

