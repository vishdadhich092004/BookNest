import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
const secretKey = process.env.AWS_SECRET_ACCESS_KEY!;
const accessKey = process.env.AWS_ACCESS_KEY_ID!;
const bucketRegion = process.env.AWS_BUCKET_REGION!;
const bucketName = process.env.AWS_BUCKET_NAME!;

// Create a new S3 client
export const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

export async function generateSignedUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const params = { Bucket: bucketName, Key: key };
  const command = new GetObjectCommand(params);
  return s3GetSignedUrl(s3, command, { expiresIn });
}

interface getSignedUrlsForBookProps {
  pdfUrl?: string;
  coverPageUrl?: string;
}
// Reusable function to get signed URLs for a book
export async function getSignedUrlsForBook({
  pdfUrl,
  coverPageUrl,
}: getSignedUrlsForBookProps) {
  const [signedPdfUrl, signedCoverPageUrl] = await Promise.all([
    generateSignedUrl(pdfUrl!),
    generateSignedUrl(coverPageUrl!),
  ]);
  return { signedCoverPageUrl, signedPdfUrl };
}

// Reusable function to upload file to S3
export async function uploadFileToS3(
  file: Express.Multer.File,
  prefix: string
): Promise<string> {
  const randomName = crypto.randomBytes(16).toString("hex");
  const key = `books/${prefix}/${randomName}`;
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  await s3.send(new PutObjectCommand(params));
  return key;
}

// Reusable function to delete file from S3
export async function deleteFileFromS3(key: string): Promise<void> {
  const params = { Bucket: bucketName, Key: key };
  await s3.send(new DeleteObjectCommand(params));
}
