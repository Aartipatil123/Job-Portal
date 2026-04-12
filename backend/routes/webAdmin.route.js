import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAllUsers, getAllRecruiters, toggleRecruiterStatus, toggleUserStatus} from '../controllers/webadmin.controller.js';
const router = express.Router();
router.route('/allUsers').get(isAuthenticated,getAllUsers);
router.route('/allRecruiters').get(isAuthenticated,getAllRecruiters);
router.route('/toggleRecruiterStatus/:recruiterId').put(isAuthenticated, toggleRecruiterStatus);
router.route('/toggleUserStatus/:userId').put(isAuthenticated, toggleUserStatus);
export default router;