import { S3Client } from "@aws-sdk/client-s3";
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
