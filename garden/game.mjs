// Candy Garden: a tiny community game played through issues.
// Each issue titled "garden|tend|<plot>" tends one plot: plant -> water -> water -> harvest.
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { join, dirname } from "node:path"

export const PLOTS = 15
const COLS = 5
const CROPS = ["lolly", "cupcake", "donut"]
const NAMES = { lolly: "lollipop", cupcake: "cupcake", donut: "donut" }
const RIPE = 3
const MAX_BAKERS = 200 // keep state.json small: only the top bakers are remembered

export const newState = () => ({
  plots: Array.from({ length: PLOTS }, () => ({ stage: 0, crop: null })),
  harvested: 0,
  bakers: {},
  log: [],
})

export function parseTitle(title) {
  const m = /^garden\|tend\|(\d{1,2})$/.exec(String(title).trim())
  if (!m) return null
  const n = Number(m[1])
  return n >= 1 && n <= PLOTS ? { plot: n - 1 } : null
}

export function tend(prev, user, plot, at) {
  const s = structuredClone(prev)
  const p = s.plots[plot]
  let action, points = 1
  if (p.stage === 0) {
    action = "plant"
    p.crop = CROPS[(plot + s.harvested) % CROPS.length]
    p.stage = 1
  } else if (p.stage < RIPE) {
    action = "water"
    p.stage++
  } else {
    action = "harvest"
    points += 2
    s.harvested++
    p.stage = 0
    p.crop = null
  }
  s.bakers[user] = (s.bakers[user] ?? 0) + points
  const names = Object.keys(s.bakers)
  if (names.length > MAX_BAKERS) {
    const keep = names.sort((a, b) => s.bakers[b] - s.bakers[a] || (a === user ? -1 : b === user ? 1 : 0)).slice(0, MAX_BAKERS)
    s.bakers = Object.fromEntries(keep.map((u) => [u, s.bakers[u]]))
  }
  s.log = [{ user, action, plot: plot + 1, at }, ...s.log].slice(0, 5)
  return { state: s, action, crop: p.crop }
}

function plotView({ stage, crop }) {
  if (stage === 0) return { img: "empty", alt: "empty soil" }
  if (stage === 1) return { img: "sprout", alt: "a tiny sprout" }
  if (stage === 2) return { img: `${crop}_grow`, alt: `a growing ${NAMES[crop]}` }
  return { img: `${crop}_ripe`, alt: `a ripe ${NAMES[crop]}, ready to harvest` }
}

const VERB = { plant: "planted", water: "watered", harvest: "harvested" }

export function renderGarden(s, repo) {
  const body = encodeURIComponent("Just press **Submit new issue**. A bot will tend the plot for you 🍬")
  const rows = []
  for (let r = 0; r < PLOTS / COLS; r++) {
    const cells = []
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c
      const v = plotView(s.plots[i])
      const href = `https://github.com/${repo}/issues/new?title=garden%7Ctend%7C${i + 1}&body=${body}`
      cells.push(`<td align="center"><a href="${href}"><img src="assets/garden/${v.img}.png" width="64" height="64" alt="Plot ${i + 1}: ${v.alt}"></a></td>`)
    }
    rows.push(`<tr>${cells.join("")}</tr>`)
  }
  const top = Object.entries(s.bakers).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 5)
  const lines = [
    `<table align="center">${rows.join("")}</table>`,
    "",
    `<p align="center"><b>${s.harvested}</b> sweets harvested together so far · ช่วยกันปลูกขนมไปแล้ว <b>${s.harvested}</b> ชิ้น</p>`,
    "",
  ]
  if (top.length) {
    lines.push(`<p align="center">🧁 Top bakers: ${top.map(([u, n]) => `<a href="https://github.com/${u}">@${u}</a> (${n})`).join(" · ")}</p>`, "")
  }
  if (s.log.length) {
    lines.push(`<p align="center"><sub>Latest: ${s.log.map((l) => `${l.user} ${VERB[l.action]} plot ${l.plot}`).join(" · ")}</sub></p>`)
  }
  return lines.join("\n").trimEnd()
}

const START = "<!-- GARDEN:START -->", END = "<!-- GARDEN:END -->"
export function spliceReadme(readme, md) {
  const a = readme.indexOf(START), b = readme.indexOf(END)
  if (a < 0 || b < a) throw new Error("README is missing the GARDEN markers")
  return readme.slice(0, a + START.length) + "\n" + md + "\n" + readme.slice(b)
}

// CLI: ISSUE_TITLE, ISSUE_USER, GITHUB_REPOSITORY from the workflow. Writes the reply to garden/reply.md.
// With --render it only redraws the README from the current state.
function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const statePath = join(root, "garden", "state.json"), readmePath = join(root, "README.md")
  const repo = process.env.GITHUB_REPOSITORY || "aletheiamask/aletheiamask"
  let state = newState()
  try { state = JSON.parse(readFileSync(statePath, "utf8")) } catch {}
  let reply = ""
  if (!process.argv.includes("--render")) {
    const user = process.env.ISSUE_USER || ""
    const parsed = parseTitle(process.env.ISSUE_TITLE || "")
    if (!parsed || !/^[A-Za-z0-9-]{1,39}$/.test(user)) {
      writeFileSync(join(root, "garden", "reply.md"), "Hmm, I couldn't read that move. Use one of the plot links in the README 🍬\n")
      process.exitCode = 2
      return
    }
    const r = tend(state, user, parsed.plot, new Date().toISOString())
    state = r.state
    reply = {
      plant: `🌱 You planted a seed in plot ${parsed.plot + 1}. Something sweet is coming up!`,
      water: `💧 You watered plot ${parsed.plot + 1} with syrup. It's growing!`,
      harvest: `🍬 You harvested plot ${parsed.plot + 1}! That's ${state.harvested} sweets harvested in total.`,
    }[r.action]
    writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n")
  }
  writeFileSync(readmePath, spliceReadme(readFileSync(readmePath, "utf8"), renderGarden(state, repo)))
  if (reply) writeFileSync(join(root, "garden", "reply.md"), reply + "\n\nขอบคุณที่มาช่วยปลูกนะ! The garden on the profile has been updated.\n")
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main()
