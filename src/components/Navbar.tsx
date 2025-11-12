"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import dayjs from "dayjs";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "LIVE">("IDLE");
  const [apiURL, setApiURL] = useState("http://localhost:5055/api");

  // กัน hydration: render เวลาเฉพาะหลัง mount
  const [clock, setClock] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setClock(dayjs().format("MM/DD/YYYY, hh:mm:ss A"));
    tick();
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, []);

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#1e2a36] bg-[#0b1220]/90 backdrop-blur">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="flex h-14 items-center gap-3">
          {/* Brand */}
          <Link
            href="/"
            className="bg-[#112034] text-sky-200 px-3 py-1 rounded-lg text-sm font-semibold"
          >
            TESA Battle Field
          </Link>

          {/* Dropdown: เส้นทาง */}
          <div className="relative">
            <button
              ref={btnRef}
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className={clsx(
                "px-3 py-1 rounded-md border text-sm",
                open
                  ? "bg-amber-900/40 border-amber-700/50 text-amber-200"
                  : "bg-[#152233] border-[#2a3b52] text-slate-300 hover:bg-[#1b2a3f]"
              )}
            >
              Dashboard
            </button>

            <div
              ref={menuRef}
              role="menu"
              className={clsx(
                "absolute left-0 mt-2 w-48 overflow-hidden rounded-xl border bg-[#0f1a26] shadow-lg border-[#213041]",
                open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none",
                "transition-all"
              )}
            >
              <Link
                role="menuitem"
                href="/defence"
                className="block px-3 py-2 text-sm text-slate-200 hover:bg-[#152233] focus:bg-[#152233] outline-none"
                onClick={() => setOpen(false)}
              >
                Defence
              </Link>
              <Link
                role="menuitem"
                href="/offence"
                className="block px-3 py-2 text-sm text-slate-200 hover:bg-[#152233] focus:bg-[#152233] outline-none"
                onClick={() => setOpen(false)}
              >
                Offence
              </Link>
              <Link
                role="menuitem"
                href="/"
                className="block px-3 py-2 text-sm text-slate-200 hover:bg-[#152233] focus:bg-[#152233] outline-none"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* ขวา: Live / API / Clock (ย้ายมาจากส่วนหัวของแต่ละหน้า) */}
          <div className="ml-auto flex items-center gap-3">
            <button
              className={clsx(
                "px-3 py-1 rounded-md border text-sm",
                status === "LIVE"
                  ? "bg-amber-900/40 border-amber-700/50 text-amber-200"
                  : "bg-[#152233] border-[#2a3b52] text-slate-300"
              )}
              onClick={() => setStatus("LIVE")}
              title="Toggle Live"
            >
              Live
            </button>

            <input
              value={apiURL}
              onChange={(e) => setApiURL(e.target.value)}
              className="w-[260px] bg-[#0f1a26] border border-[#213041] rounded-md px-3 py-1 text-sm"
              placeholder="http://localhost:5055/api"
            />

            <div
              className="text-xs text-slate-300 bg-[#0f1a26] border border-[#213041] px-3 py-1 rounded-md"
              suppressHydrationWarning
              title="Local Clock"
            >
              {clock ?? "— —/— —/— —, — —:— —:— —"}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
