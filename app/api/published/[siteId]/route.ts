import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const publishedSitesDir = path.join(process.cwd(), "data", "published-sites");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;

  if (!/^[a-z0-9-]+$/i.test(siteId)) {
    return NextResponse.json(
      { error: "Invalid published site URL." },
      { status: 400 },
    );
  }

  try {
    const payload = await readFile(
      path.join(publishedSitesDir, `${siteId}.json`),
      "utf8",
    );

    return NextResponse.json(JSON.parse(payload));
  } catch {
    return NextResponse.json(
      { error: "Published site not found." },
      { status: 404 },
    );
  }
}
