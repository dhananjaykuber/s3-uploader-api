// External dependencies
import { Request } from 'express';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },

    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        cb(null, true);
    },
});

export const uploadMiddleware = upload.single('media');
