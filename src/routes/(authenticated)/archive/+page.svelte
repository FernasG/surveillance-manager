<script lang="ts">
	import { buildMediaUrl, listVideos, videoStreamUrl, type Video } from '$lib/api/videos';
	import { getStoredSession } from '$lib/api/auth';
	import VideoPlaybackModal from '$lib/components/VideoPlaybackModal.svelte';

	const PAGE_SIZE = 20;

	let startDate = $state('');
	let endDate = $state('');
	let videos = $state<Video[]>([]);
	let page = $state(1);
	let totalPages = $state(1);
	let loading = $state(false);
	let loadingMore = $state(false);
	let errored = $state(false);
	let selectedVideo = $state<Video | null>(null);

	const session = getStoredSession();

	function labelFor(videoName: string): string {
		const match = videoName.match(/_(\d+)\./);
		if (!match) return videoName;
		const timestamp = Number(match[1]);
		if (!Number.isFinite(timestamp)) return videoName;
		return new Date(timestamp * 1000).toLocaleString();
	}

	async function fetchVideos(targetPage: number) {
		const result = await listVideos({
			page: targetPage,
			size: PAGE_SIZE,
			startDate: startDate || undefined,
			endDate: endDate || undefined
		});

		if (!result.ok) {
			errored = true;
			return;
		}

		errored = false;
		videos = targetPage === 1 ? result.data.videos : [...videos, ...result.data.videos];
		page = result.data.page;
		totalPages = result.data.total_pages;
	}

	async function applyFilters() {
		loading = true;
		await fetchVideos(1);
		loading = false;
	}

	async function loadMore() {
		loadingMore = true;
		await fetchVideos(page + 1);
		loadingMore = false;
	}

	applyFilters();
</script>

<div class="flex flex-col gap-6 p-6">
	<div>
		<h1 class="text-lg font-semibold text-ink">Video Archive</h1>
		<p class="mt-1 text-sm text-muted">Browse and play back recorded clips.</p>
	</div>

	<form
		onsubmit={(event) => {
			event.preventDefault();
			applyFilters();
		}}
		class="flex flex-wrap items-end gap-4"
	>
		<div>
			<label for="start_date" class="mb-1.5 block text-sm text-muted">From</label>
			<input
				id="start_date"
				type="date"
				bind:value={startDate}
				class="rounded border border-border bg-surface px-3 py-2 text-sm text-ink transition-colors duration-150 outline-none focus:border-primary"
			/>
		</div>
		<div>
			<label for="end_date" class="mb-1.5 block text-sm text-muted">To</label>
			<input
				id="end_date"
				type="date"
				bind:value={endDate}
				class="rounded border border-border bg-surface px-3 py-2 text-sm text-ink transition-colors duration-150 outline-none focus:border-primary"
			/>
		</div>
		<button
			type="submit"
			class="rounded bg-primary px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-primary-hover"
		>
			Apply filters
		</button>
	</form>

	{#if loading}
		<p class="text-sm text-muted">Loading videos…</p>
	{:else if errored}
		<p class="text-sm text-primary" role="alert">
			Couldn't load the video archive. Please try again.
		</p>
	{:else if videos.length === 0}
		<p class="text-sm text-muted">No recorded videos match this range.</p>
	{:else}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each videos as video (video.video_name)}
				<button
					type="button"
					onclick={() => (selectedVideo = video)}
					class="group flex flex-col overflow-hidden rounded border border-border bg-surface text-left transition-colors duration-150 hover:border-primary"
				>
					<img
						src={session ? buildMediaUrl(video.thumbnail_url, session) : video.thumbnail_url}
						alt={video.video_name}
						loading="lazy"
						class="aspect-video w-full bg-bg object-cover"
					/>
					<span class="truncate px-2 py-1.5 font-mono text-xs text-muted group-hover:text-ink">
						{labelFor(video.video_name)}
					</span>
				</button>
			{/each}
		</div>

		{#if page < totalPages}
			<button
				type="button"
				onclick={loadMore}
				disabled={loadingMore}
				class="self-center rounded border border-border px-4 py-2 text-sm text-muted transition-colors duration-150 hover:border-primary hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
			>
				{loadingMore ? 'Loading…' : 'Load more'}
			</button>
		{/if}
	{/if}
</div>

{#if selectedVideo && session}
	<VideoPlaybackModal
		videoName={selectedVideo.video_name}
		src={videoStreamUrl(selectedVideo.video_name, session)}
		onClose={() => (selectedVideo = null)}
	/>
{/if}
