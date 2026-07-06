<script lang="ts">
	import { browser } from '$app/environment';
	import { postQuery, searchResultStreamUrl, type SearchResult } from '$lib/api/search';
	import { getStoredSession } from '$lib/api/auth';
	import SearchResultPlaybackModal from '$lib/components/SearchResultPlaybackModal.svelte';

	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let loading = $state(false);
	let errored = $state(false);
	let searched = $state(false);
	let selectedResult = $state<SearchResult | null>(null);

	const session = browser ? getStoredSession() : null;

	function formatTimestamp(elapsedMs: number): string {
		const totalSeconds = Math.floor(elapsedMs / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	}

	async function runSearch() {
		if (!query.trim()) return;

		loading = true;
		searched = true;
		const result = await postQuery(query.trim());
		loading = false;

		if (!result.ok) {
			errored = true;
			results = [];
			return;
		}

		errored = false;
		results = result.data;
	}
</script>

<svelte:head>
	<title>Pi Guard | Semantic Search</title>
	<meta name="description" content="Search recorded footage using natural language." />
</svelte:head>

<div class="flex flex-col gap-6 p-6">
	<div>
		<h1 class="text-lg font-semibold text-ink">Semantic Search</h1>
		<p class="mt-1 text-sm text-muted">Describe a moment and find it across your footage.</p>
	</div>

	<form
		onsubmit={(event) => {
			event.preventDefault();
			runSearch();
		}}
		class="mx-auto flex w-full max-w-2xl items-center gap-3"
	>
		<label for="search-query" class="sr-only">Search query</label>
		<input
			id="search-query"
			type="text"
			bind:value={query}
			placeholder="e.g. person wearing a red shirt"
			class="w-full rounded border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-muted focus:border-primary"
		/>
		<button
			type="submit"
			disabled={loading || !query.trim()}
			class="shrink-0 cursor-pointer rounded bg-primary px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
		>
			{loading ? 'Searching…' : 'Search'}
		</button>
	</form>

	{#if loading}
		<p class="text-center text-sm text-muted">Searching footage…</p>
	{:else if errored}
		<p class="text-center text-sm text-primary" role="alert">
			Couldn't complete the search. Please try again.
		</p>
	{:else if searched && results.length === 0}
		<p class="text-center text-sm text-muted">No moments matched that description.</p>
	{:else if results.length > 0}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each results as result, index (index)}
				<button
					type="button"
					onclick={() => (selectedResult = result)}
					class="group flex cursor-pointer flex-col overflow-hidden rounded border border-border bg-surface text-left transition-colors duration-150 hover:border-primary"
				>
					{#if result.frameBase64}
						<img
							src={`data:image/jpeg;base64,${result.frameBase64}`}
							alt={result.description}
							class="aspect-video w-full bg-bg object-cover"
						/>
					{:else}
						<div
							class="flex aspect-video w-full items-center justify-center bg-bg text-xs text-muted"
						>
							Preview unavailable
						</div>
					{/if}
					<div class="flex flex-col gap-1.5 p-3">
						<p class="text-sm text-ink group-hover:text-ink">{result.description}</p>
						<div class="flex items-center justify-between font-mono text-xs text-muted">
							<span>{formatTimestamp(result.elapsedMs)}</span>
							<span>{Math.round(result.confidenceScore * 100)}%</span>
						</div>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if selectedResult && session}
	<SearchResultPlaybackModal
		videoName={selectedResult.videoName}
		src={searchResultStreamUrl(selectedResult.videoName, session)}
		elapsedMs={selectedResult.elapsedMs}
		onClose={() => (selectedResult = null)}
	/>
{/if}
