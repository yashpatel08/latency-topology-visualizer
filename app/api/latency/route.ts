import { NextResponse } from "next/server";

const CLOUDFLARE_IQI_API =
  "https://api.cloudflare.com/client/v4/radar/quality/iqi/timeseries_groups?metric=LATENCY&aggInterval=1h&dateRange=1d&format=JSON";

export async function GET() {
  try {
    const res = await fetch(CLOUDFLARE_IQI_API, {
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Cloudflare API error:", res.statusText);
      return NextResponse.json(
        { error: "Failed to fetch Cloudflare latency data" },
        { status: res.status }
      );
    }

    const json = await res.json();

    // Extract latency data from serie_0
    const serie = json?.result?.serie_0;
    if (!serie || !serie.timestamps) {
      return NextResponse.json({ latency: [] });
    }

    const transformed = serie.timestamps.map((t: string, i: number) => ({
      timestamp: t,
      p25: parseFloat(serie.p25?.[i] ?? 0),
      p50: parseFloat(serie.p50?.[i] ?? 0),
      p75: parseFloat(serie.p75?.[i] ?? 0),
    }));

    return NextResponse.json({ latency: transformed.slice(-20) });
  } catch (error) {
    console.error("Latency fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch latency data" },
      { status: 500 }
    );
  }
}
