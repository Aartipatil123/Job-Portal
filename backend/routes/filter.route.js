
import express from 'express';
const router = express.Router();
const { getFilters } = require('../controllers/filterController');
const { verifyToken } = require('../middlewares/authMiddleware');
router.get('/filters', verifyToken, getFilters);
export default router;
