// Project preview scenes, 32×24 px each. One scene per project slug.
// Each export: { frames: [grid, grid?], loop: ms }. Frame 2 (if any) is the
// animated alternate; the Pixi scene interpolates discrete sprite swaps, never tweens.
// Content is derived from the real project descriptions in content/projects/*.mdx.

const vision0 = [
  "B...B...B...B...B...B...B...B...",
  "................................",
  "B...B...B...B.sssssssssss...B...",
  "..............s.........s.......",
  "B...B...B...Bks.........s...B...",
  ".........kkkkks.........s.......",
  "B...B...kRRRRRks........s...B...",
  ".......kRRRRRRRks.......s.......",
  "B...B.kRRRRRRRRRks......s...B...",
  ".....kRRRRRRRRRRRks.....s.......",
  "B...kkkkkkkkkkkkkkks....s...B...",
  ".....kcccccccccccck.sssssss.....",
  "B...Bkccyyccccyycck.....B...B...",
  ".....kccyyccccyycck.............",
  "B...Bkcccccccccccck.....B...B...",
  ".....kcccccTTTcccck.............",
  "B...Bkcccc.TTTcccck.....B...B...",
  ".....kccccTTyTcccck.............",
  "B...BkccccTTTTcccck.....B...B...",
  ".....kkkkkkkkkkkkkk.............",
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "................................",
  "..........XXX...................",
];
// frame 2: the blueprint box has become a built extension (wireframe → solid)
const vision1 = vision0.map((row, y) =>
  y >= 2 && y <= 11 ? row.replace(/s/g, "c").replace(/(?<=k)c+(?=c)/, (m) => m) : row,
);

const mira0 = [
  "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
  "kddddddddddddddddddddddddddddddk",
  "kd.........................rr.dk",
  "kd........................rrrrdk",
  "kd.......kkk..............rrrrdk",
  "kd......kiiik..............rr.dk",
  "kd......kiiik...............r.dk",
  "kd.......kkk..................dk",
  "kd........s.......ggggg.......dk",
  "kd......ssssss....g...g.......dk",
  "kd.....ss.s..ss...g.l.g.......dk",
  "kd....ss..s...ss..g.l.g.......dk",
  "kd....s...s....s..g.l.g.......dk",
  "kd........s.......g.l.g.......dk",
  "kd.......sss......g.l.g.......dk",
  "kd......ss.ss.....g.l.g.......dk",
  "kd.....ss...ss....g.l.g.......dk",
  "kd....ss.....ss...g.l.g.......dk",
  "kd....s.......s...ggggg.......dk",
  "kd............................dk",
  "kd..c.c..ccc.ccc..............dk",
  "kd..c.c..c.c.c................dk",
  "kddddddddddddddddddddddddddddddk",
  "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
];
// frame 2: squat — knees bend, bar fills higher, heart smaller (beat)
const mira1 = [
  "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
  "kddddddddddddddddddddddddddddddk",
  "kd............................dk",
  "kd.........................rr.dk",
  "kd........................rrrrdk",
  "kd.........................rr.dk",
  "kd......kkk.................r.dk",
  "kd.....kiiik..................dk",
  "kd.....kiiik......ggggg.......dk",
  "kd......kkk.......g.l.g.......dk",
  "kd.......s........g.l.g.......dk",
  "kd....sssssss.....g.l.g.......dk",
  "kd...ss..s..ss....g.l.g.......dk",
  "kd...s...s...s....g.l.g.......dk",
  "kd.......s........g.l.g.......dk",
  "kd......sss.......g.l.g.......dk",
  "kd.....ss.ss......g.l.g.......dk",
  "kd....ss...ss.....g.l.g.......dk",
  "kd....s.....s.....ggggg.......dk",
  "kd............................dk",
  "kd..c.c..ccc.ccc..............dk",
  "kd..c.c..c.c.c................dk",
  "kddddddddddddddddddddddddddddddk",
  "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
];

