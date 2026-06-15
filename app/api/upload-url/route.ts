import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "videos";

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  const { filename } = await request.json();
  const ext = (filename as string).split(".").pop() ?? "mp4";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }

  // Create a presigned URL — client uploads directly to Supabase (no Vercel size limit)
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl: urlData.publicUrl,
  });
}
