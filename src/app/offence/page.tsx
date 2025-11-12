// app/offence/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import clsx from "clsx";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

type ArmState = "SAFE" | "ARMED";
type FireMode = "Single" | "Burst" | "Auto";
type Status = "IDLE" | "LIVE" | "ERROR";

function PanelHeader({ status }: { status: Status }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#0f1a26] rounded-t-2xl border-b border-[#223244]">
      <div className="text-lg font-semibold tracking-wide">
        <span className="mr-2">⚔️</span>Offence Dashboard
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

export default function OffencePage() {
  const [status, setStatus] = useState<Status>("IDLE");
  const [arm, setArm] = useState<ArmState>("SAFE");
  const [mode, setMode] = useState<FireMode>("Single");
  const [attackPower] = useState<number>(95);

  const onConnect = () => setStatus("LIVE");
  const onLoadOnce = () => console.log("offence load-once");

  const cycleMode = () => setMode((m) => (m === "Single" ? "Burst" : m === "Burst" ? "Auto" : "Single"));

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
                <InfoCard title="Engagement Controls">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 text-xs">Arm:</span>
                    <button
                      onClick={() => setArm((a) => (a === "SAFE" ? "ARMED" : "SAFE"))}
                      className={clsx(
                        "px-3 py-1 rounded-md border text-sm",
                        arm === "ARMED"
                          ? "bg-rose-900/40 border-rose-700/50 text-rose-200"
                          : "bg-[#152233] border-[#2a3b52] text-slate-300"
                      )}
                    >
                      {arm}
                    </button>

                    <span className="text-slate-400 text-xs ml-3">Fire Mode:</span>
                    <button
                      onClick={cycleMode}
                      className="px-3 py-1 rounded-md border text-sm bg-[#1e2a38] hover:bg-[#263447] border-[#2b3b4f]"
                    >
                      {mode}
                    </button>

                    <span className="text-slate-400 text-xs ml-3">Attack Power:</span>
                    <div className="px-2 py-1 rounded bg-[#0c1420] border border-[#1f2c3b] text-sm">
                      {attackPower}%
                    </div>
                  </div>
                </InfoCard>

                <InfoCard title="Image Viewer">
                  <div className="text-slate-400 text-xs mb-2">iframe / stream</div>
                  <div className="text-xs">Selected: -</div>
                  <div className="text-xs">Timestamp: -</div>
                </InfoCard>

                <InfoCard title="Target & Weapon Info">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-400">Target Locked</div>
                    <div className="text-green-400">YES</div>
                    <div className="text-slate-400">Weapon Mode</div>
                    <div className="text-yellow-300">{mode}</div>
                    <div className="text-slate-400">ETA</div>
                    <div className="text-slate-200">—</div>
                  </div>
                </InfoCard>

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
