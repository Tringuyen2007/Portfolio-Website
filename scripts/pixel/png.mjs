// Minimal PNG encoder (RGBA, no deps). Used by the pixel asset pipeline so
// sprites are authored as text grids and rendered with nearest-neighbor scaling.
import { deflateSync } from "node:zlib";

const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

/** @param {Uint8Array} rgba width*height*4 */
export function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.subarray(y * width * 4, (y + 1) * width * 4).forEach((v, i) => {
      raw[y * (width * 4 + 1) + 1 + i] = v;
    });
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** A tiny RGBA canvas with pixel helpers. */
export class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height * 4);
  }
  set(x, y, hex) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.width || y >= this.height || !hex) return;
    const [r, g, b, a] = parseHex(hex);
    const i = (y * this.width + x) * 4;
    this.data[i] = r; this.data[i + 1] = g; this.data[i + 2] = b; this.data[i + 3] = a;
  }
  /** Make one pixel fully transparent. */
  clear(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.data.fill(0, (y * this.width + x) * 4, (y * this.width + x) * 4 + 4);
  }
  get(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    const i = (y * this.width + x) * 4;
    if (this.data[i + 3] === 0) return null;
    return "#" + [0, 1, 2].map((k) => this.data[i + k].toString(16).padStart(2, "0")).join("");
  }
  fillRect(x, y, w, h, hex) {
    for (let j = 0; j < h; j += 1) for (let i = 0; i < w; i += 1) this.set(x + i, y + j, hex);
  }
  /** Filled circle; `shade(dx,dy,r)` may return a color per pixel for lighting. */
  circle(cx, cy, r, hex, shade) {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y += 1)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x += 1) {
        const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= r * r) this.set(x, y, shade ? shade(dx, dy, r) : hex);
      }
  }
  line(x0, y0, x1, y1, hex, width = 1) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let s = 0; s <= steps; s += 1) {
      const t = s / steps;
      const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
      if (width <= 1) this.set(x, y, hex);
      else this.circle(x, y, width / 2, hex);
    }
  }
  /** Paste a text-grid sprite. `.` = transparent. */
  blit(sprite, palette, ox, oy) {
    sprite.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch !== "." && ch !== " ") this.set(ox + x, oy + y, palette[ch]);
      });
    });
  }
  blitCanvas(src, ox, oy) {
    for (let y = 0; y < src.height; y += 1)
      for (let x = 0; x < src.width; x += 1) {
        const c = src.get(x, y);
        if (c) this.set(ox + x, oy + y, c);
      }
  }
  /** 1px outline around all opaque pixels (drawn into transparent neighbors). */
  outline(hex) {
    const out = [];
    for (let y = 0; y < this.height; y += 1)
      for (let x = 0; x < this.width; x += 1) {
        if (this.get(x, y)) continue;
        if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) out.push([x, y]);
      }
    out.forEach(([x, y]) => this.set(x, y, hex));
  }
  scaled(k) {
    const out = new Canvas(this.width * k, this.height * k);
    for (let y = 0; y < this.height; y += 1)
      for (let x = 0; x < this.width; x += 1) {
        const i = (y * this.width + x) * 4;
        if (this.data[i + 3] === 0) continue;
        for (let j = 0; j < k; j += 1)
          for (let l = 0; l < k; l += 1) {
            const o = ((y * k + j) * out.width + x * k + l) * 4;
            out.data[o] = this.data[i]; out.data[o + 1] = this.data[i + 1];
            out.data[o + 2] = this.data[i + 2]; out.data[o + 3] = this.data[i + 3];
          }
      }
    return out;
  }
  png() { return encodePng(this.width, this.height, this.data); }
}

export function parseHex(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? [...h].map((c) => c + c).join("") : h.slice(0, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) : 255;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
}

/** Deterministic PRNG (same as lib/tree/layout.ts) so renders are reproducible. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
