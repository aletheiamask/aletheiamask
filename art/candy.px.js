// Candy Land pixel art for the GitHub profile: avatar + village banner (day / night).
pal({
  k: "#3b2230",                          // ink (dark chocolate)
  c: "#5b3a29", C: "#8a5a3c", o: "#b98257", // chocolate
  w: "#fff6ec",                          // cream
  P: "#e0607e", p: "#ff8fb1", q: "#ffc4d6", // strawberry
  M: "#4fb5a0", m: "#8fe3cf", n: "#c9f5ea", // mint
  V: "#8a74d9", v: "#b8a4ff", u: "#e2d8ff", // lavender
  Y: "#f5b84a", y: "#ffe58f",            // lemon
  h: "#4a2a3a", H: "#6e4458",            // hair
  F: "#f0b49e", f: "#ffd9c4",            // skin
  r: "#ff9eb0",                          // blush
  // night
  N: "#2a1b2e", D: "#3d2847", E: "#55376b",
})
ramps("kcCow", "kPpqw", "kMmnw", "kVvuw", "kYyw", "hH", "Ff", "NDE")

// ---------------------------------------------------------------- avatar
sprite("avatar", { w: 30, h: 30, outline: "k" }, (c) => {
  // hood with cat ears
  c.poly([3, 9, 6, 0, 11, 5], "P")
  c.poly([27, 9, 24, 0, 19, 5], "P")
  c.poly([5, 7, 6, 3, 9, 5], "q")
  c.poly([25, 7, 24, 3, 21, 5], "q")
  c.circ(15, 14, 12, "P")
  c.circ(15, 14, 11, "p")
  // body
  c.poly([3, 30, 6, 23, 24, 23, 27, 30], "p")
  c.poly([3, 30, 6, 23, 8, 23, 6, 30], "P")
  c.vline(12, 25, 4, "w"); c.vline(18, 25, 4, "w")
  c.px(12, 29, "y"); c.px(18, 29, "y")
  // face
  c.circ(15, 16, 8, "f")
  c.hline(9, 22, 13, "F")
  // bangs
  c.poly([6, 8, 24, 8, 24, 14, 21, 12, 18, 14, 15, 11, 12, 14, 9, 12, 6, 14], "h")
  c.hline(10, 10, 3, "H"); c.px(19, 10, "H")
  // eyes, blush, mouth
  c.rect(10, 15, 2, 3, "k"); c.px(10, 15, "w")
  c.rect(19, 15, 2, 3, "k"); c.px(19, 15, "w")
  c.rect(8, 19, 2, 1, "r"); c.rect(21, 19, 2, 1, "r")
  c.px(13, 19, "k"); c.px(14, 20, "k"); c.px(15, 19, "k"); c.px(16, 20, "k"); c.px(17, 19, "k")
  // lollipop
  c.vline(27, 12, 13, "w")
  c.circ(27, 8, 4, "m")
  c.ring(27, 8, 2, "w")
  c.px(27, 8, "p"); c.px(25, 6, "n")
  c.circ(26, 24, 2, "f")
})

