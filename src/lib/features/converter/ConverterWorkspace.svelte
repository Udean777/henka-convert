<script lang="ts">
  import { getContext } from "svelte";
  import FileDropzone from "$lib/components/FileDropzone.svelte";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";
  import { messages } from "$lib/i18n/messages";
  import { downloadBlob, downloadOutputs } from "./shared/download";
  import {
    formatBytes,
    isSupportedFile,
    removeExtension,
  } from "./shared/files";
  import type {
    ConverterKind,
    ConversionOutput,
    FileJob,
    OutputFormat,
  } from "./shared/types";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(messages[preferences.language]);
  let kind = $state<ConverterKind>("image");
  let target = $state<OutputFormat>("image/webp");
  let quality = $state(0.9);
  let jobs = $state<FileJob[]>([]);
  let invalidFiles = $state(false);
  let downloadError = $state("");
  let isConverting = $state(false);

  const kinds: ConverterKind[] = ["image", "pdf", "docx"];
  const formats = $derived.by(() => {
    if (kind === "image")
      return [
        { value: "image/jpeg", label: "JPEG" },
        { value: "image/png", label: "PNG" },
        { value: "image/webp", label: "WebP" },
      ];
    if (kind === "pdf")
      return [
        { value: "image/png", label: "PNG (one image per page)" },
        { value: "image/jpeg", label: "JPEG (one image per page)" },
        { value: "text/plain", label: "Plain text (selectable text only)" },
      ];
    return [
      { value: "text/html", label: "HTML" },
      { value: "text/plain", label: "Plain text" },
      { value: "text/markdown", label: "Markdown" },
    ];
  });
  const currentJobs = $derived(jobs.filter((job) => job.kind === kind));
  const finishedOutputs = $derived(
    currentJobs.flatMap((job) => (job.status === "done" ? job.outputs : [])),
  );
  const busy = $derived(
    isConverting || jobs.some((job) => job.status === "converting"),
  );

  function selectKind(next: ConverterKind) {
    kind = next;
    target =
      next === "image"
        ? "image/webp"
        : next === "pdf"
          ? "image/png"
          : "text/html";
    invalidFiles = false;
  }

  function addFiles(files: File[]) {
    const supported = files.filter((file) => isSupportedFile(file, kind));
    invalidFiles = supported.length !== files.length;
    const additions: FileJob[] = supported.map((file) => ({
      id: crypto.randomUUID(),
      kind,
      file,
      status: "ready",
      progress: 0,
      outputs: [],
    }));
    jobs = [...jobs, ...additions];
    downloadError = "";
  }

  function updateJob(id: string, update: Partial<FileJob>) {
    jobs = jobs.map((job) => (job.id === id ? { ...job, ...update } : job));
  }

  async function convertAll() {
    if (busy) return;
    isConverting = true;
    downloadError = "";
    const pending = currentJobs.filter(
      (job) => job.status === "ready" || job.status === "error",
    );
    for (const job of pending) {
      updateJob(job.id, {
        status: "converting",
        progress: 0,
        error: undefined,
        outputs: [],
      });
      try {
        const outputs = await convertFile(job, (progress) =>
          updateJob(job.id, { progress }),
        );
        updateJob(job.id, { status: "done", progress: 100, outputs });
      } catch (error) {
        updateJob(job.id, {
          status: "error",
          progress: 0,
          error: error instanceof Error ? error.message : text.errorPrefix,
        });
      }
    }
    isConverting = false;
  }

  async function convertFile(
    job: FileJob,
    onProgress: (progress: number) => void,
  ): Promise<ConversionOutput[]> {
    if (job.kind === "image") {
      const { convertImage } = await import("./image/convert");
      return [
        await convertImage(
          job.file,
          target as "image/jpeg" | "image/png" | "image/webp",
          quality,
        ),
      ];
    }
    if (job.kind === "pdf") {
      if (target === "text/plain") {
        const { convertPdfToText } = await import("./pdf/convert");
        onProgress(20);
        const output = await convertPdfToText(job.file);
        onProgress(100);
        return [output];
      }
      const { convertPdfToImages } = await import("./pdf/convert");
      return convertPdfToImages(
        job.file,
        target as "image/jpeg" | "image/png",
        (current, total) => onProgress(Math.round((current / total) * 100)),
      );
    }
    const { convertDocx } = await import("./documents/convert");
    onProgress(30);
    const output = await convertDocx(
      job.file,
      target as "text/html" | "text/plain" | "text/markdown",
      preferences.language,
    );
    onProgress(100);
    return [output];
  }

  async function downloadAll() {
    if (!finishedOutputs.length) return;
    downloadError = "";
    try {
      await downloadOutputs(finishedOutputs, `henka-${kind}-converted.zip`);
    } catch {
      downloadError = text.errorPrefix;
    }
  }

  function labelsForDropzone() {
    return {
      drop: text.dropFiles,
      choose: text.chooseFiles,
      formats:
        kind === "image"
          ? text.imageTypes
          : kind === "pdf"
            ? text.pdfTypes
            : text.docxTypes,
    };
  }

  function statusLabel(status: FileJob["status"]) {
    if (status === "ready") return text.ready;
    if (status === "converting") return text.converting;
    if (status === "done") return text.complete;
    return text.failed;
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
        aria-selected={kind === item}
        disabled={busy}
        class="-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors {kind ===
        item
          ? 'border-foreground text-foreground'
          : 'border-transparent text-muted hover:text-foreground'}"
        onclick={() => selectKind(item)}
      >
        {item === "image"
          ? text.featureImage
          : item === "pdf"
            ? text.featurePdf
            : text.featureDocx}
      </button>
    {/each}
  </div>

  <FileDropzone
    {kind}
    disabled={busy}
    labels={labelsForDropzone()}
    onFiles={addFiles}
  />

  <div
    class="mt-6 flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end sm:justify-between"
  >
    <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end">
      <label class="flex flex-col gap-2 text-sm font-medium">
        {text.convertTo}
        <select
          class="min-w-56 rounded-lg border border-border bg-background px-3 py-2.5 font-normal"
          bind:value={target}
          disabled={busy}
        >
          {#each formats as format (format.value)}
            <option value={format.value}>{format.label}</option>
          {/each}
        </select>
      </label>
      {#if kind === "image" && target !== "image/png"}
        <label class="flex min-w-52 flex-col gap-2 text-sm font-medium">
          {text.quality}
          <span class="font-normal text-muted"
            >{Math.round(quality * 100)}%</span
          >
          <input
            class="accent-foreground"
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            bind:value={quality}
            disabled={busy}
          />
        </label>
      {/if}
    </div>
    {#if kind === "image" && target === "image/jpeg"}
      <p class="max-w-sm text-xs leading-5 text-muted">
        {text.transparencyNote}
      </p>
    {/if}
  </div>

  {#if kind === "pdf" && target === "text/plain"}
    <p class="mt-3 text-sm leading-6 text-muted">{text.pdfTextNote}</p>
  {:else if kind === "docx"}
    <p class="mt-3 text-sm leading-6 text-muted">{text.docxNote}</p>
  {/if}

  {#if invalidFiles}
    <p
      class="mt-4 rounded-lg border border-border px-4 py-3 text-sm"
      role="status"
    >
      {text.invalidFiles}
    </p>
  {/if}

  <div class="mt-8">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-base font-semibold">
        {currentJobs.length}
        {currentJobs.length === 1 ? text.file : text.files}
      </h2>
      <div class="flex flex-wrap gap-2">
        {#if finishedOutputs.length > 1}
          <button
            class="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
            type="button"
            onclick={downloadAll}>{text.downloadAll}</button
          >
        {/if}
        {#if currentJobs.length}
          <button
            class="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface disabled:opacity-50"
            type="button"
            disabled={busy}
            onclick={() => (jobs = jobs.filter((job) => job.kind !== kind))}
            >{text.clear}</button
          >
        {/if}
        <button
          class="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={busy ||
            !currentJobs.some(
              (job) => job.status === "ready" || job.status === "error",
            )}
          onclick={convertAll}>{text.convert}</button
        >
      </div>
    </div>

    {#if downloadError}
      <p class="mb-3 text-sm text-red-700 dark:text-red-300" role="alert">
        {downloadError}
      </p>
    {/if}

    {#if currentJobs.length === 0}
      <div
        class="rounded-xl border border-border px-4 py-8 text-center text-sm text-muted"
      >
        {text.noFiles}
      </div>
    {:else}
      <ul class="divide-y divide-border rounded-xl border border-border">
        {#each currentJobs as job (job.id)}
          <li
            class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <p class="max-w-full truncate text-sm font-medium">
                  {job.file.name}
                </p>
                <span
                  class="rounded-full bg-surface px-2 py-0.5 text-xs text-muted"
                  >{statusLabel(job.status)}</span
                >
              </div>
              <p class="mt-1 text-xs text-muted">
                {formatBytes(job.file.size)}
              </p>
              {#if job.status === "converting"}
                <div
                  class="mt-3 h-1.5 overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuenow={job.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`${text.converting} ${job.file.name}`}
                >
                  <div
                    class="h-full bg-foreground transition-[width]"
                    style={`width: ${Math.max(4, job.progress)}%`}
                  ></div>
                </div>
              {/if}
              {#if job.error}
                <p
                  class="mt-2 text-sm text-red-700 dark:text-red-300"
                  role="alert"
                >
                  {text.errorPrefix}: {job.error}
                </p>
              {/if}
              {#each job.outputs as output (output.name)}
                {#if output.note}
                  <p class="mt-2 text-xs leading-5 text-muted">{output.note}</p>
                {/if}
              {/each}
            </div>
            <div
              class="flex min-w-0 max-w-full flex-wrap items-center gap-2 sm:max-w-[50%] sm:justify-end"
            >
              {#if job.status === "done"}
                {#each job.outputs as output (output.name)}
                  <button
                    class="min-w-0 max-w-full whitespace-normal break-words rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-surface"
                    type="button"
                    onclick={() => downloadBlob(output.blob, output.name)}
                    >{text.download}{job.outputs.length > 1
                      ? ` · ${output.name}`
                      : ""}</button
                  >
                {/each}
              {/if}
              <button
                class="rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground disabled:opacity-50"
                type="button"
                aria-label={`${text.remove} ${job.file.name}`}
                disabled={busy}
                onclick={() =>
                  (jobs = jobs.filter((item) => item.id !== job.id))}
                >{text.remove}</button
              >
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
