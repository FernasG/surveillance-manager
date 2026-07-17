<script lang="ts">
	import type { HeatmapPoint } from '$lib/api/analytics';

	let { points }: { points: HeatmapPoint[] } = $props();

	const sorted = $derived([...points].sort((a, b) => a.hour.localeCompare(b.hour)));
	const maxCount = $derived(Math.max(1, ...sorted.map((p) => p.count)));

	function formatHour(hour: string): string {
		return `${hour.padStart(2, '0')}:00`;
	}

	function barHeight(count: number): number {
		if (count <= 0) return 0;
		return Math.max(4, (count / maxCount) * 100);
	}
</script>

<div class="rounded border border-border bg-surface p-5">
	<h2 class="text-sm font-medium text-ink">Hourly activity</h2>
	<p class="mt-1 text-xs text-muted">Event count by hour of day</p>

	{#if sorted.length === 0}
		<p class="mt-8 py-8 text-center text-sm text-muted">No hourly activity recorded yet.</p>
	{:else}
		<div class="mt-6 flex items-end gap-1.5" role="img" aria-label="Event count by hour of day">
			{#each sorted as point (point.hour)}
				<div class="flex flex-1 flex-col items-center gap-1.5">
					<span class="font-mono text-[11px] text-muted">{point.count}</span>
					<div class="flex h-32 w-full items-end">
						<div
							class="w-full rounded-t bg-accent transition-[height] duration-300 ease-out"
							style={`height: ${barHeight(point.count)}%`}
							title={`${formatHour(point.hour)} — ${point.count} events`}
						></div>
					</div>
					<span class="font-mono text-[10px] text-muted">{formatHour(point.hour)}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