const radar0 = [
  "................................",
  "......s.........................",
  ".....s.s........................",
  "....s...s.......................",
  "...s..s..s......................",
  "......s.........................",
  "...........kkkkkkkkkk...........",
  "..........kRRRRRRRRRRk..........",
  ".........kRRRRRRRRRRRRk.........",
  "........kRRRRRRRRRRRRRRk........",
  ".......kRRRRRRRRRRRRRRRRk.......",
  "......kkkkkkkkkkkkkkkkkkkk......",
  "......kccccccccccccccccccck.....",
  "......kcc.kkkkkkkk.ccccccck.....",
  "......kcc.kddddddk.cyyycck......",
  "......kcc.kddddddk.cyyycck......",
  "......kcc.kddddddk.ccccccck.....",
  "......kcc.kkkkkkkk.ccccccck.....",
  "......kcccccccccccccccTTTck.....",
  "......kcccccccccccccccTTTck.....",
  "......kkkkkkkkkkkkkkkkkkkkk.....",
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "................................",
];
// frame 2: Wi-Fi arcs fade, shutter slides up revealing the camera lens
const radar1 = radar0.map((row, y) => {
  if (y <= 5) return row.replace(/s/g, ".");
  if (y === 14) return "......kcc.kddbbddk.cyyycck......";
  if (y === 15) return "......kcc.kdbssbdk.cyyycck......";
  if (y === 16) return "......kcc.kddbbddk.ccccccck.....";
  return row;
});

const larpcity0 = [
  "................................",
  "...............YY...............",
  "..............YXXY..............",
  "..............YXZY..............",
  "...............YY...............",
  "................................",
  "..........kkkk..................",
  ".........kbbbbk.......kkkk......",
  "........kbbbbbbk.....kgggk......",
  ".......kbbybbybbk...kgygygk.....",
  "......kbbbbbbbbbbk.kgggggggk....",
  "......kbybbybbybbk.kgygygygk....",
  "......kbbbbbbbbbbk.kgggggggk....",
  "......kbybbybbybbk.kgygygygk....",
  "...kkkkbbbbbbbbbbkkkgggggggk....",
  "..kooookbybbybbybkookgygygk.....",
  ".koooooookbbbbbbkoooookgggk.....",
  ".koyooyoookkkkkkkooooookkk......",
  ".koooooooooooooooooooook........",
  ".koyooyooooyooyooooooook........",
  ".kkkkkkkkkkkkkkkkkkkkkkk........",
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "................................",
];
// frame 2: coin bobs down one pixel; some windows switch off/on
const larpcity1 = larpcity0.map((row, y) => {
  if (y === 1) return "................................";
  if (y === 2) return "...............YY...............";
  if (y === 3) return "..............YXXY..............";
  if (y === 4) return "..............YXZY..............";
  if (y === 5) return "...............YY...............";
  if (y === 9) return ".......kbbbbbbybbk...kgggygk....";
  if (y === 13) return "......kbbybbbbbbbk.kgygggygk....";
  return row;
});

const stochastic0 = [
  "................................",
  "..kkkkkkkk............kkkkkkkk..",
  ".kcccccccck..........kcccccccck.",
  ".kcgggggcck..........kcgggggcck.",
  ".kcccccccck..........kcccccccck.",
  ".kcgggggcck..........kcgggggcck.",
  ".kcccccccck..........kcccccccck.",
  ".kcrrrrrcck..........kcgggggcck.",
  ".kcccccccck..........kcccccccck.",
  ".kcgggggcck..........kcgggggcck.",
  ".kkkkkkkkkk..........kkkkkkkkkk.",
  ".....kk..................kk.....",
  "......kk................kk......",
  ".......kk..............kk.......",
  "........kkkk........kkkk........",
  "...........kkkkkkkkkk...........",
  "..........kcccccccccck..........",
  "..........kcgggggggcck..........",
  "..........kcccccccccck..........",
  "..........kcggglllgcck..........",
  "..........kcccccccccck..........",
  "..........kcgggggggcck..........",
  "..........kkkkkkkkkkkk..........",
  "................................",
];
// frame 2: the flagged line blinks (red ↔ yellow) and the merged line turns green
const stochastic1 = stochastic0.map((row, y) =>
  y === 7 ? row.replace("rrrrr", "yyyyy") : y === 19 ? row.replace("ggglllg", "lllllll") : row,
);

