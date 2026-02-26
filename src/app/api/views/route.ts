import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug || !supabase) {
    return NextResponse.json({ count: 0 });
  }

  const { data } = await supabase
    .from("page_views")
    .select("count")
    .eq("slug", slug)
    .single();

  return NextResponse.json({ count: data?.count || 0 });
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ count: 0 });
  }

  const { slug } = await request.json();
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("page_views")
    .select("count")
    .eq("slug", slug)
    .single();

  if (existing) {
    await supabase
      .from("page_views")
      .update({ count: existing.count + 1 })
      .eq("slug", slug);
  } else {
    await supabase.from("page_views").insert({ slug, count: 1 });
  }

  const newCount = (existing?.count || 0) + 1;
  return NextResponse.json({ count: newCount });
}
