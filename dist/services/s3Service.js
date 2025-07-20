"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
// External dependencies
const crypto_1 = __importDefault(require("crypto"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
class S3Service {
    /**
     * Upload a photo to S3
     *
     * @param buffer The photo buffer
     * @param filename The original filename
     * @param mimeType The MIME type of the photo
     * @returns The S3 key and URL of the uploaded photo
     */
    async uploadPhoto(buffer, filename, mimeType) {
        // Generate a unique S3 key using the current date and a UUID
        const timestamp = new Date().toISOString().split('T')[0];
        const uuid = crypto_1.default.randomUUID();
        const s3Key = `${timestamp}/${uuid}-${filename}`;
        // Create the S3 object
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: s3Key,
            Body: buffer,
            ContentType: mimeType,
            Metadata: {
                'original-filename': filename,
                'upload-timestamp': new Date().toISOString(),
            },
        });
        // Upload the photo to S3
        await s3Client.send(command);
        // Construct the S3 URL
        const s3Url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        return {
            s3Key,
            s3Url,
        };
    }
    /**
     * Get a signed URL for downloading a photo from S3
     *
     * @param s3Key The S3 key of the photo
     * @param expiresIn The expiration time in seconds for the signed URL
     * @returns A signed URL for downloading the photo
     */
    async getSignedDownloadUrl(s3Key, expiresIn = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: s3Key,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn });
    }
    /**
     * Generate a checksum for the given buffer
     *
     * @param buffer The buffer to generate the checksum for
     * @returns The MD5 checksum of the buffer
     */
    generateChecksum(buffer) {
        return crypto_1.default.createHash('md5').update(buffer).digest('hex');
    }
}
exports.S3Service = S3Service;
