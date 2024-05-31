import express from "express";
import userController from "../../../adapter/userController";
import UserUseCase from "../../../use_case/userUsecases";
import Encrypt from "../../passwordRepository/hashpassword";
import userRepository from "../../repository/userRepository";
import jwtPassword from "../../passwordRepository/jwtpassword";
import nodemailerUtils from "../../utils/sendMail";
import GenerateOTP from "../../utils/generateOtp";
import upload from "../../utils/Multer";
import { PostController } from "../../../adapter/postController";
import { protect } from "../../middlewares/userAuth";
import { BookingController } from "../../../adapter/bookingController";
import { BookingUseCase } from "../../../use_case/BookingUseCase";
import { BookingRepository } from "../../repository/BookingRepository";
import MessageController from "../../../adapter/ConvController";
import MessageUseCase from "../../../use_case/ConvUseCase";
import MessageRepository from "../../repository/ConvRepository";

// Initialize utilities
const encrypt = new Encrypt();
const JWTPassword = new jwtPassword();
const sendMail = new nodemailerUtils();
const generateOtp = new GenerateOTP();

// Initialize repositories
const userRepo = new userRepository(encrypt);
const bookingRepo = new BookingRepository();
const messageRepo = new MessageRepository();

// Initialize use cases
const userUseCase = new UserUseCase(encrypt, userRepo, JWTPassword);
const bookingUseCase = new BookingUseCase(bookingRepo);
const messageUseCase = new MessageUseCase(messageRepo);

// Initialize controllers
const userCtrl = new userController(userUseCase, sendMail, generateOtp);
const postCtrl = new PostController();
const bookingCtrl = new BookingController(bookingUseCase, userUseCase);
const messageCtrl = new MessageController(messageUseCase);

// Initialize router
const router = express.Router();

// User routes
router.post("/signup", (req, res) => userCtrl.signup(req, res));
router.post("/login", (req, res) => userCtrl.login(req, res));
router.post("/resendOtp", (req, res) => userCtrl.resendOtp(req, res));
router.post("/verifyotp", (req, res) => userCtrl.verifyotp(req, res));
router.post('/forgotpassword', (req, res) => userCtrl.resetPass1(req, res));
router.post('/verifyotp2', (req, res) => userCtrl.resetPass2(req, res));
router.post('/setpassword', (req, res) => userCtrl.setnewpass(req, res));
router.get('/forgotresendOtp', (req, res) => userCtrl.resendOtp2(req, res));
router.post("/logout", protect, (req, res) => userCtrl.logout(req, res));
router.put('/clientprofile', protect, upload.single('image'), (req, res) => userCtrl.updateUser(req, res));
router.post('/allpost', protect, (req, res) => userCtrl.getAllPosts(req, res));
router.post('/singleposts/:id', protect, (req, res) => userCtrl.singleUserPost(req, res));
router.get('/logout', protect, (req, res) => userCtrl.logout(req, res));

// Post routes
router.post('/createpost', protect, upload.single('image'), (req, res) => postCtrl.createPost(req, res));
router.delete('/deletepost', protect, (req, res) => postCtrl.deletePost(req, res));

// Booking routes
router.post('/checkavailability', protect, (req, res) => bookingCtrl.checkAvailability(req, res));
router.post('/makeBookingreq', protect, (req, res) => bookingCtrl.makeBookingreq(req, res));
router.post('/bookingsreq', protect, (req, res) => bookingCtrl.getBookingsreq(req, res));
router.post('/bookingsConfirmed', protect, (req, res) => bookingCtrl.getBookingsConfirm(req, res));
router.post('/marked', protect, (req, res) => bookingCtrl.getMarked(req, res));

// Messaging routes
router.post('/sendMessage', protect, (req, res) => messageCtrl.sendMessage(req, res));
router.get('/getMessages/:senderId/:receiverId', protect, (req, res) => messageCtrl.getMessages(req, res));

export default router;
