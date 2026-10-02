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
        <button
          class="inline-flex min-h-[2.55rem] items-center border border-ink bg-transparent px-3 py-[0.55rem] text-[0.8rem] font-bold text-ink transition-colors hover:bg-riso-blue-soft"
          type="button"
          onclick={onDownloadAll}>{text.downloadAll}</button
        >
      {/if}
      {#if jobs.length}
        <button
          class="inline-flex min-h-[2.55rem] items-center border border-ink bg-transparent px-3 py-[0.55rem] text-[0.8rem] font-bold text-ink transition-colors hover:bg-riso-blue-soft disabled:cursor-not-allowed disabled:opacity-55"
          type="button"
          disabled={busy}
          onclick={onClear}>{text.clear}</button
        >
      {/if}
      <button
        class="inline-flex min-h-[2.65rem] items-center border border-ink bg-riso-pink px-4 py-[0.6rem] text-[0.85rem] font-extrabold text-[#201e1e] transition-[background-color,transform] hover:bg-riso-blue-soft hover:-translate-x-px hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-55"
        type="button"
        disabled={busy || !canConvert}
        onclick={onConvert}>{text.convert}</button
      >
    </div>
  </div>

  {#if downloadError}
    <p class="mb-3 text-sm text-danger" role="alert">
      {downloadError}
    </p>
  {/if}

  {#if jobs.length === 0}
    <div
      class="border-y border-rule py-6 text-center text-[0.85rem] text-ink-muted"
    >
      {text.noFiles}
    </div>
  {:else}
    <ul class="m-0 list-none border-y border-rule p-0 divide-y divide-border">
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
                class="inline-block bg-transparent py-[0.15rem] text-[0.73rem] font-bold {job.status ===
                'ready'
                  ? 'text-ink-muted'
                  : job.status === 'converting'
                    ? 'text-riso-blue'
                    : job.status === 'done'
                      ? 'text-success'
                      : 'text-danger'}">{statusLabel(job.status)}</span
              >
            </div>
            <p class="mt-1 text-xs text-ink-muted">
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
              <p class="mt-2 text-sm text-ink-muted" role="status">
                {text.dataWorksheetNamesLoading}
              </p>
            {:else if job.worksheetNames && job.worksheetNames.length > 1}
              <label class="mt-3 flex max-w-sm flex-col gap-1.5 text-sm">
                {text.dataSelectWorksheet}
                <select
                  class="max-w-full border border-ink bg-paper-raised px-[0.7rem] py-2 text-ink"
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
                  class="h-full bg-riso-blue transition-[width]"
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
                    <span class="shrink-0 text-ink-muted"
                      >{formatBytes(output.blob.size)}</span
                    >
                  </li>
                {/each}
              </ul>
            {/if}
            {#if job.error}
              <p class="mt-2 text-sm text-danger" role="alert">
                {text.errorPrefix}: {job.error}
              </p>
            {/if}
            {#each job.outputs as output (output.name)}
              {#if output.note}
                <p class="mt-2 text-xs leading-5 text-ink-muted">
                  {output.note}
                </p>
              {/if}
            {/each}
          </div>
          <div
            class="flex min-w-0 max-w-full flex-wrap items-center gap-2 sm:max-w-[50%] sm:justify-end"
          >
            {#if job.status === "done"}
              {#each job.outputs as output (output.name)}
                <button
                  class="inline-flex min-h-[2.55rem] items-center border border-ink bg-transparent px-3 py-[0.55rem] text-[0.8rem] font-bold text-ink transition-colors hover:bg-riso-blue-soft"
                  type="button"
                  onclick={() => onDownload(output)}
                  >{text.download}{job.outputs.length > 1
                    ? ` · ${output.name}`
                    : ""}</button
                >
              {/each}
            {/if}
            <button
              class="min-h-10 border-0 bg-transparent px-[0.65rem] py-2 text-[0.8rem] text-ink-muted hover:text-danger hover:underline hover:underline-offset-4 disabled:cursor-not-allowed disabled:opacity-55"
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
