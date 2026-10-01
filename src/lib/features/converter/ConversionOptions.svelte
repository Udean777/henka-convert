<script lang="ts">
  import type { ConverterKind } from "./shared/types";
  import type { WorkspaceText } from "./workspace.svelte";

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

<div
  class="mt-6 flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end sm:justify-between"
>
  <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end">
    <label class="flex flex-col gap-2 text-sm font-medium">
      {text.convertTo}
      <select
        class="min-w-56 max-w-full rounded-lg border border-border bg-background px-3 py-2.5 font-normal"
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
      <label class="flex min-w-52 flex-col gap-2 text-sm font-medium">
        {text.quality}
        <span class="font-normal text-muted">{Math.round(quality * 100)}%</span>
        <input
          class="accent-foreground"
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
    <label class="flex flex-col gap-2 text-sm font-medium">
      {text.svgWidth}
      <span class="flex items-center gap-2">
        <input
          class="w-28 rounded-lg border border-border bg-background px-3 py-2.5 font-normal"
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
