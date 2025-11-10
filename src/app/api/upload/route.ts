import ImageKit from "imagekit";
import { FileObject } from "imagekit/dist/libs/interfaces";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const id = formData.get("id") as string | null;
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!id || !folder) {
      return NextResponse.json(
        { error: "Missing required fields (id or folder)" },
        { status: 400 }
      );
    }

    // ✅ 1. Search for existing image by name in folder
    const existingFiles = (await imagekit.listFiles({
      searchQuery: `name="${id}.jpg" AND folder="${folder}"`,
      limit: 1,
    })) as FileObject[];

    // ✅ 2. If found, delete it before uploading new one
    if (existingFiles.length > 0) {
      const oldFile = existingFiles[0];
      await imagekit.deleteFile(oldFile.fileId);
      console.log(`🗑️ Deleted old file: ${oldFile.name}`);
    }

    // ✅ 3. Convert file to base64 and upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const uploadResponse = await imagekit.upload({
      file: base64,
      fileName: `${id}.jpg`,
      folder: `/${folder}`,
      useUniqueFileName: false, // overwrite if same name
    });

    return NextResponse.json({
      message: "✅ Upload successful",
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch  {
    return NextResponse.json({ error: "Upload error" }, { status: 500 });
  }
}
