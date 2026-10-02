<script lang="ts">
  import { FILE_ACCEPT } from "../shared/files";
  import type { ConverterKind } from "../shared/types";

  let {
    kind,
    disabled = false,
    labels,
    onFiles,
  }: {
    kind: ConverterKind;
    disabled?: boolean;
    labels: { drop: string; choose: string; formats: string };
    onFiles: (files: File[]) => void;
  } = $props();

  let dragging = $state(false);

  function receive(files: FileList | null) {
    if (files?.length) onFiles(Array.from(files));
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    dragging = false;
    if (!disabled) receive(event.dataTransfer?.files ?? null);
  }
</script>

<div
  class="file-dropzone relative grid min-h-[250px] place-items-center overflow-hidden border border-dashed border-riso-blue bg-paper px-5 py-8 text-center transition-colors max-[480px]:min-h-[220px] max-[480px]:px-4 {dragging
    ? 'border-solid bg-riso-blue-soft'
    : ''} {disabled ? 'cursor-not-allowed opacity-[0.65]' : ''}"
  ondragover={(event) => {
    event.preventDefault();
    if (!disabled) dragging = true;
  }}
  ondragleave={() => (dragging = false)}
  ondrop={onDrop}
  role="region"
  aria-label={labels.drop}
>
  <div class="flex max-w-[38rem] flex-col items-center">
    <div class="relative mb-4 h-14 w-[4.25rem]" aria-hidden="true">
      <span
        class="absolute left-[0.65rem] top-[0.2rem] h-[2.6rem] w-8 border border-ink bg-riso-blue rotate-[-9deg]"
      ></span>
      <span
        class="absolute left-[1.8rem] top-[0.55rem] h-[2.6rem] w-8 border border-ink bg-riso-pink rotate-[10deg]"
      ></span>
      <span
        class="absolute right-0 bottom-[-0.1rem] font-display text-base font-bold text-ink"
        >+</span
      >
    </div>
    <p
      class="m-0 font-display text-[clamp(1.25rem,3vw,1.8rem)] font-bold tracking-[-0.035em]"
    >
      {labels.drop}
    </p>
    <label
      class="mt-[1.15rem] inline-flex min-h-[2.9rem] cursor-pointer items-center justify-center border border-ink bg-riso-pink px-[1.1rem] py-[0.7rem] text-[0.88rem] font-extrabold text-[#201e1e] transition-[background-color,transform] hover:bg-riso-blue-soft hover:-translate-x-px hover:-translate-y-px has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-riso-pink has-[:focus-visible]:outline-offset-[3px] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-55 active:translate-y-px active:scale-[0.985]"
    >
      {labels.choose}
      <input
        class="sr-only"
        type="file"
        accept={FILE_ACCEPT[kind]}
        multiple
        {disabled}
        onchange={(event) => {
          receive(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />
    </label>
    <p class="mt-4 text-[0.76rem] leading-6 text-ink-muted">{labels.formats}</p>
  </div>
</div>

<style>
  .file-dropzone::before,
  .file-dropzone::after {
    position: absolute;
    width: 14px;
    height: 14px;
    border-color: var(--riso-pink);
    border-style: solid;
    content: "";
  }

  .file-dropzone::before {
    top: 0.85rem;
    left: 0.85rem;
    border-width: 1px 0 0 1px;
  }

  .file-dropzone::after {
    right: 0.85rem;
    bottom: 0.85rem;
    border-width: 0 1px 1px 0;
  }
</style>
