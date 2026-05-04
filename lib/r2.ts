import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const accessKeyId =
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey =
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ??
  process.env.AWS_SECRET_ACCESS_KEY;

if (!accountId) {
  throw new Error("CLOUDFLARE_ACCOUNT_ID is not set");
}

if (!endpoint) {
  throw new Error("CLOUDFLARE_R2_ENDPOINT is not set");
}

if (!bucketName) {
  throw new Error("CLOUDFLARE_R2_BUCKET_NAME is not set");
}

if (!accessKeyId || !secretAccessKey) {
  throw new Error("Cloudflare R2 credentials are not set");
}

export const r2BucketName = bucketName;
export const r2AccountId = accountId;
export const r2Endpoint = endpoint;

export const r2Client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function getR2SignedUrl(
  command: Parameters<typeof getSignedUrl>[1],
  expiresIn = 3600,
) {
  return getSignedUrl(r2Client, command, { expiresIn });
}

export function getR2ObjectUrl(key: string) {
  return `${r2Endpoint}/${r2BucketName}/${key}`;
}
