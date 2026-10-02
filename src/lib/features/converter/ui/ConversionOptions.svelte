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

<div
  class="mt-4 flex flex-wrap items-end justify-between gap-5 border-y border-rule py-[1.15rem] max-[640px]:flex-col max-[640px]:items-stretch"
>
  <div
    class="flex flex-1 flex-wrap items-end gap-5 max-[640px]:flex-col max-[640px]:items-stretch"
  >
    <label
      class="flex min-w-[min(100%,14rem)] flex-col gap-[0.45rem] text-[0.82rem] font-bold max-[640px]:w-full max-[640px]:min-w-0"
    >
      {text.convertTo}
      <select
        class="min-h-[2.8rem] max-w-full border border-ink bg-paper-raised px-3 py-[0.65rem] text-[0.9rem] font-normal text-ink"
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
      <label
        class="flex min-w-44 flex-col gap-[0.45rem] text-[0.82rem] font-bold max-[640px]:w-full max-[640px]:min-w-0"
      >
        {text.quality}
        <span class="font-normal text-ink-muted"
          >{Math.round(quality * 100)}%</span
        >
        <input
          class="w-full accent-riso-pink"
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
    <label
      class="flex min-w-[min(100%,14rem)] flex-col gap-[0.45rem] text-[0.82rem] font-bold max-[640px]:w-full max-[640px]:min-w-0"
    >
      {text.svgWidth}
      <span class="flex items-center gap-2">
        <input
          class="min-h-[2.8rem] w-28 max-w-full border border-ink bg-paper-raised px-3 py-[0.65rem] text-[0.9rem] font-normal text-ink"
          type="number"
          min="1"
          max="4096"
          step="1"
          value={svgOutputWidth}
          disabled={busy}
          oninput={(event) =>
            onSvgOutputWidthChange(Number(event.currentTarget.value))}
        />
        <span class="text-xs font-normal text-ink-muted">px</span>
      </span>
      <span class="max-w-xs text-xs font-normal leading-5 text-ink-muted"
        >{text.svgWidthHint}</span
      >
    </label>
  {/if}
</div>

{#if kind === "pdf" && target === "text/plain"}
  <p class="mt-3 text-sm leading-6 text-ink-muted">{text.pdfTextNote}</p>
{:else if kind === "pdf"}
  <p class="mt-3 text-sm leading-6 text-ink-muted">{text.pdfOutput}</p>
{:else if kind === "image" && target === "image/svg+xml" && !hasSvgInput}
  <p class="mt-3 text-sm leading-6 text-ink-muted">{text.svgOutputNote}</p>
{:else if kind === "image" && target === "application/pdf"}
  <p class="mt-3 text-sm leading-6 text-ink-muted">{text.imagePdfNote}</p>
{:else if kind === "image" && ["image/jpeg", "image/bmp", "image/gif"].includes(target)}
  <p class="mt-3 text-sm leading-6 text-ink-muted">{text.transparencyNote}</p>
{:else if kind === "docx"}
  <p class="mt-3 text-sm leading-6 text-ink-muted">{text.docxNote}</p>
{/if}

{#if kind === "image" && hasTiffInput}
  <p class="mt-3 text-sm leading-6 text-ink-muted">{text.tiffFirstPageNote}</p>
{/if}

{#if kind === "video"}
  <p class="mt-3 text-sm leading-6 text-ink-muted">{text.videoLimitsNote}</p>
{/if}

{#if kind === "audio"}
  <p class="mt-3 text-sm leading-6 text-ink-muted">
    {text.audioLimitsNote}
    {#if target === "audio/wav"}
      <br />{text.audioWavNote}
    {/if}
  </p>
{/if}

{#if kind === "data"}
  <p class="mt-3 text-sm leading-6 text-ink-muted">
    {text.dataLimitsNote}<br />{text.dataStructureNote}
  </p>
{/if}
