import express from "express";
import { userController, postController, bookingController, messageController  } from "./injection"; 
import { protect } from "../../middlewares/userAuth";
import upload from "../../utils/Multer";

// Initialize router
const router = express.Router();

// User routes
router.post("/signup", (req, res) => userController.signup(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.post("/resendOtp", (req, res) => userController.resendOtp(req, res));
router.post("/verifyotp", (req, res) => userController.verifyotp(req, res));
router.post('/forgotpassword', (req, res) => userController.resetPass1(req, res));
router.post('/verifyotp2', (req, res) => userController.resetPass2(req, res));
router.post('/setpassword', (req, res) => userController.setnewpass(req, res));
router.get('/forgotresendOtp', (req, res) => userController.resendOtp2(req, res));
router.post("/logout", protect, (req, res) => userController.logout(req, res));
router.put('/clientprofile', protect, upload.single('image'), (req, res) => userController.updateUser(req, res));
router.post('/allpost', protect, (req, res) => userController.getAllPosts(req, res));
router.post('/singleposts/:id', protect, (req, res) => userController.singleUserPost(req, res));
router.get('/logout', protect, (req, res) => userController.logout(req, res));

// Post routes
router.post('/createpost', protect, upload.single('image'), (req, res) => postController.createPost(req, res));
router.delete('/deletepost', protect, (req, res) => postController.deletePost(req, res));

// Booking routes
router.post('/checkavailability', protect, (req, res) => bookingController.checkAvailability(req, res));
router.post('/makeBookingreq', protect, (req, res) => bookingController.makeBookingreq(req, res));
router.post('/bookingsreq', protect, (req, res) => bookingController.getBookingsreq(req, res));
router.post('/bookingsConfirmed', protect, (req, res) => bookingController.getBookingsConfirm(req, res));
router.post('/marked', protect, (req, res) => bookingController.getMarked(req, res));
router.get('/bookings/:artistId/:clientId', (req, res) => bookingController.getSingleBooking(req, res));
router.post('/cancel-booking', protect, (req, res) => bookingController.cancelBooking(req, res));
router.put('/update-booking', protect, (req, res) => bookingController.updateBooking(req, res));
router.delete('/cancelPaymentReq', protect, (req, res) => bookingController.cancelPaymentReq(req, res));

// Stripe routes
router.post('/create-checkout-session', protect, (req, res) => bookingController.createCheckoutSession(req, res));


// Messaging routes
router.post('/sendMessage', protect, (req, res) => messageController.sendMessage(req, res));
router.post('/getMessages', protect, (req, res) => messageController.getMessages(req, res));

export default router;
