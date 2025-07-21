// External dependencies
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export class S3Service {
    /**
     * Upload a photo to S3
     *
     * @param mediaId The ID of the media
     * @param buffer The photo buffer
     * @param filename The original filename
     * @param mimeType The MIME type of the photo
     * @returns The S3 key and URL of the uploaded photo
     */
    async uploadPhoto(
        mediaId: string,
        buffer: Buffer,
        filename: string,
        mimeType: string
    ): Promise<{ s3Key: string; s3Url: string }> {
        // Create the S3 object
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: mediaId,
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
        const s3Url = `https://${process.env.AWS_S3_BUCKET!}.s3.${
            process.env.AWS_REGION
        }.amazonaws.com/${mediaId}`;

        return {
            s3Key: mediaId,
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
    async getSignedDownloadUrl(
        s3Key: string,
        expiresIn: number = 3600
    ): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: s3Key,
        });

        return await getSignedUrl(s3Client, command, { expiresIn });
    }
}
