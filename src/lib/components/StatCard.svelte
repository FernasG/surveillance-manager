<script lang="ts">
	import type { Snippet } from 'svelte';

	let { label, value, icon }: { label: string; value: string; icon?: Snippet } = $props();
</script>

<div class="flex items-center gap-4 rounded border border-border bg-surface p-5">
	{#if icon}
		<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-bg text-accent">
			{@render icon()}
		</div>
	{/if}
	<div class="flex flex-col gap-1">
		<span class="text-sm text-muted">{label}</span>
		<span class="font-mono text-2xl font-semibold text-ink">{value}</span>
	</div>
</div>
