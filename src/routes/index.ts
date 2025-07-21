// External dependencies
import express, { Request, Response } from 'express';

// Internal dependencies
import authRoutes from './authRoute';
import mediaRoutes from './mediaRoute';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/media', authenticateToken, mediaRoutes);

router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ message: 'OK' });
});

export default router;
