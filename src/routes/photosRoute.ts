// External dependencies
import express from 'express';
import { uploadMiddleware } from '../middleware/uploadMiddleware';
import {
    batchCheckPhotos,
    checkPhotoExists,
    getPhotos,
    getPhotosByDate,
    uploadPhoto,
} from '../controllers/photoController';

const router = express.Router();

router.post('/upload', uploadMiddleware, uploadPhoto);

router.get('/', getPhotos);

router.get('/check/:checksum', checkPhotoExists);

router.post('/batch-check', batchCheckPhotos);

router.get('/by-date', getPhotosByDate);

router.delete('/:photoId', () => {});

export default router;
