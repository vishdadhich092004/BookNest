import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BookType } from "../shared/types";
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

// Reusable function to get signed URLs for a book
export async function getSignedUrlsForBook(book: BookType) {
  const [pdfUrl, coverPageUrl] = await Promise.all([
    generateSignedUrl(book.pdfUrl),
    generateSignedUrl(book.coverPageUrl),
  ]);
  return { pdfUrl, coverPageUrl };
}
