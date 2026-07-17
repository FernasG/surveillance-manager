<script lang="ts">
	import { browser } from '$app/environment';
	import { getOverallMetrics, type OverallMetrics } from '$lib/api/analytics';
	import StatCard from '$lib/components/StatCard.svelte';
	import HourlyTrendChart from '$lib/components/analytics/HourlyTrendChart.svelte';
	import ObjectDistribution from '$lib/components/analytics/ObjectDistribution.svelte';

	let metrics = $state<OverallMetrics | null>(null);
	let loading = $state(true);
	let errored = $state(false);

	async function loadMetrics() {
		loading = true;
		const result = await getOverallMetrics();
		loading = false;

		if (!result.ok) {
			errored = true;
			return;
		}

		errored = false;
		metrics = result.data;
	}

	if (browser) loadMetrics();
</script>

<svelte:head>
	<title>Pi Guard | Analytics</title>
	<meta name="description" content="Overall system activity and detection analytics." />
</svelte:head>

<div class="flex flex-col gap-6 p-6">
	<div>
		<h1 class="text-lg font-semibold text-ink">Analytics</h1>
		<p class="mt-1 text-sm text-muted">Overall activity and detection trends across the system.</p>
	</div>

	{#if loading}
		<p class="text-sm text-muted">Loading metrics…</p>
	{:else if errored}
		<p class="text-sm text-primary" role="alert">Couldn't load analytics. Please try again.</p>
	{:else if metrics}
		<StatCard label="Total events" value={metrics.totalEventsOverall.toLocaleString()}>
			{#snippet icon()}
				<svg
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="h-5 w-5"
					aria-hidden="true"
				>
					<path d="M4 16V10M10 16V4M16 16V12" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			{/snippet}
		</StatCard>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<HourlyTrendChart points={metrics.heatmap} />
			<ObjectDistribution entries={metrics.objectDistribution} />
		</div>
	{/if}
</div>
