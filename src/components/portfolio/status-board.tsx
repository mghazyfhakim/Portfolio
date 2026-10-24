"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { liveDomains } from "@/data/portfolio";

type Row = { label: string; ok: boolean; httpCode: number; ms: number };

type Payload = { checkedAt: number; rows: Row[]; cached: boolean };

type Phase =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "done"; payload: Payload }
  | { state: "unreachable" };

// Interval polling (ms). 60 dtk = sama dengan TTL cache server, jadi
// setiap poll baru mengambil hasil fresh, bukan cache lama.
const POLL_MS = 60_000;
const ABORT_MS = 8_000;

// LIVE THING — papan status produksi: halaman mengecek tiga
// domain milik Ghazy lewat /api/status (server-side, timeout
// 3 dtk, cache 60 dtk). Polling otomatis tiap 60 dtk selama
// section terlihat; tombol refresh manual tersedia. Fallback
// jujur bila tak terjangkau.
export function StatusBoard() {
  const [phase, setPhase] = useState<Phase>({ state: "idle" });
  const [nextIn, setNextIn] = useState<number>(POLL_MS);
  const [paused, setPaused] = useState(false);

  const aliveRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextAtRef = useRef<number>(0);

  const probe = useCallback(async () => {
    if (!aliveRef.current) return;
    setPhase((p) => (p.state === "done" ? p : { state: "loading" }));
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), ABORT_MS);
    try {
      const res = await fetch("/api/status", {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) throw new Error("http");
      const payload = (await res.json()) as Payload;
      if (!aliveRef.current) return;
      setPhase({ state: "done", payload });
    } catch {
      if (!aliveRef.current) return;
      setPhase({ state: "unreachable" });
    } finally {
      clearTimeout(timer);
    }
  }, []);

  // Jadwalkan poll berikutnya + countdown detik-per-detik.
  const scheduleNext = useCallback(() => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    nextAtRef.current = Date.now() + POLL_MS;
    setNextIn(POLL_MS);
    tickTimerRef.current = setInterval(() => {
      if (!aliveRef.current) return;
      const remain = Math.max(0, nextAtRef.current - Date.now());
      setNextIn(remain);
      if (remain <= 0 && tickTimerRef.current) {
        clearInterval(tickTimerRef.current);
        tickTimerRef.current = null;
      }
    }, 1000);
    pollTimerRef.current = setTimeout(() => {
      if (!aliveRef.current || paused) return;
      void probe();
      scheduleNext();
    }, POLL_MS);
  }, [probe, paused]);

  // Initial fetch + schedule polling.
  useEffect(() => {
    aliveRef.current = true;
    void probe();
    scheduleNext();
    return () => {
      aliveRef.current = false;
      abortRef.current?.abort();
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    };
  }, []);

  // Pause/resume polling saat tab tak terlihat (hemat bandwidth).
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
        if (tickTimerRef.current) clearInterval(tickTimerRef.current);
        setPaused(true);
      } else {
        setPaused(false);
        void probe();
        scheduleNext();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [probe, scheduleNext]);

  const refreshNow = useCallback(() => {
    void probe();
    scheduleNext();
  }, [probe, scheduleNext]);

  const checkedAt =
    phase.state === "done"
      ? new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        }).format(new Date(phase.payload.checkedAt))
      : null;

  const nextInSeconds = Math.ceil(nextIn / 1000);
  const allLive = phase.state === "done" && phase.payload.rows.every((r) => r.ok);

  return (
    <div data-reveal className="mt-14">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h3 className="text-lg font-semibold">Status produksi saat ini</h3>
        {phase.state === "done" && (
          <span
            aria-live="polite"
            className={`inline-flex items-center gap-2 text-sm ${allLive ? "text-muted" : "text-ink"}`}
          >
            <span
              aria-hidden="true"
              className={`pulse-dot inline-block size-2 rounded-full ${allLive ? "bg-accent" : "bg-muted"}`}
            />
            {allLive ? "SEMUA DOMAIN LIVE" : "ADA YANG GANGGUAN"}
            {phase.payload.cached ? " · cache" : " · fresh"}
          </span>
        )}
        <button
          type="button"
          onClick={refreshNow}
          disabled={phase.state === "loading"}
          aria-label="Periksa ulang sekarang"
          className="ml-auto inline-flex min-h-11 items-center gap-2 border border-current/40 px-3 py-2 text-sm transition-[background-color,transform] duration-150 hover:bg-surface focus-visible:bg-surface active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span aria-hidden="true" className={phase.state === "loading" ? "animate-spin inline-block" : ""}>
            ↻
          </span>
          Periksa ulang
        </button>
      </div>

      <div aria-live="polite" aria-atomic="false">
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

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted">
        {checkedAt && <span>Diperiksa pukul {checkedAt} WIB</span>}
        <span aria-hidden="true">·</span>
        {paused ? (
          <span>polling dijeda (tab tak terlihat), lanjut saat kembali</span>
        ) : (
          <span>
            cek berikutnya dalam{" "}
            <span className="tabular-nums" aria-label={`Cek berikutnya dalam ${nextInSeconds} detik`}>
              {nextInSeconds}
            </span>{" "}
            dtk
          </span>
        )}
        <span aria-hidden="true">·</span>
        <span>cache server 60 dtk</span>
      </div>
    </div>
  );
}
