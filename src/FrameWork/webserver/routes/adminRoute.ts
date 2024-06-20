import express from 'express';
import { adminController } from './injectionAdmin';
import { protectAdmin } from '../../middlewares/adminAuth';
import upload from '../../utils/Multer';
const router = express.Router();

router.post('/login', (req, res) => adminController.login(req, res));
router.get('/users', protectAdmin, (req, res) => adminController.getAllUsers(req, res));
router.put('/block/:userId', protectAdmin, (req, res) => adminController.blockUser(req, res));
router.put('/unblock/:userId', protectAdmin, (req, res) => adminController.unblockUser(req, res));
router.get('/logout', protectAdmin, (req, res) =>adminController.logout(req, res));
router.put('/adminprofile', protectAdmin, upload.fields([{ name: 'profile' }, { name: 'bg' }]), (req, res) => adminController.updateAdmin(req, res)); 

export default router;
