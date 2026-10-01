declare module "gifenc" {
  export interface GifEncoder {
    writeFrame(
      pixels: Uint8Array,
      width: number,
      height: number,
      options: { palette: number[][] },
    ): void;
    finish(): void;
    bytes(): Uint8Array;
  }

  export function GIFEncoder(options?: { auto?: boolean }): GifEncoder;
  export function quantize(rgba: Uint8Array, maxColors: number): number[][];
  export function applyPalette(
    rgba: Uint8Array,
    palette: number[][],
  ): Uint8Array;
}
