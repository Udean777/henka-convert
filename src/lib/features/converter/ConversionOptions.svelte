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
    imageCapabilitiesReady: boolean;
    imageFormatsAvailable: boolean;
    hasSvgInput: boolean;
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
    imageCapabilitiesReady,
    imageFormatsAvailable,
    hasSvgInput,
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
        disabled={busy || (kind === "image" && !imageCapabilitiesReady)}
        onchange={(event) => onTargetChange(event.currentTarget.value)}
      >
        {#if kind === "image" && formats.length === 0}
          <option value={target} disabled>
            {imageCapabilitiesReady
              ? text.imageFormatUnavailableShort
              : text.checkingImageFormats}
          </option>
        {/if}
        {#each formats as format (format.value)}
          <option value={format.value}>{format.label}</option>
        {/each}
      </select>
    </label>
    {#if kind === "image" && target !== "image/png"}
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
  {#if kind === "image" && hasSvgInput}
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
  {#if kind === "image" && target === "image/jpeg"}
    <p class="max-w-sm text-xs leading-5 text-muted">
      {text.transparencyNote}
    </p>
  {/if}
</div>

{#if kind === "image" && !imageCapabilitiesReady}
  <p class="mt-3 text-sm leading-6 text-muted" role="status">
    {text.checkingImageFormats}
  </p>
{:else if kind === "image" && !imageFormatsAvailable}
  <p class="mt-3 text-sm leading-6 text-muted" role="status">
    {text.imageFormatsUnavailable}
  </p>
{/if}

{#if kind === "pdf" && target === "text/plain"}
  <p class="mt-3 text-sm leading-6 text-muted">{text.pdfTextNote}</p>
{:else if kind === "docx"}
  <p class="mt-3 text-sm leading-6 text-muted">{text.docxNote}</p>
{/if}
