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
  class="file-dropzone {dragging ? 'is-dragging' : ''}"
  class:is-disabled={disabled}
  ondragover={(event) => {
    event.preventDefault();
    if (!disabled) dragging = true;
  }}
  ondragleave={() => (dragging = false)}
  ondrop={onDrop}
  role="region"
  aria-label={labels.drop}
>
  <div class="drop-content">
    <div class="registration-art" aria-hidden="true">
      <span class="registration-sheet sheet-blue"></span>
      <span class="registration-sheet sheet-pink"></span>
      <span class="registration-cross">+</span>
    </div>
    <p class="drop-title">{labels.drop}</p>
    <label class="browse-button">
      {labels.choose}
      <input
        class="visually-hidden"
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
    <p class="supported-formats">{labels.formats}</p>
  </div>
</div>

<style>
  .file-dropzone {
    position: relative;
    display: grid;
    min-height: 250px;
    place-items: center;
    overflow: hidden;
    border: 1px dashed var(--riso-blue);
    background: var(--paper);
    padding: 2rem 1.25rem;
    text-align: center;
    transition:
      background-color 120ms ease,
      border-color 120ms ease;
  }

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

  .file-dropzone.is-dragging {
    border-style: solid;
    background: var(--riso-blue-soft);
  }

  .file-dropzone.is-disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  .drop-content {
    display: flex;
    max-width: 38rem;
    flex-direction: column;
    align-items: center;
  }

  .registration-art {
    position: relative;
    width: 4.25rem;
    height: 3.5rem;
    margin-bottom: 1rem;
  }

  .registration-sheet {
    position: absolute;
    width: 2rem;
    height: 2.6rem;
    border: 1px solid var(--ink);
  }

  .sheet-blue {
    top: 0.2rem;
    left: 0.65rem;
    background: var(--riso-blue);
    transform: rotate(-9deg);
  }

  .sheet-pink {
    top: 0.55rem;
    left: 1.8rem;
    background: var(--riso-pink);
    transform: rotate(10deg);
  }

  .registration-cross {
    position: absolute;
    right: 0;
    bottom: -0.1rem;
    color: var(--ink);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1rem;
    font-weight: 700;
  }

  .drop-title {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.25rem, 3vw, 1.8rem);
    font-weight: 700;
    letter-spacing: -0.035em;
  }

  .browse-button {
    display: inline-flex;
    min-height: 2.9rem;
    align-items: center;
    justify-content: center;
    margin-top: 1.15rem;
    border: 1px solid var(--ink);
    background: var(--riso-pink);
    padding: 0.7rem 1.1rem;
    color: #201e1e;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 800;
    transition:
      background-color 120ms ease,
      transform 120ms ease;
  }

  .browse-button:hover {
    background: var(--riso-blue-soft);
    transform: translate(-1px, -1px);
  }

  .browse-button:has(input:focus-visible) {
    outline: 3px solid var(--riso-pink);
    outline-offset: 3px;
  }

  .browse-button:has(:disabled) {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
  }

  .supported-formats {
    margin: 1rem 0 0;
    color: var(--ink-muted);
    font-size: 0.76rem;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    .file-dropzone {
      min-height: 220px;
      padding-inline: 1rem;
    }
  }
</style>