// ---------------------------------------------------------------- parts
sprite("_gumdrop", { w: 22, h: 20, outline: "k" }, (c) => {
  c.ellipse(11, 12, 10, 11, "p")
  c.rect(0, 13, 22, 7, "p")
  c.ellipse(8, 7, 3, 3, "q")
  c.shade([14, 4, 8, 16])
  c.rect(8, 12, 6, 8, "C"); c.rect(9, 13, 4, 7, "o"); c.px(12, 16, "y") // door
  c.rect(15, 9, 4, 4, "y"); c.hline(15, 11, 4, "Y"); c.vline(17, 9, 4, "Y") // window
  c.px(4, 6, "w"); c.px(17, 4, "w"); c.px(3, 14, "w"); c.px(19, 16, "w") // sugar
})
sprite("_lolly", { w: 11, h: 26, outline: "k" }, (c) => {
  c.vline(5, 10, 16, "w")
  c.circ(5, 5, 5, "v")
  c.ring(5, 5, 3, "u")
  c.ring(5, 5, 1, "V")
  c.px(5, 5, "w")
})
sprite("_cone", { w: 10, h: 18, outline: "k" }, (c) => {
  c.circ(5, 4, 4, "q"); c.circ(3, 3, 1, "w")
  c.circ(5, 7, 4, "m")
  c.poly([1, 9, 9, 9, 5, 18], "Y")
  c.line(2, 10, 6, 15, "o"); c.line(8, 10, 4, 15, "o")
  c.px(5, 0, "P")
})
sprite("_cloud", { w: 26, h: 10 }, (c) => {
  c.ellipse(8, 6, 7, 4, "w"); c.ellipse(16, 5, 8, 5, "w"); c.ellipse(21, 7, 5, 3, "w")
  c.hline(3, 9, 22, "q")
})
sprite("_cane", { w: 6, h: 16, outline: "k" }, (c) => {
  c.vline(4, 3, 13, "w"); c.vline(5, 3, 13, "w")
  c.ring(2, 3, 2, "w"); c.rect(0, 3, 2, 3, "_")
  for (let y = 4; y < 16; y += 3) { c.px(4, y, "P"); c.px(5, y + 1, "P") }
  c.px(1, 1, "P"); c.px(3, 0, "P")
})
anim("_candy", { w: 11, h: 9, frames: 8, fps: 5, outline: "k" }, (c) => {
  const dy = Math.round(Math.sin(c.phase * Math.PI * 2) * 1.5) + 2
  c.poly([0, dy, 3, dy + 2, 0, dy + 4], "y")
  c.poly([10, dy, 7, dy + 2, 10, dy + 4], "y")
  c.ellipse(5, dy + 2, 3, 2, "p")
  c.px(4, dy + 1, "w")
})
anim("_twinkle", { w: 5, h: 5, frames: 6, fps: 5 }, (c) => {
  const f = c.frame
  if (f < 2) return
  c.px(2, 2, "w")
  if (f >= 3 && f <= 4) { c.px(2, 1, "y"); c.px(2, 3, "y"); c.px(1, 2, "y"); c.px(3, 2, "y") }
  if (f === 4) { c.px(2, 0, "w"); c.px(2, 4, "w"); c.px(0, 2, "w"); c.px(4, 2, "w") }
})

// ---------------------------------------------------------------- banner
const W = 240, H = 80
function village(night) {
  return [
    night ? grad(0, 0, W, 60, "NDE", "v") : grad(0, 0, W, 60, "uqw", "v"),
    layer("sky", ...(night
      ? [circ(204, 16, 9, "y"), circ(208, 13, 8, "D"),
         scatter("_twinkle", 0, 0, W, 44, 18, { rdelay: true, seed: 3 })]
      : [circ(204, 16, 9, "y"), circ(204, 16, 6, "w"),
         stamp("_cloud", 18, 10), stamp("_cloud", 120, 4), stamp("_cloud", 160, 22, { flip: "x" }),
         scatter("_twinkle", 0, 0, W, 30, 6, { rdelay: true, seed: 5 })])),
    // far hills
    layer("hills",
      ellipse(40, 62, 60, 14, night ? "E" : "v"), ellipse(150, 64, 80, 16, night ? "E" : "v"),
      ellipse(230, 60, 40, 12, night ? "E" : "v")),
    // frosting ground with drips
    layer("ground", { y: 60 },
      rect(0, 0, W, 20, "C"),
      rect(0, 0, W, 4, night ? "M" : "m"),
      (c) => { for (let x = 3; x < W; x += 9) c.vline(x, 4, 2 + (x * 7) % 4, night ? "M" : "m") },
      hline(0, 0, W, night ? "m" : "n"),
      (c) => { for (let x = 6; x < W; x += 17) { c.px(x, 10 + (x % 5), "o"); c.px(x + 8, 14, "o") } },
    ),
    // props
    layer("props",
      stamp("_lolly", 10, 35), stamp("_lolly", 96, 37, { swap: { v: "p", u: "q", V: "P" } }),
      stamp("_lolly", 222, 35, { swap: { v: "m", u: "n", V: "M" } }),
      stamp("_gumdrop", 28, 41),
      stamp("_gumdrop", 66, 43, { swap: { p: "m", q: "n" } }),
      stamp("_gumdrop", 168, 41, { swap: { p: "v", q: "u" } }),
      stamp("_gumdrop", 196, 43, { swap: { p: "y", q: "w" } }),
      stamp("_cone", 150, 43), stamp("_cane", 58, 46), stamp("_cane", 190, 46, { flip: "x" }),
    ),
    // sign
    layer("sign",
      rect(110, 36, 34, 15, "k"), rect(111, 37, 32, 13, night ? "D" : "w"),
      vline(115, 51, 9, "C"), vline(139, 51, 9, "C"),
      text(127, 39, "CANDY", night ? "p" : "P", { align: "c" }),
      text(127, 45, "TRAT", night ? "m" : "M", { align: "c" }),
    ),
    night ? glow("y", { r: 8, strength: 0.4 }) : [],
    layer("candies",
      stamp("_candy", 46, 22, { rdelay: true }), stamp("_candy", 132, 18, { rdelay: true }),
      stamp("_candy", 182, 28, { rdelay: true })),
  ].flat()
}
scene("banner_day", { w: W, h: H }, ...village(false))
scene("banner_night", { w: W, h: H }, ...village(true))

