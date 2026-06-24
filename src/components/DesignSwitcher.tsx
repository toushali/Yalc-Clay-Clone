"use client";

import { useState } from "react";
import DesignV1 from "@/designs/DesignV1";
import DesignV2Light from "@/designs/DesignV2Light";
import DesignV3Dark from "@/designs/DesignV3Dark";

const designs = [
  { id: "v1", label: "V1 · Claymation" },
  { id: "v2", label: "V2 · Light" },
  { id: "v3", label: "V3 · Dark" },
] as const;

type DesignId = (typeof designs)[number]["id"];

export default function DesignSwitcher() {
  const [active, setActive] = useState<DesignId>("v1");

  return (
    <>
      {/* Floating toggle */}
      <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/80 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-xl">
          {designs.map((d) => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                active === d.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-black/5"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render active design */}
      {active === "v1" && <DesignV1 />}
      {active === "v2" && <DesignV2Light />}
      {active === "v3" && <DesignV3Dark />}
    </>
  );
}