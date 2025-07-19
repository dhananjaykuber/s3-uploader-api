import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController';

const router = Router();

router.post('/upload', uploadFile);

export default router;
