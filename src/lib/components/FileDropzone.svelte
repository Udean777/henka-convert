<script lang="ts">
  import { FILE_ACCEPT } from "$lib/features/converter/shared/files";
  import type { ConverterKind } from "$lib/features/converter/shared/types";

  let {
    kind,
    disabled = false,
    labels,
    onFiles,
  }: {
    kind: ConverterKind;
    disabled?: boolean;
    labels: { drop: string; choose: string; formats: string };
    onFiles: (files: File[]) => void;
  } = $props();

  let dragging = $state(false);

  function receive(files: FileList | null) {
    if (files?.length) onFiles(Array.from(files));
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    dragging = false;
    if (!disabled) receive(event.dataTransfer?.files ?? null);
  }
</script>

<div
  class="rounded-2xl border border-dashed {dragging
    ? 'border-foreground bg-surface'
    : 'border-border'} px-6 py-10 text-center transition-colors sm:px-10"
  ondragover={(event) => {
    event.preventDefault();
    if (!disabled) dragging = true;
  }}
  ondragleave={() => (dragging = false)}
  ondrop={onDrop}
  role="region"
  aria-label={labels.drop}
>
  <div class="mx-auto flex max-w-lg flex-col items-center">
    <span
      class="mb-4 grid size-12 place-items-center rounded-full border border-border bg-surface text-xl"
      aria-hidden="true">↑</span
    >
    <p class="font-medium">{labels.drop}</p>
    <label
      class="mt-5 inline-flex cursor-pointer items-center rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
    >
      {labels.choose}
      <input
        class="sr-only"
        type="file"
        accept={FILE_ACCEPT[kind]}
        multiple
        {disabled}
        onchange={(event) => {
          receive(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />
    </label>
    <p class="mt-4 text-xs text-muted">{labels.formats}</p>
  </div>
</div>
