<script lang="ts">
  import { formatBytes } from "./shared/files";
  import type { ConversionOutput, FileJob } from "./shared/types";
  import type { WorkspaceText } from "./workspace.svelte";

  interface Props {
    jobs: FileJob[];
    finishedOutputCount: number;
    busy: boolean;
    canConvert: boolean;
    downloadError: string;
    text: WorkspaceText;
    statusLabel: (status: FileJob["status"]) => string;
    onConvert: () => void;
    onDownloadAll: () => void;
    onClear: () => void;
    onRemove: (id: string) => void;
    onSelectWorksheet: (id: string, worksheetName: string) => void;
    onDownload: (output: ConversionOutput) => void;
  }

  let {
    jobs,
    finishedOutputCount,
    busy,
    canConvert,
    downloadError,
    text,
    statusLabel,
    onConvert,
    onDownloadAll,
    onClear,
    onRemove,
    onSelectWorksheet,
    onDownload,
  }: Props = $props();
</script>

<div class="mt-8">
  <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
    <h2 class="text-base font-semibold">
      {jobs.length}
      {jobs.length === 1 ? text.file : text.files}
    </h2>
    <div class="flex flex-wrap gap-2">
      {#if finishedOutputCount > 1}
        <button
          class="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
          type="button"
          onclick={onDownloadAll}>{text.downloadAll}</button
        >
      {/if}
      {#if jobs.length}
        <button
          class="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface disabled:opacity-50"
          type="button"
          disabled={busy}
          onclick={onClear}>{text.clear}</button
        >
      {/if}
      <button
        class="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        disabled={busy || !canConvert}
        onclick={onConvert}>{text.convert}</button
      >
    </div>
  </div>

  {#if downloadError}
    <p class="mb-3 text-sm text-red-700 dark:text-red-300" role="alert">
      {downloadError}
    </p>
  {/if}

  {#if jobs.length === 0}
    <div
      class="rounded-xl border border-border px-4 py-8 text-center text-sm text-muted"
    >
      {text.noFiles}
    </div>
  {:else}
    <ul class="divide-y divide-border rounded-xl border border-border">
      {#each jobs as job (job.id)}
        {@const singleOutput =
          job.status === "done" && job.outputs.length === 1
            ? job.outputs[0]
            : undefined}
        <li
          class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="max-w-full truncate text-sm font-medium">
                {singleOutput?.name ?? job.file.name}
              </p>
              <span
                class="rounded-full bg-surface px-2 py-0.5 text-xs text-muted"
                >{statusLabel(job.status)}</span
              >
            </div>
            <p class="mt-1 text-xs text-muted">
              {#if singleOutput}
                {formatBytes(singleOutput.blob.size)}
                <span aria-hidden="true"> · </span>
                {text.convertedFrom}
                {job.file.name}
                ({formatBytes(job.file.size)})
              {:else}
                {formatBytes(job.file.size)}
              {/if}
            </p>
            {#if job.worksheetNamesLoading}
              <p class="mt-2 text-sm text-muted" role="status">
                {text.dataWorksheetNamesLoading}
              </p>
            {:else if job.worksheetNames && job.worksheetNames.length > 1}
              <label class="mt-3 flex max-w-sm flex-col gap-1.5 text-sm">
                {text.dataSelectWorksheet}
                <select
                  class="max-w-full rounded-lg border border-border bg-background px-3 py-2 font-normal"
                  value={job.selectedWorksheet ?? ""}
                  disabled={busy}
                  aria-label={`${text.dataSelectWorksheet}: ${job.file.name}`}
                  onchange={(event) =>
                    onSelectWorksheet(job.id, event.currentTarget.value)}
                >
                  <option value="" disabled>{text.dataSelectWorksheet}</option>
                  {#each job.worksheetNames as worksheetName (worksheetName)}
                    <option value={worksheetName}>{worksheetName}</option>
                  {/each}
                </select>
              </label>
            {/if}
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
            {#if job.status === "done" && job.outputs.length > 1}
              <ul class="mt-3 space-y-1.5" aria-label={text.convertedFiles}>
                {#each job.outputs as output (output.name)}
                  <li
                    class="flex min-w-0 items-baseline justify-between gap-3 text-xs"
                  >
                    <span class="min-w-0 truncate">{output.name}</span>
                    <span class="shrink-0 text-muted"
                      >{formatBytes(output.blob.size)}</span
                    >
                  </li>
                {/each}
              </ul>
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
                  onclick={() => onDownload(output)}
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
              onclick={() => onRemove(job.id)}>{text.remove}</button
            >
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
