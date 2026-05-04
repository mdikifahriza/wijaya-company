import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { deleteImageFileFromR2, uploadImageFileToR2 } from "@/lib/media";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const oldUrl = String(formData.get("oldUrl") ?? "").trim();

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "File gambar wajib diisi." }, { status: 400 });
    }

    const upload = await uploadImageFileToR2(file, "portfolio");

    if (oldUrl) {
      await deleteImageFileFromR2(oldUrl);
    }

    return NextResponse.json({
      url: upload.url,
      key: upload.key,
    });
  } catch (error) {
    console.error("Failed to upload portfolio image", error);

    return NextResponse.json(
      { error: "Gagal menyimpan gambar portfolio." },
      { status: 500 },
    );
  }
}
