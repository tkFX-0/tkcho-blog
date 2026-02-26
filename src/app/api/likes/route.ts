import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug || !supabase) {
    return NextResponse.json({ count: 0 });
  }

  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("slug", slug);

  return NextResponse.json({ count: count || 0 });
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const { slug } = await request.json();
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  const fingerprint = `${ip}:${ua}`.slice(0, 255);

  const { error } = await supabase
    .from("likes")
    .insert({ slug, fingerprint });

  if (error) {
    return NextResponse.json({ error: "already liked" }, { status: 409 });
  }

  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("slug", slug);

  return NextResponse.json({ count: count || 0 });
}
