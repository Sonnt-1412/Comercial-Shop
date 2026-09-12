import type { ProductArt } from "@/lib/products";
import type { CSSProperties } from "react";

type ProductArtProps = {
  art: ProductArt;
  accent: string;
  compact?: boolean;
  label?: string;
};

export function ProductArt({
  art,
  accent,
  compact = false,
  label,
}: ProductArtProps) {
  return (
    <div
      className={`product-art product-art-${art} ${compact ? "product-art-compact" : ""}`}
      style={{ "--art-accent": accent } as CSSProperties}
    >
      <span className="art-grid" />
      <span className="art-index">{label ?? "NØR / 01"}</span>
      <svg
        aria-hidden="true"
        className="art-object"
        fill="none"
        viewBox="0 0 420 330"
      >
        {art === "board" && <BoardArt />}
        {art === "sensor" && <SensorArt />}
        {art === "power" && <PowerArt />}
        {art === "tools" && <ToolsArt />}
        {art === "module" && <ModuleArt />}
        {art === "display" && <DisplayArt />}
      </svg>
      <span className="art-mark">BUILD / 2026</span>
    </div>
  );
}

function BoardArt() {
  return (
    <g className="board-object">
      <rect height="188" rx="9" width="270" x="78" y="73" />
      <rect height="34" rx="4" width="70" x="179" y="130" />
      <rect height="12" rx="2" width="85" x="105" y="97" />
      <rect height="12" rx="2" width="42" x="105" y="118" />
      <rect height="23" rx="3" width="25" x="116" y="175" />
      <rect height="23" rx="3" width="25" x="153" y="175" />
      <rect height="23" rx="3" width="25" x="190" y="175" />
      <path d="M87 88h-18M87 101h-18M87 114h-18M87 127h-18M87 140h-18M87 153h-18M87 166h-18M87 179h-18M339 88h18M339 101h18M339 114h18M339 127h18M339 140h18M339 153h18M339 166h18M339 179h18" />
      <circle cx="307" cy="107" r="15" />
      <circle cx="307" cy="107" r="5" />
      <path d="M210 84v38M230 84v38M250 84v38M270 84v38M290 84v38M210 230v20M230 230v20M250 230v20M270 230v20M290 230v20" />
      <path className="art-accent-fill" d="M202 143h103v15H202z" />
    </g>
  );
}

function SensorArt() {
  return (
    <g className="sensor-object">
      <path d="m115 95 92-44 102 50-94 46-100-52Z" />
      <path d="m115 95 2 108 98 52 94-49-2-105" />
      <path d="m209 147 2 108M117 203l94 52 98-49" />
      <rect height="55" rx="4" width="48" x="185" y="108" />
      <circle cx="209" cy="126" r="9" />
      <circle cx="209" cy="148" r="9" />
      <path
        className="art-accent-stroke"
        d="M172 80 178 68M194 70V56M218 68l5-14M242 76l8-11"
      />
      <path d="M123 125H92M125 153H87M291 133h40M291 163h31M151 224l-11 24M275 217l12 26" />
    </g>
  );
}

function PowerArt() {
  return (
    <g className="power-object">
      <rect height="140" rx="8" width="230" x="95" y="94" />
      <path d="M95 123h230M138 94v-27M282 94V67M138 234v29M282 234v29" />
      <rect height="44" rx="5" width="72" x="115" y="148" />
      <path d="M130 170h39M248 153v29M263 153v29M278 153v29" />
      <circle className="art-accent-fill" cx="295" cy="118" r="8" />
      <path className="art-accent-stroke" d="M129 116h36M243 116h34" />
      <path d="m191 160 25 20-25 20" />
    </g>
  );
}

function ToolsArt() {
  return (
    <g className="tools-object">
      <path d="m96 231 105-138c9-12 26-14 38-5l10 8c12 9 14 26 5 38L149 272c-8 11-24 14-35 7l-12-8c-11-8-14-26-6-40Z" />
      <path d="m214 96 40 31M187 131l42 32M159 167l42 31M130 204l42 31" />
      <path
        className="art-accent-stroke"
        d="m218 91 30-28M246 63l23 12-21 17"
      />
      <rect
        height="37"
        rx="7"
        transform="rotate(38 298 184)"
        width="75"
        x="260"
        y="165"
      />
      <path d="m295 174 30 23M283 190l30 23M272 205l29 23" />
    </g>
  );
}

function ModuleArt() {
  return (
    <g className="module-object">
      <rect height="150" rx="8" width="252" x="84" y="90" />
      <path d="M84 118h-24M84 140h-24M84 162h-24M84 184h-24M84 206h-24M336 118h24M336 140h24M336 162h24M336 184h24M336 206h24" />
      <rect height="66" rx="5" width="64" x="178" y="132" />
      <path d="M190 144h40v42h-40zM109 107h29v17h-29zM109 204h29v17h-29zM283 107h29v17h-29zM283 204h29v17h-29z" />
      <circle className="art-accent-fill" cx="118" cy="158" r="8" />
      <circle className="art-accent-fill" cx="302" cy="158" r="8" />
      <path
        className="art-accent-stroke"
        d="M142 158h28M250 158h28M210 114v12M210 198v20"
      />
    </g>
  );
}

function DisplayArt() {
  return (
    <g className="display-object">
      <rect height="156" rx="10" width="268" x="76" y="84" />
      <rect
        className="screen-fill"
        height="102"
        rx="4"
        width="202"
        x="109"
        y="111"
      />
      <path
        className="screen-line"
        d="M126 170h76l18-22 23 12 18-31M126 190h52M126 132h48"
      />
      <path d="M161 240v38M259 240v38M139 278h143" />
      <path
        className="art-accent-stroke"
        d="M93 116h-21M93 138h-21M93 160h-21M327 116h21M327 138h21M327 160h21"
      />
    </g>
  );
}