// ---------------------------------------------------------------- quest icons (16x16 + outline)
const ICON = { w: 16, h: 16, outline: "k" }
sprite("icon_lastlight", ICON, (c) => {   // lantern
  c.rect(5, 0, 6, 2, "C"); c.ring(8, 1, 1, "C")
  c.rect(3, 2, 10, 2, "c"); c.rect(4, 4, 8, 9, "y"); c.rect(6, 6, 4, 5, "w")
  c.vline(4, 4, 9, "Y"); c.vline(11, 4, 9, "Y"); c.rect(3, 13, 10, 3, "c")
  c.px(8, 8, "p")
})
sprite("icon_mtc", ICON, (c) => {        // tank
  c.rect(6, 4, 6, 4, "M"); c.hline(11, 5, 5, "c")
  c.rect(1, 8, 14, 4, "m"); c.rect(0, 12, 16, 4, "C")
  for (let x = 1; x < 16; x += 3) c.px(x, 13, "o")
  c.px(8, 9, "y")
})
sprite("icon_choocream", ICON, (c) => {  // ice cream
  c.circ(8, 4, 4, "q"); c.circ(8, 8, 5, "p"); c.px(6, 2, "w"); c.px(5, 6, "w")
  c.poly([3, 10, 13, 10, 8, 16], "Y"); c.line(5, 11, 8, 14, "o"); c.line(11, 11, 8, 14, "o")
  c.px(10, 6, "m"); c.px(7, 8, "y")
})
sprite("icon_static", ICON, (c) => {     // lightning
  c.poly([9, 0, 2, 9, 7, 9, 5, 16, 14, 6, 9, 6, 12, 0], "y")
  c.poly([9, 1, 5, 7, 7, 7], "w"); c.px(1, 2, "v"); c.px(14, 12, "v")
})
sprite("icon_shoulder", ICON, (c) => {   // eye
  c.ellipse(8, 8, 8, 5, "w"); c.circ(8, 8, 4, "v"); c.circ(8, 8, 2, "k"); c.px(7, 6, "w")
})
sprite("icon_flood", ICON, (c) => {      // drop over wave
  c.circ(8, 9, 5, "m"); c.poly([3, 8, 8, 0, 13, 8], "m"); c.px(6, 7, "n"); c.px(6, 8, "n")
  c.hline(0, 15, 16, "M"); c.px(2, 14, "M"); c.px(10, 14, "M")
})
sprite("icon_warehouse", ICON, (c) => {  // 3d box
  c.poly([8, 0, 16, 4, 8, 8, 0, 4], "y"); c.poly([0, 4, 8, 8, 8, 16, 0, 12], "Y")
  c.poly([16, 4, 8, 8, 8, 16, 16, 12], "o"); c.line(4, 2, 12, 6, "C")
})
sprite("icon_rescue", ICON, (c) => {     // boat
  c.poly([0, 9, 16, 9, 13, 14, 3, 14], "p"); c.hline(1, 10, 14, "q")
  c.vline(8, 1, 8, "c"); c.poly([9, 1, 9, 8, 14, 8], "w")
  c.hline(0, 15, 16, "m")
})
sprite("icon_booking", ICON, (c) => {    // calendar
  c.rect(0, 2, 16, 14, "w"); c.rect(0, 2, 16, 4, "v"); c.rect(3, 0, 2, 4, "c"); c.rect(11, 0, 2, 4, "c")
  for (let y = 8; y < 15; y += 3) for (let x = 2; x < 15; x += 4) c.rect(x, y, 2, 2, "u")
  c.rect(10, 11, 2, 2, "p")
})
sprite("icon_molly", ICON, (c) => {      // wizard hat
  c.poly([8, 0, 2, 12, 14, 12], "V"); c.poly([8, 0, 8, 12, 14, 12], "v")
  c.rect(0, 12, 16, 3, "V"); c.px(7, 6, "y"); c.px(10, 9, "y"); c.px(5, 10, "w")
})
sprite("icon_health", ICON, (c) => {     // heart + cross
  c.circ(4, 5, 4, "p"); c.circ(11, 5, 4, "p"); c.poly([0, 6, 16, 6, 8, 15], "p")
  c.rect(6, 4, 3, 7, "w"); c.rect(4, 6, 7, 3, "w"); c.px(2, 3, "q")
})
sprite("icon_trat", ICON, (c) => {       // palm island
  c.ellipse(8, 14, 8, 2, "y"); c.line(8, 13, 7, 4, "C", 2)
  c.ellipse(4, 4, 4, 2, "M"); c.ellipse(11, 4, 4, 2, "M"); c.ellipse(7, 2, 3, 2, "m")
  c.px(8, 6, "c")
})
sheet("icons", ["icon_*"], { pad: 2 })

