import { GetObjectCommand } from "@aws-sdk/client-s3";

import { r2BucketName, r2Client } from "@/lib/r2";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/media/[...key]">,
) {
  const { key } = await context.params;
  const objectKey = key.join("/");

  try {
    const result = await r2Client.send(
      new GetObjectCommand({
        Bucket: r2BucketName,
        Key: objectKey,
      }),
    );

    if (!result.Body) {
      return new Response("Not Found", { status: 404 });
    }

    return new Response(result.Body as ReadableStream, {
      headers: {
        "Content-Type": result.ContentType ?? "application/octet-stream",
        "Cache-Control": result.CacheControl ?? "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to read media from R2", error);
    return new Response("Not Found", { status: 404 });
  }
}
