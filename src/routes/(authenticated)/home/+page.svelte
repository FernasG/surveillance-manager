<script lang="ts">
	import LiveStreamPlayer from '$lib/components/LiveStreamPlayer.svelte';
</script>

<svelte:head>
	<title>Pi Guard | Home</title>
	<meta name="description" content="Surveillance app home." />
</svelte:head>

<div class="flex flex-col items-center gap-4 px-4 py-12">
	<div class="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
		<span class="h-2 w-2 rounded-full bg-accent"></span>
		<span class="text-sm text-ink">All systems normal</span>
	</div>
	<LiveStreamPlayer />
</div>
