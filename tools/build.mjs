// Builds the profile's SVG cards from the pixel art in art/out.
// Run: node tools/build.mjs   (after building art/candy.px.js with pxl)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT = join(ROOT, "assets")
mkdirSync(join(OUT, "quests"), { recursive: true })

const b64 = (p) => "data:image/png;base64," + readFileSync(join(ROOT, p)).toString("base64")
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

// Candy palette. Light = pastel shop by day, dark = neon sweet shop at night.
const THEME = `
  :root, svg { --bg:#fff6ec; --ink:#5b3a29; --mute:#9a7461; --line:#3b2230;
    --p:#ff8fb1; --P:#e0607e; --q:#ffc4d6; --m:#8fe3cf; --M:#2f9a86; --v:#b8a4ff; --V:#7a64c9;
    --y:#ffe58f; --Y:#d98f1e; --stripe:#fff6ec; --track:#f3e2d3; }
  @media (prefers-color-scheme: dark) {
    :root, svg { --bg:#2a1b2e; --ink:#ffe9f0; --mute:#c7a9c0; --line:#120a14;
      --q:#5a2f4a; --M:#8fe3cf; --V:#cbbcff; --Y:#ffe58f; --P:#ff8fb1;
      --stripe:#3d2847; --track:#3d2847; }
  }
  text { font-family: ui-monospace, "Cascadia Mono", Consolas, "Courier New", monospace; fill: var(--ink); }
  .th { font-family: "Noto Sans Thai", "Leelawadee UI", Tahoma, sans-serif; }
  .pix { image-rendering: pixelated; image-rendering: crisp-edges; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
`

const stripe = (id, a, b, size = 20) => `
  <pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="${size}" height="${size}" fill="${b}"/><rect width="${size / 2}" height="${size}" fill="${a}"/>
    <animate attributeName="x" from="0" to="${size}" dur="2.4s" repeatCount="indefinite"/>
  </pattern>`

// ------------------------------------------------------------------ save card
const SINCE = new Date("2024-09-10")
function playtime(now = new Date()) {
  let m = (now.getFullYear() - SINCE.getFullYear()) * 12 + now.getMonth() - SINCE.getMonth()
  if (now.getDate() < SINCE.getDate()) m--
  return `${Math.floor(m / 12)}y ${String(m % 12).padStart(2, "0")}m`
}

function saveCard() {
  const W = 840, H = 250
  const row = (y, k, v) =>
    `<text x="268" y="${y}" font-size="15"><tspan fill="var(--P)" font-weight="700">${k}</tspan><tspan x="352">${esc(v)}</tspan></text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">Save file 01: Pipothai</title>
<desc id="d">Pixel-art character card. Pipothai, level 2 indie dev from Trat, Thailand. Class: Minecraft modder, Roblox builder, Gopher. Makes games, mods and systems people really use.</desc>
<style>${THEME}
  .bob { animation: bob 2.4s ease-in-out infinite; transform-box: fill-box; }
  @keyframes bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
  .blink { animation: blink 1.1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0 } }
  .sugar { animation: fill 2.8s cubic-bezier(.3,.8,.3,1) forwards; transform-origin: 352px 0; transform: scaleX(0); }
  @keyframes fill { to { transform: scaleX(1) } }
</style>
<defs>${stripe("cane", "var(--p)", "var(--stripe)")}</defs>
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="24" fill="url(#cane)" stroke="var(--line)" stroke-width="4"/>
<rect x="16" y="16" width="${W - 32}" height="${H - 32}" rx="16" fill="var(--bg)" stroke="var(--line)" stroke-width="3"/>
<ellipse cx="128" cy="218" rx="70" ry="8" fill="var(--q)"/>
<g class="bob"><image class="pix" href="${b64("art/out/sprites/avatar.png")}" x="40" y="22" width="192" height="192"/></g>
<rect x="268" y="36" width="138" height="26" rx="13" fill="var(--p)" stroke="var(--line)" stroke-width="2"/>
<text x="337" y="54" font-size="13" font-weight="700" text-anchor="middle" fill="#3b2230" style="fill:#3b2230">SAVE FILE 01</text>
<text x="800" y="54" font-size="13" text-anchor="end" fill="var(--mute)" style="fill:var(--mute)">PLAYTIME ${playtime()}</text>
<text x="268" y="98" font-size="34" font-weight="800" letter-spacing="2">PIPOTHAI <tspan font-size="18" fill="var(--M)" style="fill:var(--M)">Lv.2</tspan></text>
<text class="th" x="268" y="126" font-size="16" style="fill:var(--mute)">ทำเกม ทำม็อด และทำระบบที่คนใช้จริง 🍬</text>
${row(158, "CLASS", "Minecraft Modder / Roblox Builder / Gopher")}
${row(182, "HOME ", "Trat, Thailand")}
<text x="268" y="210" font-size="15" font-weight="700" fill="var(--P)" style="fill:var(--P)">SUGAR</text>
<rect x="352" y="197" width="260" height="16" rx="8" fill="var(--track)" stroke="var(--line)" stroke-width="2"/>
<g class="sugar"><rect x="354" y="199" width="256" height="12" rx="6" fill="url(#cane)"/></g>
<text x="624" y="210" font-size="13" font-weight="700" fill="var(--M)" style="fill:var(--M)">MAX!</text>
<text class="blink" x="800" y="222" font-size="14" font-weight="700" text-anchor="end">▶ CONTINUE</text>
</svg>
`
}

