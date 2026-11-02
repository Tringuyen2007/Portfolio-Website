"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Bud, Leaf, Rose, Thorns } from "@/components/botanical/flora";

/**
 * Decorative climbing roses around the hero portrait.
 *
 * The portrait is an arch (4:5, semicircular top). This SVG sits in a box that
 * extends 12.5% beyond the portrait on each side, 5% above and 12% below, so
 * the viewBox maps to that box: portrait = x 50..450, y 25..525, thorny stem
 * runs below it (y ≈ 550).
 */
const LEFT_VINE =
  "M28 560 C10 500 26 440 44 392 C60 350 40 300 48 250 C56 200 78 150 110 110 C140 72 180 50 232 34";
const RIGHT_VINE =
  "M472 548 C488 500 468 450 452 400 C438 356 462 300 452 250 C444 200 420 150 388 110 C360 76 320 48 270 34";
const GROUND_STEM = "M18 556 C120 540 230 568 330 552 C390 542 440 556 486 548";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PortraitVines() {
  const reduce = useReducedMotion();
  const draw = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.6, delay, ease: EASE },
        };
  const bloom = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, scale: 0.4 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-[12.5%] -top-[5%] -bottom-[12%] h-auto w-[125%] overflow-visible"
      viewBox="0 0 500 585"
    >
      <defs>
        <linearGradient id="vine-stem" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="var(--bark-deep)" />
          <stop offset="0.45" stopColor="var(--leaf-deep)" />
          <stop offset="1" stopColor="var(--leaf)" />
        </linearGradient>
      </defs>

      {/* stems */}
      <motion.path
        d={LEFT_VINE}
        fill="none"
        stroke="url(#vine-stem)"
        strokeLinecap="round"
        strokeWidth="3.2"
        {...draw(0.4)}
      />
      <motion.path
        d={RIGHT_VINE}
        fill="none"
        stroke="url(#vine-stem)"
        strokeLinecap="round"
        strokeWidth="3.2"
        {...draw(0.55)}
      />
      <motion.path
        d={GROUND_STEM}
        fill="none"
        stroke="var(--bark)"
        strokeLinecap="round"
        strokeWidth="3.4"
        {...draw(0.3)}
      />

      {/* thorns along the ground stem (roses have thorns) */}
      <motion.g {...bloom(1.0)} style={{ transformOrigin: "250px 556px" }}>
        <Thorns
          points={[
            [48, 553],
            [78, 550],
            [112, 548],
            [150, 550],
            [184, 555],
            [214, 559],
            [258, 560],
            [296, 557],
            [334, 551],
            [368, 547],
            [404, 548],
            [440, 553],
            [466, 551],
          ]}
          size={1.3}
        />
      </motion.g>

      {/* leaves: left vine */}
      <motion.g {...bloom(1.1)} style={{ transformOrigin: "40px 400px" }}>
        <Leaf flip rotate={-70} size={0.9} x={36} y={470} />
        <Leaf rotate={60} size={0.8} x={44} y={410} />
        <Leaf flip rotate={-58} size={1} x={42} y={330} />
        <Leaf rotate={52} size={0.85} x={52} y={262} />
        <Leaf flip rotate={-30} size={0.95} x={76} y={168} />
        <Leaf rotate={40} size={0.8} x={126} y={100} />
        <Leaf flip rotate={-10} size={0.85} x={196} y={48} />
      </motion.g>

      {/* leaves: right vine */}
      <motion.g {...bloom(1.25)} style={{ transformOrigin: "460px 400px" }}>
        <Leaf rotate={62} size={0.9} x={466} y={470} />
        <Leaf flip rotate={-64} size={0.8} x={456} y={410} />
        <Leaf rotate={54} size={1} x={458} y={330} />
        <Leaf flip rotate={-48} size={0.85} x={448} y={262} />
        <Leaf rotate={28} size={0.95} x={426} y={168} />
        <Leaf flip rotate={-42} size={0.8} x={372} y={96} />
        <Leaf rotate={12} size={0.85} x={300} y={46} />
      </motion.g>

      {/* roses on the climbing vines */}
      <motion.g {...bloom(1.4)} style={{ transformOrigin: "46px 372px" }}>
        <Rose rotate={-12} size={1.05} x={46} y={372} />
      </motion.g>
      <motion.g {...bloom(1.55)} style={{ transformOrigin: "98px 126px" }}>
        <Rose rotate={20} size={0.8} tone="blossom" x={98} y={126} />
      </motion.g>
      <motion.g {...bloom(1.7)} style={{ transformOrigin: "250px 30px" }}>
        <Rose rotate={0} size={1.1} x={250} y={30} />
      </motion.g>
      <motion.g {...bloom(1.6)} style={{ transformOrigin: "456px 296px" }}>
        <Rose rotate={14} size={0.95} x={456} y={296} />
      </motion.g>
      <motion.g {...bloom(1.45)} style={{ transformOrigin: "408px 128px" }}>
        <Rose rotate={-18} size={0.75} tone="blossom" x={408} y={128} />
      </motion.g>

      {/* buds */}
      <motion.g {...bloom(1.3)} style={{ transformOrigin: "60px 230px" }}>
        <Bud rotate={-40} size={0.8} x={60} y={230} />
        <Bud rotate={38} size={0.8} tone="blossom" x={444} y={212} />
        <Bud rotate={-22} size={0.7} x={168} y={62} />
        <Bud rotate={26} size={0.7} tone="blossom" x={336} y={62} />
      </motion.g>

      {/* roses along the thorny ground stem */}
      <motion.g {...bloom(1.2)} style={{ transformOrigin: "250px 556px" }}>
        <Rose rotate={8} size={1.15} x={92} y={548} />
        <Bud rotate={-28} size={0.85} x={140} y={548} />
        <Rose rotate={-6} size={0.9} tone="blossom" x={236} y={562} />
        <Rose rotate={12} size={1.2} x={360} y={548} />
        <Bud rotate={32} size={0.85} tone="blossom" x={420} y={550} />
        <Leaf flip rotate={-96} size={0.8} x={62} y={556} />
        <Leaf rotate={100} size={0.8} x={176} y={556} />
        <Leaf flip rotate={-82} size={0.8} x={296} y={558} />
        <Leaf rotate={92} size={0.8} x={456} y={550} />
      </motion.g>
    </svg>
  );
}
