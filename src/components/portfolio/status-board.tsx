"use client";

import { useEffect, useState } from "react";
import { liveDomains } from "@/data/portfolio";

type Row = { label: string; ok: boolean; httpCode: number; ms: number };

type Payload = { checkedAt: number; rows: Row[]; cached: boolean };

type Phase =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "done"; payload: Payload }
  | { state: "unreachable" };

// LIVE THING — papan status produksi: halaman mengecek tiga
// domain milik Ghazy lewat /api/status (server-side, timeout
// 3 dtk, cache 60 dtk). Fallback jujur bila tak terjangkau.
export function StatusBoard() {
  const [phase, setPhase] = useState<Phase>({ state: "idle" });

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    fetch("/api/status", { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<Payload>) : Promise.reject(new Error("http"))))
      .then((payload) => {
        if (alive) setPhase({ state: "done", payload });
      })
      .catch(() => {
        if (alive) setPhase({ state: "unreachable" });
      })
      .finally(() => clearTimeout(timer));

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  const checkedAt =
    phase.state === "done"
      ? new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }).format(new Date(phase.payload.checkedAt))
      : null;

  return (
    <div data-reveal className="mt-14">
      <h3 className="text-lg font-semibold">Status produksi saat ini</h3>

      <div aria-live="polite">
        {phase.state === "done" && (
          <ul className="mt-4">
            {phase.payload.rows.map((row) => {
              const domain = liveDomains.find((d) => d.label === row.label);
              return (
                <li
                  key={row.label}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-surface px-4 py-4 [&:nth-child(2)]:mt-1.5 [&:nth-child(3)]:mt-1.5"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span
                      aria-hidden="true"
                      className={`pulse-dot inline-block size-2.5 rounded-full shrink-0 ${
                        row.ok ? "bg-accent" : "bg-muted"
                      }`}
                    />
                    <a
                      href={domain?.url ?? `https://${row.label}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold underline-offset-4 hover:underline focus-visible:underline truncate"
                    >
                      {row.label}
                    </a>
                  </span>
                  <span className="text-sm text-muted">{domain?.note}</span>
                  <span className="ml-auto flex items-baseline gap-4 text-sm">
                    <span className="font-semibold">{row.ok ? "LIVE" : "GANGGUAN"}</span>
                    <span className="text-muted tabular-nums w-16 text-right">{row.ms} ms</span>
                    <span className="text-muted tabular-nums hidden sm:inline">HTTP {row.httpCode}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {phase.state === "loading" && (
          <p className="mt-4 text-sm text-muted">Memeriksa ketiga domain…</p>
        )}

        {phase.state === "unreachable" && (
          <div className="mt-4 bg-surface px-4 py-4 text-sm">
            <p className="text-muted">
              Pemeriksaan otomatis tidak terjangkau dari perangkat ini. Buka langsung untuk memastikan:
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {liveDomains.map((d) => (
                <li key={d.label}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline underline-offset-4"
                  >
                    {d.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {checkedAt && (
        <p className="mt-3 text-sm text-muted">Diperiksa pukul {checkedAt} WIB, cache 60 detik.</p>
      )}
    </div>
  );
}
