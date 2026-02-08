import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [photoRes, albumRes] = await Promise.all([
    (async () => {
      let query = supabase.from("photos").select("id,title,visibility").ilike("title", `%${q}%`).limit(20);
      if (!user) {
        query = query.eq("visibility", "PUBLIC");
      }
      const { data } = await query;
      return data ?? [];
    })(),
    (async () => {
      let query = supabase.from("albums").select("id,title,visibility").ilike("title", `%${q}%`).limit(20);
      if (!user) {
        query = query.eq("visibility", "PUBLIC");
      }
      const { data } = await query;
      return data ?? [];
    })(),
  ]);

  const results = [
    ...photoRes.map((row) => ({ ...row, type: "photo" as const })),
    ...albumRes.map((row) => ({ ...row, type: "album" as const })),
  ];

  return NextResponse.json({ results });
}
