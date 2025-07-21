// External dependencies
import { Response } from 'express';

// Internal dependencies
import { Media } from '../models/mediaModel';
import { S3Service } from '../services/s3Service';
import { AuthRequest } from '../types';

const s3Service = new S3Service();

/**
 * Upload a media to S3 and save its metadata to the database.
 *
 * @param req Express request object
 * @param res Express response object
 */
export const uploadMedia = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Get file metadata and id from request body
        const { buffer, originalname, mimetype, size } = req.file;
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Media ID is required' });
        }

        // Check if media already exists
        const existingMedia = await Media.findOne({ mediaId: id });
        if (existingMedia) {
            return res.status(409).json({
                error: 'Media already exists',
                existingMedia: existingMedia.toObject(),
            });
        }

        // Upload media to S3
        const { s3Key, s3Url } = await s3Service.uploadPhoto(
            id,
            buffer,
            originalname,
            mimetype
        );

        // Create media document
        const media = new Media({
            mediaId: id,
            filename: originalname,
            s3Key,
            s3Url,
            fileSize: size,
            mimeType: mimetype,
            createdAt: new Date(),
        });

        await media.save();

        res.status(201).json({
            success: true,
            media: media.toObject(),
            message: 'Media uploaded successfully',
        });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
