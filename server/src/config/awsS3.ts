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
