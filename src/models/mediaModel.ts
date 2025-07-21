// External dependencies
import mongoose from 'mongoose';

export interface Media {
    _id?: string;
    mediaId: string;
    filename: string;
    s3Key: string;
    s3Url: string;
    fileSize: number;
    mimeType: string;
    createdAt: Date;
    uploadedAt: Date;
}

const MediaSchema = new mongoose.Schema({
    mediaId: { type: String, required: true },
    filename: { type: String, required: true },
    s3Key: { type: String, required: true, unique: true },
    s3Url: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    createdAt: { type: Date, required: true },
    uploadedAt: { type: Date, default: Date.now },
});

MediaSchema.index({ mediaId: 1 });
MediaSchema.index({ uploadedAt: -1 });

export const Media = mongoose.model<Media>('Media', MediaSchema);
