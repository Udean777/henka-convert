<script lang="ts">
  let {
    eyebrow,
    title,
    description,
  }: { eyebrow: string; title: string; description: string } = $props();
</script>

<header
  class="max-w-[820px] pt-[clamp(3rem,8vw,6.5rem)] pb-[clamp(2.5rem,5vw,4rem)] max-[520px]:pt-10 max-[520px]:pb-8"
>
  <p
    class="mb-4 text-[0.72rem] font-extrabold tracking-[0.15em] text-riso-blue uppercase"
  >
    {eyebrow}
  </p>
  <h1
    class="m-0 max-w-[17ch] font-display text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.98] tracking-[-0.075em] max-[520px]:text-[clamp(2.35rem,11vw,3.5rem)]"
  >
    {title}
  </h1>
  <p
    class="mt-6 max-w-[44rem] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] text-ink-muted max-[520px]:mt-5"
  >
    {description}
  </p>
</header>