const carbonlens0 = [
  "................................",
  "........ggg.....................",
  ".......ggggg....gg..............",
  "........ggg....gggg.............",
  "...............gg...............",
  "................................",
  "..............kk................",
  "..kkk.........kk......kkkk......",
  "..kdk...kkkk..kk......kddk......",
  "..kdk...kddk..kk..kk..kddk......",
  "..kdk.kkkddkkkkkkkkkkkkddkkk....",
  "..kdkkkddddkdddddkddkdddddddk...",
  "..kdkdddydkdyddydkyykdydydydk...",
  "..kdkdddddkdddddkddkdddddddk....",
  "..kdkdydydkdyddydkyykdydydydk...",
  "..kdkdddddkdddddkddkdddddddk....",
  "..kkkkkkkkkkkkkkkkkkkkkkkkkkk...",
  "................................",
  ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.",
  ".klllllllllllllyyyyyyyyyyrrrrrk.",
  ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.",
  "..............^.................",
  "................................",
  "................................",
];
// frame 2: smoke puffs rise one row, gauge needle moves toward green
const carbonlens1 = carbonlens0.map((row, y) => {
  if (y === 0) return "........ggg.....................";
  if (y === 1) return ".......ggggg....gg..............";
  if (y === 2) return "........ggg....gggg.............";
  if (y === 3) return "...............gg...............";
  if (y === 4) return "................................";
  if (y === 21) return "..........^.....................";
  return row;
});

const datafest0 = [
  "................................",
  "..kkkkkkkkkkk...................",
  ".kcccccrccccck..................",
  ".kccccrrrcccck..................",
  ".kcccrrrrrccck..................",
  ".kccccrrrcccck..................",
  ".kcccccrccccck..................",
  ".kcccccccccccck.................",
  ".kcyyccyyccyyck.................",
  ".kcyyccyyccyyck.................",
  ".kcccccccccccck.................",
  ".kcyyccTTccyyck.................",
  ".kcyyccTTccyyck.................",
  ".kkkkkkkkkkkkkk.................",
  "...................gg...........",
  "...................gg....gg.....",
  "..............gg...gg....gg.....",
  "..............gg...gg....gg.....",
  "..............gg...gg....gg.....",
  ".........gg...gg...gg....gg.....",
  ".........gg...gg...gg....gg.....",
  "........kkkkkkkkkkkkkkkkkkkkk...",
  "................................",
  "................................",
];
// bars take their colors (risk tiers) and the tallest bar grows: frame 2
const datafest1 = datafest0.map((row, y) => {
  let r = row;
  if (y >= 14 && y <= 20) {
    r = r.replace(/gg(?=\.{3}gg\.{4}gg)/, "ll");
  }
  if (y === 13) r = "...................oo...........";
  if (y >= 14 && y <= 20) r = r.replace(/(?<=\.{19})gg/, "oo").replace(/(?<=\.{25})gg/, "rr").replace(/(?<=\.{9})gg/, "ll").replace(/(?<=\.{14})gg/, "yy");
  return r;
});

const leanify0 = [
  "...........kkkkkkkkkkk..........",
  "..........kdddddddddddk.........",
  "..........kdcccccccccdk.........",
  "..........kdcccccccccdk.........",
  "..........kdc.o.o.o.cdk.........",
  "..........kdc.o.o.o.cdk.........",
  "..........kdc.o.b.o.cdk.........",
  "..........kdc.o.b.o.cdk.........",
  "..........kdc.o.b.y.cdk.........",
  "..........kdc.o.b.y.cdk.........",
  "..........kdc.o.b.y.cdk.........",
  "..........kdc.kkkkk.cdk.........",
  "..........kdcccccccccdk.........",
  "..........kdcllmmhlllcdk........",
  "..........kdcccccccccdk.........",
  "..........kddddddddddddk........",
  "..........kdddddkkdddddk........",
  "...........kkkkkkkkkkkk.........",
  "................................",
  "................................",
  "..c.c.c.c.c.c.c.................",
  "..l.m.l.h.m.l.l.................",
  "................................",
  "................................",
];
// frame 2: today's bars (carb orange) grow on a high-carb day
const leanify1 = leanify0.map((row, y) => {
  if (y === 3) return "..........kdc.o.....cdk.........";
  if (y >= 4 && y <= 10) return row.replace("c.o.", "c.o.");
  return row;
});

