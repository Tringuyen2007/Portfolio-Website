/**
 * The only runtime entry into pixi.js. Callers `await import()` this module
 * instead of `import("pixi.js")` directly: a dynamic import of the package
 * namespace cannot be tree-shaken (the whole ~240 kB gz barrel ships), while
 * these static named re-exports let the bundler keep only what the stages use.
 * Add a name here before using it in a stage.
 */
export {
  Application,
  Assets,
  Container,
  Sprite,
  Texture,
  TextureSource,
  TilingSprite,
} from "pixi.js";
