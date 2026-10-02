<svg
  class="hero-artwork"
  viewBox="0 0 360 320"
  fill="none"
  aria-hidden="true"
  focusable="false"
>
  <path d="M27 42h14M34 35v14M315 266h18M324 257v18" class="registration" />
  <path d="M64 57 232 40l25 210-171 17z" class="pink-sheet" />
  <path
    d="m80 79 117-12M83 99l82-8M88 191l112-12M91 210l78-8"
    class="pink-rules"
  />
  <path d="m112 54 176 13-17 213-177-14z" class="blue-sheet" />
  <path d="M138 99h103M136 115h72" class="paper-lines" />
  <path d="m144 190 38-41 29 28 23-27 29 34" class="ink-lines" />
  <circle cx="160" cy="135" r="10" class="pink-dot" />
  <circle cx="220" cy="238" r="23" class="ink-ring" />
  <path d="M214 238h12m-6-6v12" class="crosshair" />
</svg>

<style>
  .hero-artwork {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .pink-sheet,
  .blue-sheet {
    stroke: var(--ink);
    stroke-width: 2;
    stroke-linejoin: round;
  }

  .pink-sheet {
    fill: var(--riso-pink);
  }

  .blue-sheet {
    fill: var(--riso-blue);
  }

  .pink-rules,
  .ink-lines,
  .registration,
  .crosshair {
    stroke: var(--ink);
    stroke-linecap: square;
    stroke-linejoin: round;
  }

  .pink-rules {
    stroke-width: 4;
  }

  .paper-lines {
    stroke: var(--paper-raised);
    stroke-width: 5;
    stroke-linecap: square;
  }

  .ink-lines {
    stroke-width: 3;
  }

  .pink-dot {
    fill: var(--riso-pink);
    stroke: var(--ink);
    stroke-width: 2;
  }

  .ink-ring {
    fill: var(--paper-raised);
    stroke: var(--ink);
    stroke-width: 2;
  }

  .registration,
  .crosshair {
    stroke-width: 2;
  }
</style>
