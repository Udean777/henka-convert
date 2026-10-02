# Henka Convert visual direction

## Identity

Henka is a local file-conversion workbench. Its visual character borrows from
risograph print production: warm paper, dark ink, overprinted blue and pink,
and registration marks that echo the act of changing a file from one format to
another. The result should feel like a practical tool with a printed identity,
not a poster wrapped around an interface.

The mark is a single letter H set in offset blue and pink registration blocks.

Design Read: a browser utility for everyday file conversions, in a risograph
workbench visual language, with ENERGY 3 / RHYTHM 3 / MOTION 1.

## Palette

| Token        | Light value | Purpose                                             |
| ------------ | ----------- | --------------------------------------------------- |
| Paper        | `#F3E7CC`   | Main page background                                |
| Raised paper | `#FFF9ED`   | Work surfaces and controls                          |
| Ink          | `#201E1E`   | Main text and key outlines                          |
| Muted ink    | `#625B55`   | Supporting information                              |
| Rule         | `#CFC2A7`   | Dividers and secondary boundaries                   |
| Ultramarine  | `#3454E8`   | Selected converter and progress                     |
| Riso pink    | `#EF4B87`   | Primary conversion actions and transformation marks |

Dark mode keeps the same identity with ink-toned surfaces and lighter blue and
pink inks. Success and error colors remain reserved for actual job states.

## Type and composition

- Editorial serif headlines paired with a readable system sans-serif for the
  controls and longer instructions.
- Small tracked uppercase labels act as print-room annotations. They identify
  the workbench and file direction rather than decorate headings.
- The hero introduces the local-first workflow, then gives way to the working
  converter. No filler sections or decorative customer claims.
- Use offset print layers as the recurring brand motif. Keep controls squared
  and tactile; use elevation only where it establishes a real surface.
- Keep the converter and file states as the main focus. Color identifies
  selection, conversion, and real status rather than every category at once.
- Use inline SVG for the hero print artwork, conversion illustration, and format
  pictograms. Draw with shared theme tokens so artwork follows light and dark
  mode; keep decorative SVGs hidden from assistive technology.

## Motion and liveliness

- ENERGY 3. The printed color overlaps and strong type provide the energy.
- RHYTHM 3. Hero, work surface, and file list use different compositions.
- MOTION 1. Use brief interaction feedback only; no automatic looping.
- Respect `prefers-reduced-motion` and preserve visible keyboard focus.