const robot0 = [
  "...............k................",
  "...............k................",
  "..............krk...............",
  "...............k................",
  "..........kkkkkkkkkkk...........",
  ".........kggggggggggk...........",
  ".........kgsbbgggbbsgk..........",
  ".........kgsbbgggbbsgk..........",
  ".........kggggggggggk...........",
  ".........kggkkkkkkggk...........",
  ".........kkkkkkkkkkkk...........",
  "......kkkkddddddddddkkkk........",
  "......kggkddddddddddkggk........",
  "......kggkddyyyyyyddkggk........",
  "......kggkddyddddyddkggk........",
  "......kggkddyyyyyyddkggk........",
  "......kkkkddddddddddkkkk........",
  ".........kddddddddddk...........",
  ".........kkkkkkkkkkkk...........",
  "........kkkk......kkkk..........",
  ".......kdkkdk....kdkkdk.........",
  ".......kkddkk....kkddkk.........",
  "........kkkk......kkkk..........",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
];
// frame 2: eyes blink (shut), antenna light on, wheels rotate a quarter turn
const robot1 = robot0.map((row, y) => {
  if (y === 2) return "..............kyk...............";
  if (y === 6) return ".........kgskkgggkksgk..........";
  if (y === 7) return ".........kgsggggggggsgk.........".slice(0, 32);
  if (y === 20) return ".......kkdkdk....kkdkdk.........";
  if (y === 21) return ".......kdkkdk....kdkkdk.........";
  return row;
});

const portfolio0 = [
  ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.",
  ".kjjjjjjjjjjjjjjjjjjjjjjjjjjjjk.",
  ".kjrjyjljjjjjjjjjjjjjjjjjjjjjjk.",
  ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.",
  ".knnnnnnnnnnnnnnnnnnnnnnnnnnnnk.",
  ".knnnnnnnnnnnnnnnnnnnnnMMnnnnnk.",
  ".knnnnnnnnnnLLLLnnnnnnnMMnnnnnk.",
  ".knnnnnnnnLLLLLLLLnnnnnnnnnnnnk.",
  ".knnnnnnnLLlLLLLlLLnnnnnnnnnnnk.",
  ".knnnnnnLLLLLLLLLLLLnnnnnnnnnnk.",
  ".knnnnnnLLrLLLLLLLYLnnnnnnnnnnk.",
  ".knnnnnnnLLLLLrLLLLnnnnnnnnnnnk.",
  ".knnnnnnnnLLLLLLLLnnnnnnnnnnnnk.",
  ".knnnnnnnnnnnTTnnnnnnnnnnnnnnnk.",
  ".knnnnnnnnnnnTTnnnnnnnnnnnnnnnk.",
  ".knnnnnnnnnnnTTnnnnnnnnnnnnnnnk.",
  ".knnnnnnnnnnnTTnnnnnnnnnnnnnnnk.",
  ".kaaaaaaaaaaaaaaaaaaaaaaaaaaaak.",
  ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.",
  "................................",
  "................................",
  "......................k.........",
  "......................kk........",
  "......................kck.......",
];
// frame 2: a new apple ripens on the tree; cursor moves toward it
const portfolio1 = portfolio0.map((row, y) => {
  if (y === 9) return ".knnnnnnLLLLLLLLLrLLnnnnnnnnnnk.";
  if (y === 21) return "..................k.............";
  if (y === 22) return "..................kk............";
  if (y === 23) return "..................kck...........";
  return row;
});

export const scenes = {
  vision: { frames: [vision0, vision1], loop: 1400, title: "Blueprint to built: a parcel's buildable envelope resolves into a house" },
  mira: { frames: [mira0, mira1], loop: 700, title: "Webcam pose skeleton doing a rep; rep bar fills; heart beats" },
  radar: { frames: [radar0, radar1], loop: 1100, title: "Wi-Fi sensing arcs, then the physical shutter opens to reveal the lens" },
  larpcity: { frames: [larpcity0, larpcity1], loop: 800, title: "Isometric city blocks, windows flicker, a coin bobs" },
  stochastic: { frames: [stochastic0, stochastic1], loop: 900, title: "Two ledgers merge into one; the one ambiguous line blinks for a human" },
  carbonlens: { frames: [carbonlens0, carbonlens1], loop: 1000, title: "City skyline, smoke puffs rise, compliance gauge needle moves toward green" },
  "datafest-2026": { frames: [datafest0, datafest1], loop: 900, title: "Hospital and a readmission-risk bar chart that colors by tier" },
  leanify: { frames: [leanify0, leanify1], loop: 1200, title: "Phone with carb/protein/fat bars and a week of L/M/H day types" },
  "vending-machine-robot": { frames: [robot0, robot1], loop: 600, title: "Boxy robot blinks, antenna lights, wheels turn" },
  "portfolio-website": { frames: [portfolio0, portfolio1], loop: 1300, title: "A browser window with the tree inside; a new apple ripens; the cursor moves" },
};
