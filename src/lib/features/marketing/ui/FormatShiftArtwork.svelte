<script lang="ts">
  let {
    source,
    transform,
    result,
  }: { source: string; transform: string; result: string } = $props();
</script>

<div
  class="relative mx-auto aspect-[33/25] w-[min(100%,330px)] justify-self-center max-[760px]:w-[min(82vw,330px)]"
  aria-hidden="true"
>
  <span
    class="absolute top-[5px] left-0 z-10 text-[0.62rem] font-extrabold tracking-[0.12em] text-riso-blue uppercase"
    >{source}</span
  >
  <svg
    class="block size-full overflow-visible"
    viewBox="0 0 330 250"
    fill="none"
    focusable="false"
  >
    <path d="m77 37 125-9 17 166-126 9z" class="back-sheet" />
    <path d="m58 51 126-7 9 166-126 7z" class="front-sheet" />
    <path d="M83 87h73M81 101h54M78 173h77" class="sheet-line" />
    <path d="M213 126h55m-14-14 14 14-14 14" class="shift-arrow" />
    <path d="m248 55 35 4-4 31-35-4z" class="output-sheet" />
    <path d="m252 113 35 4-4 31-35-4z" class="output-sheet output-sheet-low" />
    <path d="m257 171 35 4-4 31-35-4z" class="output-sheet" />
    <path d="M22 36h14M29 29v14M294 221h14M301 214v14" class="crop-mark" />
  </svg>
  <span
    class="absolute top-[5px] right-0 z-10 text-[0.62rem] font-extrabold tracking-[0.12em] text-riso-pink-text uppercase"
    >{result}</span
  >
  <span
    class="absolute bottom-[-4px] left-0 z-10 text-[0.62rem] font-extrabold tracking-[0.12em] text-ink uppercase"
    >{transform}</span
  >
</div>

<style>
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
</style>
