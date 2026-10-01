<script lang="ts">
  import { getContext, onMount } from "svelte";
  import FileDropzone from "$lib/components/FileDropzone.svelte";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";
  import { messages } from "$lib/i18n/messages";
  import ConversionJobList from "./ConversionJobList.svelte";
  import ConversionOptions from "./ConversionOptions.svelte";
  import type { DocumentFormat } from "./documents/types";
  import type { PdfFormat } from "./pdf/types";
  import type { VideoFormat } from "./video/types";
  import type { AudioFormat } from "./audio/types";
  import { downloadBlob, downloadOutputs } from "./shared/download";
  import type { ConverterKind, FileJob } from "./shared/types";
  import { createConverterWorkspace } from "./workspace.svelte";

  const pdfFormats: { value: PdfFormat; label: string }[] = [
    { value: "image/png", label: "PNG (one image per page)" },
    { value: "image/jpeg", label: "JPEG (one image per page)" },
    { value: "text/plain", label: "Plain text (selectable text only)" },
  ];
  const documentFormats: { value: DocumentFormat; label: string }[] = [
    { value: "text/html", label: "HTML" },
    { value: "text/plain", label: "Plain text" },
    { value: "text/markdown", label: "Markdown" },
  ];

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const workspace = createConverterWorkspace(
    () => messages[preferences.language],
    () => preferences.language,
  );
  const state = workspace.state;
  const text = $derived(messages[preferences.language]);
  const kinds: ConverterKind[] = ["image", "pdf", "docx", "video", "audio"];
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
      return state.imageOutputs.map((value) => ({
        value,
        label:
          value === "image/jpeg"
            ? "JPEG"
            : value === "image/avif"
              ? "AVIF"
              : value.slice("image/".length).toUpperCase(),
      }));
    }
    if (state.kind === "pdf") return pdfFormats;
    if (state.kind === "docx") return documentFormats;
    if (state.kind === "video") {
      return state.videoOutputs.map((value) => ({
        value: value satisfies VideoFormat,
        label: value === "video/mp4" ? "MP4" : "WebM",
      }));
    }
    return state.audioOutputs.map((value) => ({
      value: value satisfies AudioFormat,
      label: value === "audio/mpeg" ? "MP3" : "WAV",
    }));
  });
  const canConvert = $derived(
    (state.kind !== "image" ||
      (state.imageCapabilitiesReady && state.imageOutputs.length > 0)) &&
      (state.kind !== "video" ||
        (state.videoCapabilitiesReady && state.videoOutputs.length > 0)) &&
      (state.kind !== "audio" ||
        (state.audioCapabilitiesReady && state.audioOutputs.length > 0)) &&
      currentJobs.some(
        (job) => job.status === "ready" || job.status === "error",
      ),
  );

  onMount(() => {
    void workspace.loadImageCapabilities();
  });

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
                : text.audioTypes,
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

<section class="w-full max-w-4xl text-left" aria-label="File converter">
  <div
    class="mb-8 flex flex-wrap gap-2 border-b border-border"
    role="tablist"
    aria-label="Conversion type"
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
                : text.featureAudio}
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
    imageCapabilitiesReady={state.imageCapabilitiesReady}
    imageFormatsAvailable={state.imageOutputs.length > 0}
    videoCapabilitiesReady={state.videoCapabilitiesReady}
    videoFormatsAvailable={state.videoOutputs.length > 0}
    audioCapabilitiesReady={state.audioCapabilitiesReady}
    audioFormatsAvailable={state.audioOutputs.length > 0}
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
    onDownload={handleDownload}
  />
</section>
