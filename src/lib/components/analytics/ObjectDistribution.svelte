<script lang="ts">
	import type { ObjectDistributionEntry } from '$lib/api/analytics';

	let { entries }: { entries: ObjectDistributionEntry[] } = $props();

	const ranked = $derived([...entries].sort((a, b) => b.count - a.count));
	const maxCount = $derived(Math.max(1, ...ranked.map((entry) => entry.count)));
</script>

<div class="rounded border border-border bg-surface p-5">
	<h2 class="text-sm font-medium text-ink">Object distribution</h2>
	<p class="mt-1 text-xs text-muted">Most frequently detected entities</p>

	{#if ranked.length === 0}
		<p class="mt-8 py-8 text-center text-sm text-muted">No detections recorded yet.</p>
	{:else}
		<ul class="mt-6 flex flex-col gap-3">
			{#each ranked as entry (entry.entity)}
				<li class="flex items-center gap-3">
					<span class="w-20 shrink-0 truncate text-sm text-ink capitalize">{entry.entity}</span>
					<div class="h-2 flex-1 overflow-hidden rounded-full bg-bg">
						<div
							class="h-full rounded-full bg-accent"
							style={`width: ${Math.max(2, (entry.count / maxCount) * 100)}%`}
						></div>
					</div>
					<span class="w-10 shrink-0 text-right font-mono text-xs text-muted">{entry.count}</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
