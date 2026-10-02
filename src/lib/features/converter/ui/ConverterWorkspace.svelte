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

<section class="w-full text-left text-ink" aria-label={text.fileConverter}>
  <div
    class="mb-4 flex flex-wrap gap-[0.35rem] border-b border-rule pb-[0.7rem] max-[520px]:grid max-[520px]:grid-cols-3"
    role="group"
    aria-label={text.conversionType}
  >
    {#each kinds as item (item)}
      <button
        type="button"
        aria-pressed={state.kind === item}
        disabled={busy}
        class="min-h-[2.6rem] border px-[0.85rem] py-[0.65rem] text-[0.87rem] font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55 max-[520px]:px-[0.35rem] max-[520px]:text-[0.78rem] {state.kind ===
        item
          ? 'relative z-10 -translate-y-px border-riso-blue bg-riso-blue text-accent-foreground shadow-[3px_3px_0_var(--riso-pink)]'
          : 'border-rule bg-surface text-ink-muted hover:border-riso-pink hover:bg-riso-blue-soft hover:text-ink'}"
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
      class="mt-4 border border-danger px-4 py-3 text-[0.85rem] text-danger"
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
