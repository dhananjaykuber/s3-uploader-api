// External dependencies
import mongoose from 'mongoose';

export interface IPhoto {
    _id?: string;
    localId: string;
    filename: string;
    s3Key: string;
    s3Url: string;
    fileSize: number;
    mimeType: string;
    createdAt: Date;
    uploadedAt: Date;
    checksum: string;
}

const PhotoSchema = new mongoose.Schema({
    localId: { type: String, required: true },
    filename: { type: String, required: true },
    s3Key: { type: String, required: true, unique: true },
    s3Url: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    createdAt: { type: Date, required: true },
    uploadedAt: { type: Date, default: Date.now },
    checksum: { type: String, required: true },
});

PhotoSchema.index({ checksum: 1 });
PhotoSchema.index({ uploadedAt: -1 });

export const Photo = mongoose.model<IPhoto>('Photo', PhotoSchema);
