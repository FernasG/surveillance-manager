<script lang="ts">
	import { browser } from '$app/environment';
	import { getStoredSession } from '$lib/api/auth';
	import { liveStreamUrl } from '$lib/api/videos';

	type PlayerState = 'loading' | 'live' | 'error';

	// The live feed is MJPEG-over-HTTP via <img>, which has no `stalled` event: a connection
	// that opens but never sends a frame (e.g. the camera failing server-side) would otherwise
	// leave the player stuck on "Connecting..." forever with no way to reach Retry.
	const CONNECT_TIMEOUT_MS = 8000;

	const session = browser ? getStoredSession() : null;

	let playerState = $state<PlayerState>('loading');
	let attempt = $state(0);

	function handleLoad() {
		playerState = 'live';
	}

	function handleFailure() {
		playerState = 'error';
	}

	function retry() {
		playerState = 'loading';
		attempt += 1;
	}

	$effect(() => {
		attempt;
		const timeout = setTimeout(() => {
			if (playerState === 'loading') playerState = 'error';
		}, CONNECT_TIMEOUT_MS);
		return () => clearTimeout(timeout);
	});
</script>

<div
	class="relative aspect-video w-full max-w-3xl overflow-hidden rounded border border-border bg-bg"
>
	{#if !session}
		<div class="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
			<span class="h-2 w-2 rounded-full bg-muted"></span>
			<p class="text-sm text-muted">Sign in to view the live feed.</p>
		</div>
	{:else}
		{#key attempt}
			<img
				src={liveStreamUrl(session)}
				alt="Live camera feed"
				onload={handleLoad}
				onerror={handleFailure}
				class="h-full w-full object-cover"
				class:invisible={playerState !== 'live'}
			/>
		{/key}

		{#if playerState === 'loading'}
			<div class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface">
				<span class="h-2 w-2 animate-pulse rounded-full bg-muted"></span>
				<p class="text-sm text-muted">Connecting to camera…</p>
			</div>
		{:else if playerState === 'error'}
			<div
				class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface px-4 text-center"
			>
				<span class="h-2 w-2 rounded-full bg-primary"></span>
				<p class="text-sm text-ink">Feed unavailable</p>
				<p class="max-w-xs text-xs text-muted">
					The live camera stream couldn't be reached. Your session may have expired, or the camera
					may be offline.
				</p>
				<button
					type="button"
					onclick={retry}
					class="rounded cursor-pointer bg-primary px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-primary-hover"
				>
					Retry
				</button>
			</div>
		{:else}
			<div
				class="absolute top-3 left-3 flex items-center gap-1.5 rounded border border-border/50 bg-bg/70 px-2 py-1 backdrop-blur-sm"
			>
				<span class="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse"></span>
				<span class="font-mono text-xs tracking-wide text-ink uppercase">Live</span>
			</div>
		{/if}
	{/if}
</div>
