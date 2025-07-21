// External dependencies
import express from 'express';

// Internal dependencies
import { uploadMiddleware } from '../middleware/uploadMiddleware';
import { uploadMedia } from '../controllers/mediaController';

const router = express.Router();

router.post('/upload', uploadMiddleware, uploadMedia);

export default router;
