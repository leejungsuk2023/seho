import { NextResponse } from "next/server"

import { getBlogsWithStats } from "@/lib/blogs"

export async function GET() {
  const blogs = await getBlogsWithStats()
  return NextResponse.json({
    data: blogs,
  })
}
