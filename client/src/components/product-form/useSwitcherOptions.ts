"use client";
import { useEffect, useState } from "react";
import type { SwitcherOptionsDTO } from "@/lib/api/switcherOptions";
import { fetchSwitcherOptions } from "@/lib/api/switcherOptions";


export function useSwitcherOptions() {
  const [data, setData] = useState<SwitcherOptionsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const d = await fetchSwitcherOptions();
        if (alive) setData(d);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to fetch");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { data, loading, err, setData };
}
