import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = {
  label: string;
  ok: boolean;
  httpCode: number;
  ms: number;
};

type Cache = {
  at: number;
  rows: Row[];
};

const TARGETS = [
  { label: "pumamakmurseal.com", url: "https://pumamakmurseal.com" },
  { label: "weavorystudio.com", url: "https://weavorystudio.com" },
  { label: "pajak.pumamakmurseal.com", url: "https://pajak.pumamakmurseal.com" },
];

const TTL_MS = 60_000;
const TIMEOUT_MS = 3_000;

let cache: Cache | null = null;

async function probe(url: string): Promise<Omit<Row, "label">> {
  const started = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
      headers: { "user-agent": "portfolio-status/1.0 (health check)" },
    });
    return { ok: res.status < 500, httpCode: res.status, ms: Math.round(performance.now() - started) };
  } catch {
    return { ok: false, httpCode: 0, ms: Math.round(performance.now() - started) };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return NextResponse.json({ checkedAt: cache.at, rows: cache.rows, cached: true });
  }

  const rows: Row[] = await Promise.all(
    TARGETS.map(async (t) => ({ label: t.label, ...(await probe(t.url)) })),
  );

  cache = { at: Date.now(), rows };
  return NextResponse.json({ checkedAt: cache.at, rows, cached: false });
}
