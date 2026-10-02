<script lang="ts">
  let {
    eyebrow,
    title,
    description,
  }: { eyebrow: string; title: string; description: string } = $props();
</script>

<header class="page-intro">
  <p class="eyebrow">{eyebrow}</p>
  <h1>{title}</h1>
  <p class="description">{description}</p>
</header>

<style>
  .page-intro {
    max-width: 820px;
    padding-block: clamp(3rem, 8vw, 6.5rem) clamp(2.5rem, 5vw, 4rem);
  }

  .eyebrow {
    margin: 0 0 1rem;
    color: var(--riso-blue);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  h1 {
    max-width: 17ch;
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2.8rem, 7vw, 5.8rem);
    letter-spacing: -0.075em;
    line-height: 0.98;
  }

  .description {
    max-width: 44rem;
    margin: 1.5rem 0 0;
    color: var(--ink-muted);
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    line-height: 1.7;
  }
</style>
