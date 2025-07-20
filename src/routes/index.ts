import express from 'express';
import authRoutes from './authRoute';
import photoRoutes from './photosRoute';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/photos', authenticateToken, photoRoutes);

router.get('/health', () => {});

export default router;
