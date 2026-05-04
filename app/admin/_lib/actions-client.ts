"use server";

import { uploadImageFileToR2, deleteImageFileFromR2 } from "@/lib/media";

export async function uploadMediaClient(
  file: File,
  folder = "uploads",
  oldUrl?: string | null,
) {
  const result = await uploadImageFileToR2(file, folder);
  
  if (oldUrl) {
    await deleteImageFileFromR2(oldUrl);
  }
  
  return result.url;
}