// ---------------------------------------------------------------- candy garden (16x16 + outline)
const PLOT = { w: 16, h: 16, outline: "k" }
const soil = (c) => { c.rect(0, 11, 16, 5, "C"); c.hline(0, 11, 16, "o"); c.px(3, 13, "c"); c.px(11, 14, "c"); c.px(7, 15, "c") }
sprite("plot_empty", PLOT, soil, (c) => { c.px(5, 12, "w"); c.px(10, 12, "w") })
sprite("plot_sprout", PLOT, soil, (c) => {
  c.vline(8, 6, 6, "M"); c.ellipse(6, 6, 2, 1, "m"); c.ellipse(10, 5, 2, 1, "m")
})
sprite("plot_lolly_grow", PLOT, soil, (c) => { c.vline(8, 6, 6, "w"); c.circ(8, 4, 3, "q"); c.px(8, 4, "p") })
sprite("plot_lolly_ripe", PLOT, soil, (c) => {
  c.vline(8, 8, 4, "w"); c.circ(8, 4, 4, "p"); c.ring(8, 4, 2, "w"); c.px(8, 4, "P"); c.px(6, 2, "w")
})
sprite("plot_cupcake_grow", PLOT, soil, (c) => { c.rect(5, 8, 6, 4, "u"); c.ellipse(8, 7, 3, 2, "w") })
sprite("plot_cupcake_ripe", PLOT, soil, (c) => {
  c.poly([3, 6, 13, 6, 11, 12, 5, 12], "v"); c.vline(6, 7, 5, "V"); c.vline(9, 7, 5, "V")
  c.ellipse(8, 4, 5, 3, "w"); c.ellipse(8, 2, 3, 2, "q"); c.px(8, 0, "P"); c.px(5, 4, "m"); c.px(11, 3, "y")
})
sprite("plot_donut_grow", PLOT, soil, (c) => { c.circ(8, 7, 4, "y"); c.circ(8, 7, 3, "w"); c.circ(8, 7, 1, "_"); c.px(6, 5, "y") })
sprite("plot_donut_ripe", PLOT, soil, (c) => {
  c.circ(8, 6, 6, "o"); c.circ(8, 5, 5, "m"); c.circ(8, 6, 2, "C"); c.circ(8, 6, 1, "_")
  c.px(5, 3, "p"); c.px(11, 4, "y"); c.px(4, 7, "w"); c.px(12, 8, "p"); c.px(9, 2, "w")
})
sheet("garden", ["plot_*"], { pad: 2 })
