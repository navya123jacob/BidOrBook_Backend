import express from 'express';
import { adminController } from './injectionAdmin';
import { protectAdmin } from '../../middlewares/adminAuth';
import upload from '../../utils/Multer';
import { auctionController, bookingController, messageController, postController } from './injection';
const router = express.Router();

router.post('/login', (req, res) => adminController.login(req, res));
router.get('/users', protectAdmin, (req, res) => adminController.getAllUsers(req, res));
router.put('/block/:userId', protectAdmin, (req, res) => adminController.blockUser(req, res));
router.put('/unblock/:userId', protectAdmin, (req, res) => adminController.unblockUser(req, res));
router.get('/logout', protectAdmin, (req, res) =>adminController.logout(req, res));
router.get('/events/:type',  (req, res) => adminController.getEvents(req, res));
router.delete('/events/:eventId', protectAdmin, (req, res) => adminController.deleteEvent(req, res));
router.post('/event', protectAdmin, (req, res) => adminController.createEvent(req, res));
router.put('/adminprofile', protectAdmin, upload.fields([{ name: 'profile' }, { name: 'bg' }]), (req, res) => adminController.updateAdmin(req, res));
router.get('/details', (req, res) => adminController.getAdminDetails(req, res)); 
router.get('/auctions/userdetails',protectAdmin,(req, res) => auctionController.getAllAuctionsWithUserDetails(req, res));
router.delete('/auctions/:id', protectAdmin, (req, res) => auctionController.deleteAuction(req, res));
router.get('/posts-with-spam',protectAdmin, (req, res) => postController.getPostsWithSpam(req, res));
router.post('/:postId/block',protectAdmin, (req, res) =>  postController.blockPost(req, res));
router.post('/:postId/unblock',protectAdmin, (req, res) =>  postController.unblockPost(req, res));
router.post('/cancel-booking', protectAdmin, (req, res) => bookingController.cancelBooking(req, res));
router.get('/Allbookings',protectAdmin, (req, res) => bookingController.getAllBookingsByArtistAndClient(req, res));
router.get('/getUserChats/:userId',protectAdmin, (req, res) => messageController.getUserChats(req, res));
router.post('/sendMessage', protectAdmin, (req, res) => messageController.sendMessage(req, res));
router.post('/getMessages', protectAdmin, (req, res) => messageController.getMessages(req, res));


export default router;
