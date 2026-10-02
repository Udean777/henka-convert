<script lang="ts">
  let {
    source,
    transform,
    result,
  }: { source: string; transform: string; result: string } = $props();
</script>

<div class="format-shift" aria-hidden="true">
  <span class="caption caption-source">{source}</span>
  <svg viewBox="0 0 330 250" fill="none" focusable="false">
    <path d="m77 37 125-9 17 166-126 9z" class="back-sheet" />
    <path d="m58 51 126-7 9 166-126 7z" class="front-sheet" />
    <path d="M83 87h73M81 101h54M78 173h77" class="sheet-line" />
    <path d="M213 126h55m-14-14 14 14-14 14" class="shift-arrow" />
    <path d="m248 55 35 4-4 31-35-4z" class="output-sheet" />
    <path d="m252 113 35 4-4 31-35-4z" class="output-sheet output-sheet-low" />
    <path d="m257 171 35 4-4 31-35-4z" class="output-sheet" />
    <path d="M22 36h14M29 29v14M294 221h14M301 214v14" class="crop-mark" />
  </svg>
  <span class="caption caption-result">{result}</span>
  <span class="caption caption-transform">{transform}</span>
</div>

<style>
  .format-shift {
    position: relative;
    width: min(100%, 330px);
    height: 260px;
    justify-self: center;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .back-sheet,
  .front-sheet,
  .output-sheet {
    stroke: var(--ink);
    stroke-width: 2;
    stroke-linejoin: round;
  }

  .back-sheet {
    fill: var(--riso-pink);
  }

  .front-sheet {
    fill: var(--riso-blue);
  }

  .output-sheet {
    fill: var(--paper-raised);
  }

  .output-sheet-low {
    fill: var(--riso-pink);
  }

  .sheet-line,
  .shift-arrow,
  .crop-mark {
    stroke: var(--ink);
    stroke-linecap: square;
    stroke-linejoin: round;
  }

  .sheet-line {
    stroke: var(--paper-raised);
    stroke-width: 4;
  }

  .shift-arrow {
    stroke: var(--riso-pink);
    stroke-width: 3;
  }

  .crop-mark {
    stroke-width: 1.6;
  }

  .caption {
    position: absolute;
    z-index: 1;
    font-size: 0.62rem;
    font-weight: 850;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .caption-source {
    top: 5px;
    left: 0;
    color: var(--riso-blue);
  }

  .caption-result {
    top: 5px;
    right: 0;
    color: var(--riso-pink-text);
  }

  .caption-transform {
    bottom: -4px;
    left: 0;
    color: var(--ink);
  }
</style>
