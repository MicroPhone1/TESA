// app/defence/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

function PanelHeader({ status }: { status: "IDLE" | "LIVE" | "ERROR" }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#0f1a26] rounded-t-2xl border-b border-[#223244]">
      <div className="text-lg font-semibold tracking-wide">
        <span className="mr-2">🛡️</span>Defence Dashboard
      </div>
      <span
        className={clsx(
          "px-3 py-1 rounded-full text-xs font-semibold",
          status === "IDLE"  && "bg-emerald-900/50 text-emerald-300 border border-emerald-700/50",
          status === "LIVE"  && "bg-amber-900/40 text-amber-300 border border-amber-700/50",
          status === "ERROR" && "bg-rose-900/40 text-rose-300 border border-rose-700/50",
        )}
      >
        {status}
      </span>
    </div>
  );
}

function InputRow({ onConnect, onLoadOnce }: { onConnect: () => void; onLoadOnce: () => void }) {
  return (
    <div className="grid grid-cols-12 gap-3 px-4 py-3">
      <input className="col-span-5 bg-[#0c1420] border border-[#1f2c3b] rounded-lg px-3 py-2 text-sm" placeholder="Camera ID" />
      <input className="col-span-5 bg-[#0c1420] border border-[#1f2c3b] rounded-lg px-3 py-2 text-sm" placeholder="Token (x-camera-token)" />
      <button onClick={onConnect} className="col-span-1 bg-[#1e2a38] hover:bg-[#263447] border border-[#2b3b4f] rounded-lg text-sm font-medium">Connect</button>
      <button onClick={onLoadOnce} className="col-span-1 bg-[#1e2a38] hover:bg-[#263447] border border-[#2b3b4f] rounded-lg text-sm font-medium">Load once</button>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="bg-[#0f1a26] border border-[#203145] rounded-xl p-4">
      <div className="text-sm text-amber-300 font-semibold mb-2">{title}</div>
      <div className="text-sm text-slate-300">{children ?? "…"}</div>
    </div>
  );
}

export default function DefencePage() {
  // clock เดิมอยู่ใน Top Bar — ตัดออก (Navbar ทำหน้าที่นี้แทน)
  const [status, setStatus] = useState<"IDLE" | "LIVE" | "ERROR">("IDLE");

  const onConnect = () => setStatus("LIVE");
  const onLoadOnce = () => console.log("defence load-once");

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* (ลบ Top Bar ออกแล้ว) */}

      <div className="p-6">
        <div className="bg-[#0b1624] border border-[#1f2f43] rounded-2xl overflow-hidden max-w-[1600px] mx-auto">
          <PanelHeader status={status} />
          <InputRow onConnect={onConnect} onLoadOnce={onLoadOnce} />

          <div className="px-4 pb-4">
            <div className="text-amber-300 font-semibold mb-3">Realtime Feed</div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 xl:col-span-7">
                <div className="h-[460px] bg-[#0f1a26] border border-[#203145] rounded-xl p-2">
                  <LeafletMap className="h-full" />
                </div>
              </div>
              <div className="col-span-12 xl:col-span-5 flex flex-col gap-3">
                <InfoCard title="Image Viewer">
                  <div className="text-slate-400 text-xs mb-2">iframe</div>
                  <div className="text-xs">Selected: -</div>
                  <div className="text-xs">Timestamp: -</div>
                </InfoCard>
                <InfoCard title="Camera Info" />
                <InfoCard title="Proximity Alert (300m)">
                  <div className="text-sm">Nearest distance: -</div>
                </InfoCard>
                <InfoCard title="Weather (near selected)" />
                <InfoCard title="POIs in 3km radius" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
