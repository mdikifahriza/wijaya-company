import { randomUUID } from "node:crypto";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { r2BucketName, r2Client } from "@/lib/r2";
import { resolveMediaUrl, normalizeStoredMediaValue } from "@/lib/media-url";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/x-icon", "ico"],
  ["image/vnd.microsoft.icon", "ico"]
]);

const mediaFolders = [
  "biography",
  "favicon",
  "hero",
  "logo",
  "og-image",
  "portfolio",
  "proof",
  "service",
  "uploads",
] as const;

type MediaFolder = (typeof mediaFolders)[number];

function sanitizeStorageSegment(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function resolveMediaFolder(folder: string): MediaFolder {
  if (mediaFolders.includes(folder as MediaFolder)) {
    return folder as MediaFolder;
  }

  throw new Error("Folder media tidak valid.");
}

function buildMediaKey(file: File, folder: MediaFolder, extension: string) {
  const filename = file.name.replace(/\.[^.]+$/, "");
  const safeName = sanitizeStorageSegment(filename) || folder;

  return `${folder}/${safeName}-${randomUUID()}.${extension}`;
}

export async function deleteImageFileFromR2(url: string | null | undefined) {
  if (!url) return;

  try {
    const normalizedUrl = normalizeStoredMediaValue(url) ?? "";
    let keyToDelete = normalizedUrl;
    
    // Extract key from URL if it's a full URL or API URL
    if (normalizedUrl.startsWith("/api/")) {
      keyToDelete = normalizedUrl.slice("/api/".length);
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
       const urlObj = new URL(url);
       const bucketPrefix = `/${r2BucketName}/`;
       if (urlObj.pathname.startsWith(bucketPrefix)) {
          keyToDelete = urlObj.pathname.slice(bucketPrefix.length);
       }
    }

    if (!keyToDelete) return;

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: r2BucketName,
        Key: keyToDelete,
      })
    );
    console.log(`Successfully deleted ${keyToDelete} from R2`);
  } catch (error) {
    console.error("Failed to delete old image from R2:", error);
  }
}

export async function uploadImageFileToR2(file: File, folder: string) {
  if (!file.size) {
    throw new Error("File gambar kosong.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Ukuran gambar maksimal 5MB.");
  }

  const extension = allowedMimeTypes.get(file.type);

  if (!extension) {
    throw new Error("Format gambar harus JPG, PNG, WEBP, GIF, atau ICO.");
  }

  const mediaFolder = resolveMediaFolder(folder);
  const key = buildMediaKey(file, mediaFolder, extension);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await r2Client.send(
    new PutObjectCommand({
      Bucket: r2BucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: resolveMediaUrl(key),
  };
}
