<script lang="ts">
  import { getContext } from "svelte";
  import FileDropzone from "$lib/components/FileDropzone.svelte";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";
  import { messages } from "$lib/i18n/messages";
  import ConversionJobList from "./ConversionJobList.svelte";
  import ConversionOptions from "./ConversionOptions.svelte";
  import { DOCUMENT_FORMAT_OPTIONS } from "./documents/formats";
  import { PDF_OUTPUT_FORMATS } from "./pdf/formats";
  import { IMAGE_OUTPUT_FORMATS } from "./image/formats";
  import { VIDEO_FORMAT_OPTIONS } from "./video/formats";
  import { AUDIO_FORMAT_OPTIONS } from "./audio/formats";
  import { DATA_FORMAT_OPTIONS } from "./data/formats";
  import { downloadBlob, downloadOutputs } from "./shared/download";
  import type { ConverterKind, FileJob } from "./shared/types";
  import { createConverterWorkspace } from "./workspace.svelte";

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

<section class="w-full max-w-4xl text-left" aria-label={text.fileConverter}>
  <div
    class="mb-8 flex flex-wrap gap-2 border-b border-border"
    role="tablist"
    aria-label={text.conversionType}
  >
    {#each kinds as item (item)}
      <button
        type="button"
        role="tab"
        aria-selected={state.kind === item}
        disabled={busy}
        class="-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors {state.kind ===
        item
          ? 'border-foreground text-foreground'
          : 'border-transparent text-muted hover:text-foreground'}"
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
    <p
      class="mt-4 rounded-lg border border-border px-4 py-3 text-sm"
      role="status"
    >
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
