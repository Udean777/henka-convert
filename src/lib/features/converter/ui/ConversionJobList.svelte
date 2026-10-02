<script lang="ts">
  import { formatBytes } from "../shared/files";
  import type { ConversionOutput, FileJob } from "../shared/types";
  import type { WorkspaceText } from "../application/workspace.svelte";

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
        <button class="utility-button" type="button" onclick={onDownloadAll}
          >{text.downloadAll}</button
        >
      {/if}
      {#if jobs.length}
        <button
          class="utility-button"
          type="button"
          disabled={busy}
          onclick={onClear}>{text.clear}</button
        >
      {/if}
      <button
        class="convert-button"
        type="button"
        disabled={busy || !canConvert}
        onclick={onConvert}>{text.convert}</button
      >
    </div>
  </div>

  {#if downloadError}
    <p class="download-error mb-3 text-sm" role="alert">
      {downloadError}
    </p>
  {/if}

  {#if jobs.length === 0}
    <div class="empty-jobs">
      {text.noFiles}
    </div>
  {:else}
    <ul class="job-list divide-y divide-border">
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
              <span class="job-status status-{job.status}"
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
                  class="worksheet-select"
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
                class="mt-3 h-1.5 overflow-hidden bg-border"
                role="progressbar"
                aria-valuenow={job.progress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`${text.converting} ${job.file.name}`}
              >
                <div
                  class="progress-fill transition-[width]"
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
              <p class="job-error mt-2 text-sm" role="alert">
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
                  class="download-button"
                  type="button"
                  onclick={() => onDownload(output)}
                  >{text.download}{job.outputs.length > 1
                    ? ` · ${output.name}`
                    : ""}</button
                >
              {/each}
            {/if}
            <button
              class="remove-button"
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

<style>
  .utility-button,
  .download-button {
    min-height: 2.55rem;
    border: 1px solid var(--ink);
    background: transparent;
    padding: 0.55rem 0.75rem;
    color: var(--ink);
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 700;
    transition: background-color 120ms ease;
  }

  .utility-button:hover,
  .download-button:hover {
    background: var(--riso-blue-soft);
  }

  .utility-button:disabled,
  .convert-button:disabled,
  .remove-button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .convert-button {
    min-height: 2.65rem;
    border: 1px solid var(--ink);
    background: var(--riso-pink);
    padding: 0.6rem 1rem;
    color: #201e1e;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 850;
    transition:
      background-color 120ms ease,
      transform 120ms ease;
  }

  .convert-button:hover:not(:disabled) {
    background: var(--riso-blue-soft);
    transform: translate(-1px, -1px);
  }

  .empty-jobs {
    border-block: 1px solid var(--rule);
    padding: 1.5rem 0;
    color: var(--ink-muted);
    font-size: 0.85rem;
    text-align: center;
  }

  .job-list {
    border-block: 1px solid var(--rule);
    border-inline: 0;
    border-radius: 0;
  }

  .job-status {
    display: inline-block;
    background: transparent;
    padding: 0.15rem 0;
    font-size: 0.73rem;
    font-weight: 750;
  }

  .status-ready {
    color: var(--ink-muted);
  }

  .status-converting {
    color: var(--riso-blue);
  }

  .status-done {
    color: var(--success);
  }

  .status-error {
    color: var(--danger);
  }

  .progress-fill {
    height: 100%;
    background: var(--riso-blue);
  }

  .download-error,
  .job-error {
    color: var(--danger);
  }

  .worksheet-select {
    max-width: 100%;
    border: 1px solid var(--ink);
    background: var(--paper-raised);
    padding: 0.5rem 0.7rem;
    color: var(--ink);
  }

  .remove-button {
    min-height: 2.5rem;
    border: 0;
    background: transparent;
    padding: 0.5rem 0.65rem;
    color: var(--ink-muted);
    cursor: pointer;
    font-size: 0.8rem;
  }

  .remove-button:hover:not(:disabled) {
    color: var(--danger);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
</style>
