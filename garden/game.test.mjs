import { test } from "node:test"
import assert from "node:assert/strict"
import { parseTitle, newState, tend, renderGarden, spliceReadme, PLOTS } from "./game.mjs"

const NOW = "2026-10-26T00:00:00Z"

test("parseTitle accepts garden|tend|n for every plot", () => {
  assert.deepEqual(parseTitle("garden|tend|1"), { plot: 0 })
  assert.deepEqual(parseTitle(" garden|tend|15 "), { plot: 14 })
})

test("parseTitle rejects anything else", () => {
  for (const t of ["garden|tend|0", "garden|tend|16", "garden|tend|x", "garden|eat|3", "hello", "garden|tend|3|x"])
    assert.equal(parseTitle(t), null, t)
})

test("a plot grows empty -> sprout -> grow -> ripe -> harvested", () => {
  let s = newState()
  const steps = []
  for (let i = 0; i < 4; i++) {
    const r = tend(s, "alice", 2, NOW)
    s = r.state
    steps.push(r.action)
  }
  assert.deepEqual(steps, ["plant", "water", "water", "harvest"])
  assert.equal(s.plots[2].stage, 0)
  assert.equal(s.harvested, 1)
  assert.equal(s.bakers.alice, 4 + 2) // 1 point per action, +2 bonus on harvest
})

test("tend does not mutate the input state", () => {
  const s = newState()
  tend(s, "bob", 0, NOW)
  assert.equal(s.plots[0].stage, 0)
  assert.deepEqual(s.bakers, {})
})

test("planted crop is chosen deterministically from plot and harvest count", () => {
  const a = tend(newState(), "x", 4, NOW).state.plots[4].crop
  const b = tend(newState(), "y", 4, NOW).state.plots[4].crop
  assert.equal(a, b)
  assert.ok(["lolly", "cupcake", "donut"].includes(a))
})

test("log keeps the 5 newest actions, newest first", () => {
  let s = newState()
  for (let i = 0; i < 7; i++) s = tend(s, "u" + i, i, NOW).state
  assert.equal(s.log.length, 5)
  assert.equal(s.log[0].user, "u6")
})

test("renderGarden shows a 5x3 grid of tend links and top bakers", () => {
  let s = newState()
  s = tend(s, "alice", 0, NOW).state
  const md = renderGarden(s, "aletheiamask/aletheiamask")
  assert.equal(PLOTS, 15)
  assert.equal((md.match(/garden%7Ctend%7C/g) || []).length, 15)
  assert.match(md, /assets\/garden\/sprout\.png/)
  assert.match(md, /@alice/)
})

test("renderGarden gives every plot alt text", () => {
  const md = renderGarden(newState(), "o/r")
  assert.match(md, /alt="Plot 1: empty soil"/)
})

test("spliceReadme replaces only between markers", () => {
  const readme = "top\n<!-- GARDEN:START -->\nold\n<!-- GARDEN:END -->\nbottom\n"
  const out = spliceReadme(readme, "NEW")
  assert.equal(out, "top\n<!-- GARDEN:START -->\nNEW\n<!-- GARDEN:END -->\nbottom\n")
})

test("spliceReadme throws when markers are missing", () => {
  assert.throws(() => spliceReadme("no markers", "x"))
})

test("bakers list is capped at 200 and keeps the current player", () => {
  let s = newState()
  for (let i = 0; i < 205; i++) s = tend(s, "u" + i, i % PLOTS, NOW).state
  assert.equal(Object.keys(s.bakers).length, 200)
  assert.ok("u204" in s.bakers)
})

test("logins that match Object.prototype keys score like anyone else", () => {
  let s = newState()
  s = tend(s, "constructor", 0, NOW).state
  s = tend(s, "toString", 1, NOW).state
  assert.equal(s.bakers.constructor, 1)
  assert.equal(s.bakers.toString, 1)
  assert.equal(JSON.parse(JSON.stringify(s)).bakers.constructor, 1)
})
