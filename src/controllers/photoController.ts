// External dependencies
import { Response } from 'express';

// Internal dependencies
import { Photo } from '../models/photoModel';
import { S3Service } from '../services/s3Service';
import { AuthRequest } from '../types';

const s3Service = new S3Service();

/**
 * Upload a photo to S3 and save its metadata to the database.
 *
 * @param req Express request object
 * @param res Express response object
 */
export const uploadPhoto = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Get file metadata and localId from request body
        const { buffer, originalname, mimetype, size } = req.file;
        const { localId } = req.body;

        // Generate checksum for duplicate detection
        const checksum = s3Service.generateChecksum(buffer);

        // Check if photo already exists
        const existingPhoto = await Photo.findOne({ checksum });
        if (existingPhoto) {
            return res.status(409).json({
                error: 'Photo already exists',
                existingPhoto: existingPhoto.toObject(),
            });
        }

        // Upload photo to S3
        const { s3Key, s3Url } = await s3Service.uploadPhoto(
            buffer,
            originalname,
            mimetype
        );

        // Create photo document
        const photo = new Photo({
            localId: localId,
            filename: originalname,
            s3Key,
            s3Url,
            fileSize: size,
            mimeType: mimetype,
            createdAt: new Date(),
            checksum,
        });

        await photo.save();

        res.status(201).json({
            success: true,
            photo: photo.toObject(),
            message: 'Photo uploaded successfully',
        });
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get a list of uploaded photos with pagination.
 *
 * @param req Express request object
 * @param res Express response object
 */
export const getPhotos = async (req: AuthRequest, res: Response) => {
    try {
        // Get pagination parameters from query
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const photos = await Photo.find()
            .sort({ uploadedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalPhotos = await Photo.countDocuments();

        res.json({
            photos,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalPhotos / limit),
                totalCount: totalPhotos,
                hasNextPage: skip + photos.length < totalPhotos,
            },
        });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Check if a photo with the given checksum already exists.
 *
 * @param req Express request object
 * @param res Express response object
 */
export const checkPhotoExists = async (req: AuthRequest, res: Response) => {
    try {
        const { checksum } = req.params;

        const existingPhoto = await Photo.findOne({ checksum }).lean();

        res.json({
            exists: !!existingPhoto,
            photo: existingPhoto || null,
        });
    } catch (error) {
        console.error('Error checking photo existence:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Batch check if photos with the given checksums already exist.
 *
 * @param req Express request object
 * @param res Express response object
 */
export const batchCheckPhotos = async (req: AuthRequest, res: Response) => {
    try {
        const { checksums } = req.body;

        // Validate checksums input
        if (!Array.isArray(checksums) || checksums.length === 0) {
            return res.status(400).json({ error: 'Checksum must be an array' });
        }

        const existingPhotos = await Photo.find({
            checksum: { $in: checksums },
        }).lean();

        // Extract existing checksums for response
        const existingChecksums = existingPhotos.map((photo) => photo.checksum);

        res.json({
            existingChecksums,
            existingPhotos,
            newChecksums: checksums.filter(
                (checksum) => !existingChecksums.includes(checksum)
            ),
        });
    } catch (error) {
        console.error('Error checking photo existence:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get photos uploaded within a specific date range.
 *
 * @param req Express request object
 * @param res Express response object
 */
export const getPhotosByDate = async (req: AuthRequest, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        // Compose query based on date range
        const query: any = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate as string);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate as string);
            }
        }

        const photos = await Photo.find(query).sort({ createdAt: -1 }).lean();

        res.json({
            photos,
        });
    } catch (error) {
        console.error('Error fetching photos by date:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
