<script lang="ts">
	import { onMount } from 'svelte';
	import { Moon, Sun } from '@lucide/svelte';

	type Language = 'en' | 'id';

	let language = $state<Language>('en');
	let dark = $state(false);

	const copy = {
		en: {
			languageLabel: 'Language',
			lightTheme: 'Switch to light theme',
			darkTheme: 'Switch to dark theme',
			privacy: 'Your files stay on your device',
			title: 'File conversion, right in your browser.',
			description:
				'Henka Convert is being rebuilt around useful image, media, and document conversions that run locally on your device.',
				status: 'Converter setup is next.',
			footer: 'No backend conversion service. Files are processed in your browser.'
		},
		id: {
			languageLabel: 'Bahasa',
			lightTheme: 'Ganti ke tema terang',
			darkTheme: 'Ganti ke tema gelap',
			privacy: 'File Anda tetap di perangkat ini',
			title: 'Konversi file, langsung di browser Anda.',
			description:
				'Henka Convert sedang dibangun ulang untuk menyediakan konversi gambar, media, dan dokumen yang berguna langsung di perangkat Anda.',
			status: 'Fitur konversi sedang disiapkan.',
			footer: 'Tanpa layanan konversi backend. File diproses di browser Anda.'
		}
	} satisfies Record<Language, Record<string, string>>;

	const text = $derived(copy[language]);

	onMount(() => {
		try {
			const savedLanguage = localStorage.getItem('henka-language');
			if (savedLanguage === 'id' || savedLanguage === 'en') language = savedLanguage;
		} catch {
			// Use English when browser storage is unavailable.
		}
		dark = document.documentElement.classList.contains('dark');
	});

	function setLanguage(value: Language) {
		language = value;
		document.documentElement.lang = value;
		try {
			localStorage.setItem('henka-language', value);
		} catch {
			// The selected language still applies for this page view.
		}
	}

	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		try {
			localStorage.setItem('henka-theme', dark ? 'dark' : 'light');
		} catch {
			// The selected theme still applies for this page view.
		}
	}
</script>

<svelte:head>
	<title>Henka Convert</title>
	<meta
		name="description"
		content="Convert your files privately in your browser."
	/>
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 sm:px-10">
	<header class="flex flex-wrap items-center justify-between gap-4">
		<a class="text-lg font-semibold tracking-tight" href="/">Henka Convert</a>
		<div class="flex items-center gap-3">
			<div class="flex items-center gap-1 rounded-full border border-border p-1" role="group" aria-label={text.languageLabel}>
				<button
					class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors {language === 'en' ? 'bg-foreground text-background' : 'text-muted hover:bg-surface'}"
					aria-pressed={language === 'en'}
					onclick={() => setLanguage('en')}
				>EN</button>
				<button
					class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors {language === 'id' ? 'bg-foreground text-background' : 'text-muted hover:bg-surface'}"
					aria-pressed={language === 'id'}
					onclick={() => setLanguage('id')}
				>ID</button>
			</div>
			<button
				class="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface"
				aria-label={dark ? text.lightTheme : text.darkTheme}
				aria-pressed={dark}
				title={dark ? text.lightTheme : text.darkTheme}
				onclick={toggleTheme}
			>
				{#if dark}
					<Sun size={18} aria-hidden="true" />
				{:else}
					<Moon size={18} aria-hidden="true" />
				{/if}
			</button>
		</div>
	</header>

	<section class="flex flex-1 flex-col items-center justify-center py-24 text-center">
		<p class="mb-4 text-sm font-medium text-muted">{text.privacy}</p>
		<h1 class="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
			{text.title}
		</h1>
		<p class="mt-6 max-w-xl text-base leading-7 text-muted">
			{text.description}
		</p>
		<div class="mt-8 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
			{text.status}
		</div>
	</section>

	<footer class="border-t border-border pt-5 text-sm text-muted">
		{text.footer}
	</footer>
</main>
