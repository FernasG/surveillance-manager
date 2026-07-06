<script lang="ts">
	let { videoName, src, onClose }: { videoName: string; src: string; onClose: () => void } =
		$props();

	let hasError = $state(false);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') onClose();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) onClose();
	}

	function handleError() {
		hasError = true;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
	onclick={handleBackdropClick}
	role="presentation"
>
	<div
		class="w-full max-w-3xl rounded-md border border-border bg-surface p-4"
		role="dialog"
		aria-modal="true"
		aria-label={`Playback: ${videoName}`}
	>
		<div class="mb-3 flex items-center justify-between">
			<span class="truncate font-mono text-xs text-muted">{videoName}</span>
			<button
				type="button"
				onclick={onClose}
				aria-label="Close"
				class="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border text-muted transition-colors duration-150 hover:border-primary hover:text-ink"
			>
				<svg
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="h-3.5 w-3.5"
					aria-hidden="true"
				>
					<path d="M3 3l10 10M13 3L3 13" stroke-linecap="round" />
				</svg>
			</button>
		</div>

		{#if hasError}
			<p
				class="rounded border border-border bg-bg px-4 py-8 text-center text-sm text-primary"
				role="alert"
			>
				Couldn't load this video. Your session may have expired — try signing in again.
			</p>
		{:else}
			<!-- svelte-ignore a11y_media_has_caption -->
			<video
				{src}
				controls
				autoplay
				onerror={handleError}
				class="max-h-[70vh] w-full rounded bg-black"
			></video>
		{/if}
	</div>
</div>