// ------------------------------------------------------------------ quest cards
const QUESTS = [
  { id: "lastlight", title: "Last Light", sub: "Roblox · Luau · cozy explore", tag: "main", color: "y" },
  { id: "mtc", title: "MTC Craft", sub: "Forge 1.20.1 · multicrew tanks", tag: "main", color: "m" },
  { id: "choocream", title: "ChooCream", sub: "HD skins · Cloudflare cloud", tag: "main", color: "p" },
  { id: "static", title: "Static Resonance", sub: "Origins add-on · on Modrinth", tag: "main", color: "y" },
  { id: "shoulder", title: "Shoulder Look", sub: "Client mod · glance around", tag: "main", color: "v" },
  { id: "flood", title: "Flood Watch", sub: "Go · PostGIS · nationwide", tag: "side", color: "m" },
  { id: "warehouse", title: "Walk-in Warehouse", sub: "Go · Nuxt · 3D stock world", tag: "side", color: "y" },
  { id: "rescue", title: "Flood Rescue Rides", sub: "PWA · web push · SMS fallback", tag: "side", color: "p" },
  { id: "booking", title: "Booking SaaS", sub: "Go · multi-tenant · RBAC", tag: "side", color: "v" },
  { id: "molly", title: "Molly's Maze", sub: "Godot 4 · my first game", tag: "done", color: "v" },
  { id: "health", title: "Public Health", sub: "PHP · my first repo", tag: "done", color: "p" },
  { id: "trat", title: "Welcome to Trat", sub: "JS · hometown guide", tag: "done", color: "m" },
]
const TAG = {
  main: { label: "★ MAIN QUEST", fill: "var(--p)" },
  side: { label: "◆ SIDE QUEST", fill: "var(--m)" },
  done: { label: "✓ CLEARED", fill: "var(--y)" },
}
const SOFT = { p: "var(--q)", m: "#d7f6ee", y: "#fff1c4", v: "#e9e2ff" }

function questCard(q) {
  const W = 400, H = 120, t = TAG[q.tag]
  const twist = (flip) => {
    const pts = [[34, 22], [8, 8], [18, 36], [4, 60], [18, 84], [8, 112], [34, 98]]
    return `<polygon points="${pts.map(([x, y]) => `${flip ? W - x : x},${y}`).join(" ")}" fill="var(--${q.color})" stroke="var(--line)" stroke-width="3" stroke-linejoin="round"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
<title id="t">${esc(q.title)}: ${esc(q.sub)} (${t.label.slice(2).toLowerCase()})</title>
<style>${THEME}
  .body { fill: ${SOFT[q.color]}; }
  @media (prefers-color-scheme: dark) { .body { fill: #3d2847; } }
  .wig { animation: wig 3s ease-in-out infinite; transform-origin: 78px 60px; transform-box: view-box; }
  @keyframes wig { 0%,100% { transform: rotate(0) } 50% { transform: rotate(-4deg) } }
</style>
${twist(false)}${twist(true)}
<rect class="body" x="30" y="14" width="${W - 60}" height="${H - 28}" rx="18" stroke="var(--line)" stroke-width="3"/>
<path d="M44 26 h${W - 120}" stroke="#ffffff" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>
<g class="wig"><image class="pix" href="${b64(`art/out/sprites/icon_${q.id}.png`)}" x="46" y="28" width="64" height="64"/></g>
<text x="124" y="52" font-size="20" font-weight="800">${esc(q.title)}</text>
<text x="124" y="74" font-size="13" style="fill:var(--mute)">${esc(q.sub)}</text>
<rect x="124" y="83" width="${t.label.length * 8 + 16}" height="20" rx="10" fill="${t.fill}" stroke="var(--line)" stroke-width="2"/>
<text x="132" y="97" font-size="11" font-weight="800" style="fill:#3b2230">${t.label}</text>
</svg>
`
}

// ------------------------------------------------------------------ divider
const divider = () => `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="20" viewBox="0 0 840 20" role="img" aria-label="candy cane divider">
<style>${THEME}</style>
<defs>${stripe("cane", "var(--p)", "#fff6ec", 16)}</defs>
<rect x="2" y="3" width="836" height="14" rx="7" fill="url(#cane)" stroke="var(--line)" stroke-width="2"/>
</svg>
`

writeFileSync(join(OUT, "save-card.svg"), saveCard())
writeFileSync(join(OUT, "divider.svg"), divider())
for (const q of QUESTS) writeFileSync(join(OUT, "quests", `${q.id}.svg`), questCard(q))
console.log(`built save-card, divider and ${QUESTS.length} quest cards`)
