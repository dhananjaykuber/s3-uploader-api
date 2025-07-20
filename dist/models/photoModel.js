"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Photo = void 0;
// External dependencies
const mongoose_1 = __importDefault(require("mongoose"));
const PhotoSchema = new mongoose_1.default.Schema({
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
exports.Photo = mongoose_1.default.model('Photo', PhotoSchema);
