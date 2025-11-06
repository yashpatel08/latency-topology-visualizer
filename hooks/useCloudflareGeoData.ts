"use client";
import { useEffect, useState } from "react";

export function useCloudflareGeoData() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/geo");
        const json = await res.json();
        setData(json.regions || []);
      } catch (err) {
        console.error("Failed to fetch Cloudflare data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, loading };
}
