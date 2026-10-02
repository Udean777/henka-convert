<script lang="ts">
  import { getContext } from "svelte";
  import FileDropzone from "./FileDropzone.svelte";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";
  import { messages } from "$lib/i18n/messages";
  import ConversionJobList from "./ConversionJobList.svelte";
  import ConversionOptions from "./ConversionOptions.svelte";
  import { DOCUMENT_FORMAT_OPTIONS } from "../documents/formats";
  import { PDF_OUTPUT_FORMATS } from "../pdf/formats";
  import { IMAGE_OUTPUT_FORMATS } from "../image/formats";
  import { VIDEO_FORMAT_OPTIONS } from "../video/formats";
  import { AUDIO_FORMAT_OPTIONS } from "../audio/formats";
  import { DATA_FORMAT_OPTIONS } from "../data/formats";
  import { downloadBlob, downloadOutputs } from "../shared/download";
  import type { ConverterKind, FileJob } from "../shared/types";
  import { createConverterWorkspace } from "../application/workspace.svelte";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const workspace = createConverterWorkspace(
    () => messages[preferences.language],
    () => preferences.language,
  );
  const state = workspace.state;
  const text = $derived(messages[preferences.language]);
  const kinds: ConverterKind[] = [
    "image",
    "pdf",
    "docx",
    "video",
    "audio",
    "data",
  ];
  const currentJobs = $derived(workspace.currentJobs());
  const finishedOutputs = $derived(workspace.finishedOutputs());
  const busy = $derived(workspace.busy());
  const hasSvgInput = $derived(
    currentJobs.some(
      (job) =>
        /\.svg$/i.test(job.file.name) || job.file.type === "image/svg+xml",
    ),
  );
  const hasTiffInput = $derived(
    currentJobs.some((job) => /\.tiff?$/i.test(job.file.name)),
  );
  const formats = $derived.by(() => {
    if (state.kind === "image") {
      return IMAGE_OUTPUT_FORMATS;
    }
    if (state.kind === "pdf") return PDF_OUTPUT_FORMATS;
    if (state.kind === "docx") return DOCUMENT_FORMAT_OPTIONS;
    if (state.kind === "video") return VIDEO_FORMAT_OPTIONS;
    if (state.kind === "audio") return AUDIO_FORMAT_OPTIONS;
    return DATA_FORMAT_OPTIONS;
  });
  const canConvert = $derived(
    !currentJobs.some(
      (job) =>
        job.worksheetNamesLoading ||
        (job.worksheetNames !== undefined &&
          job.worksheetNames.length > 1 &&
          !job.selectedWorksheet),
    ) &&
      currentJobs.some(
        (job) => job.status === "ready" || job.status === "error",
      ),
  );

  function labelsForDropzone() {
    return {
      drop: text.dropFiles,
      choose: text.chooseFiles,
      formats:
        state.kind === "image"
          ? text.imageTypes
          : state.kind === "pdf"
            ? text.pdfTypes
            : state.kind === "docx"
              ? text.docxTypes
              : state.kind === "video"
                ? text.videoTypes
                : state.kind === "audio"
                  ? text.audioTypes
                  : text.dataTypes,
    };
  }

  function statusLabel(status: FileJob["status"]) {
    if (status === "ready") return text.ready;
    if (status === "converting") return text.converting;
    if (status === "done") return text.complete;
    return text.failed;
  }

  function downloadAll() {
    if (!finishedOutputs.length) return;
    workspace.setDownloadError("");
    void downloadOutputs(
      finishedOutputs,
      `henka-${state.kind}-converted.zip`,
    ).catch(() => workspace.setDownloadError(text.errorPrefix));
  }

  function handleDownload(output: (typeof finishedOutputs)[number]) {
    downloadBlob(output.blob, output.name);
  }
</script>

<section class="converter-workspace" aria-label={text.fileConverter}>
  <div class="converter-tabs" role="group" aria-label={text.conversionType}>
    {#each kinds as item (item)}
      <button
        type="button"
        aria-pressed={state.kind === item}
        disabled={busy}
        class="converter-tab {state.kind === item ? 'is-selected' : ''}"
        onclick={() => workspace.selectKind(item)}
      >
        {item === "image"
          ? text.featureImage
          : item === "pdf"
            ? text.featurePdf
            : item === "docx"
              ? text.featureDocx
              : item === "video"
                ? text.featureVideo
                : item === "audio"
                  ? text.featureAudio
                  : text.featureData}
      </button>
    {/each}
  </div>

  <FileDropzone
    kind={state.kind}
    disabled={busy}
    labels={labelsForDropzone()}
    onFiles={workspace.addFiles}
  />

  <ConversionOptions
    kind={state.kind}
    target={state.target}
    {formats}
    quality={state.quality}
    svgOutputWidth={state.svgOutputWidth}
    {hasSvgInput}
    {hasTiffInput}
    {busy}
    {text}
    onTargetChange={workspace.selectTarget}
    onQualityChange={workspace.setQuality}
    onSvgOutputWidthChange={workspace.setSvgOutputWidth}
  />

  {#if state.invalidFiles}
    <p class="file-warning" role="status">
      {text.invalidFiles}
    </p>
  {/if}

  <ConversionJobList
    jobs={currentJobs}
    finishedOutputCount={finishedOutputs.length}
    {busy}
    {canConvert}
    downloadError={state.downloadError}
    {text}
    {statusLabel}
    onConvert={workspace.convertAll}
    onDownloadAll={downloadAll}
    onClear={workspace.clearCurrentJobs}
    onRemove={workspace.removeJob}
    onSelectWorksheet={workspace.selectWorksheet}
    onDownload={handleDownload}
  />
</section>

<style>
  .converter-workspace {
    width: 100%;
    color: var(--ink);
    text-align: left;
  }

  .converter-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--rule);
    padding-bottom: 0.7rem;
  }

  .converter-tab {
    min-height: 2.6rem;
    border: 1px solid transparent;
    background: transparent;
    padding: 0.65rem 0.85rem;
    color: var(--ink-muted);
    cursor: pointer;
    font-size: 0.87rem;
    font-weight: 700;
    transition:
      background-color 120ms ease,
      color 120ms ease;
  }

  .converter-tab:hover:not(:disabled) {
    color: var(--ink);
  }

  .converter-tab.is-selected {
    border-color: var(--riso-blue);
    background: var(--riso-blue);
    color: #fff9ed;
  }

  :global(:root.dark) .converter-tab.is-selected {
    color: #201e1e;
  }

  .converter-tab:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .file-warning {
    margin-top: 1rem;
    border: 1px solid var(--danger);
    padding: 0.75rem 1rem;
    color: var(--danger);
    font-size: 0.85rem;
  }

  @media (max-width: 520px) {
    .converter-tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .converter-tab {
      padding-inline: 0.35rem;
      font-size: 0.78rem;
    }
  }
</style>
