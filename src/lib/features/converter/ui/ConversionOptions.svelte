<script lang="ts">
  import type { ConverterKind } from "../shared/types";
  import type { WorkspaceText } from "../application/workspace.svelte";

  interface FormatOption {
    value: string;
    label: string;
  }

  interface Props {
    kind: ConverterKind;
    target: string;
    formats: FormatOption[];
    quality: number;
    svgOutputWidth: number;
    hasSvgInput: boolean;
    hasTiffInput: boolean;
    busy: boolean;
    text: WorkspaceText;
    onTargetChange: (value: string) => void;
    onQualityChange: (value: number) => void;
    onSvgOutputWidthChange: (value: number) => void;
  }

  let {
    kind,
    target,
    formats,
    quality,
    svgOutputWidth,
    hasSvgInput,
    hasTiffInput,
    busy,
    text,
    onTargetChange,
    onQualityChange,
    onSvgOutputWidthChange,
  }: Props = $props();
</script>

<div class="conversion-options">
  <div class="options-primary">
    <label class="option-field">
      {text.convertTo}
      <select
        class="format-select"
        value={target}
        disabled={busy}
        onchange={(event) => onTargetChange(event.currentTarget.value)}
      >
        {#each formats as format (format.value)}
          <option value={format.value}>{format.label}</option>
        {/each}
      </select>
    </label>
    {#if kind === "image" && ["image/jpeg", "image/webp", "image/avif", "image/jxl"].includes(target)}
      <label class="option-field quality-field">
        {text.quality}
        <span class="font-normal text-muted">{Math.round(quality * 100)}%</span>
        <input
          class="quality-range"
          type="range"
          min="0.5"
          max="1"
          step="0.05"
          value={quality}
          disabled={busy}
          oninput={(event) =>
            onQualityChange(Number(event.currentTarget.value))}
        />
      </label>
    {/if}
  </div>
  {#if kind === "image" && hasSvgInput && target !== "image/svg+xml"}
    <label class="option-field">
      {text.svgWidth}
      <span class="flex items-center gap-2">
        <input
          class="width-input"
          type="number"
          min="1"
          max="4096"
          step="1"
          value={svgOutputWidth}
          disabled={busy}
          oninput={(event) =>
            onSvgOutputWidthChange(Number(event.currentTarget.value))}
        />
        <span class="text-xs font-normal text-muted">px</span>
      </span>
      <span class="max-w-xs text-xs font-normal leading-5 text-muted"
        >{text.svgWidthHint}</span
      >
    </label>
  {/if}
</div>

{#if kind === "pdf" && target === "text/plain"}
  <p class="mt-3 text-sm leading-6 text-muted">{text.pdfTextNote}</p>
{:else if kind === "pdf"}
  <p class="mt-3 text-sm leading-6 text-muted">{text.pdfOutput}</p>
{:else if kind === "image" && target === "image/svg+xml" && !hasSvgInput}
  <p class="mt-3 text-sm leading-6 text-muted">{text.svgOutputNote}</p>
{:else if kind === "image" && target === "application/pdf"}
  <p class="mt-3 text-sm leading-6 text-muted">{text.imagePdfNote}</p>
{:else if kind === "image" && ["image/jpeg", "image/bmp", "image/gif"].includes(target)}
  <p class="mt-3 text-sm leading-6 text-muted">{text.transparencyNote}</p>
{:else if kind === "docx"}
  <p class="mt-3 text-sm leading-6 text-muted">{text.docxNote}</p>
{/if}

{#if kind === "image" && hasTiffInput}
  <p class="mt-3 text-sm leading-6 text-muted">{text.tiffFirstPageNote}</p>
{/if}

{#if kind === "video"}
  <p class="mt-3 text-sm leading-6 text-muted">{text.videoLimitsNote}</p>
{/if}

{#if kind === "audio"}
  <p class="mt-3 text-sm leading-6 text-muted">
    {text.audioLimitsNote}
    {#if target === "audio/wav"}
      <br />{text.audioWavNote}
    {/if}
  </p>
{/if}

{#if kind === "data"}
  <p class="mt-3 text-sm leading-6 text-muted">
    {text.dataLimitsNote}<br />{text.dataStructureNote}
  </p>
{/if}

<style>
  .conversion-options {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: space-between;
    gap: 1.25rem;
    margin-top: 1rem;
    border-block: 1px solid var(--rule);
    padding: 1.15rem 0;
  }

  .options-primary {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: end;
    gap: 1.25rem;
  }

  .option-field {
    display: flex;
    min-width: min(100%, 14rem);
    flex-direction: column;
    gap: 0.45rem;
    font-size: 0.82rem;
    font-weight: 750;
  }

  .format-select,
  .width-input {
    min-height: 2.8rem;
    max-width: 100%;
    border: 1px solid var(--ink);
    border-radius: 0;
    background: var(--paper-raised);
    padding: 0.65rem 0.75rem;
    color: var(--ink);
    font-size: 0.9rem;
    font-weight: 450;
  }

  .quality-field {
    min-width: 11rem;
  }

  .quality-range {
    width: 100%;
    accent-color: var(--riso-pink);
  }

  .width-input {
    width: 7rem;
  }

  @media (max-width: 640px) {
    .conversion-options,
    .options-primary {
      align-items: stretch;
      flex-direction: column;
    }

    .option-field,
    .quality-field {
      width: 100%;
      min-width: 0;
    }
  }
</style>
