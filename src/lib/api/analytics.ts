import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthHeader } from '$lib/api/auth';

export type HeatmapPoint = {
	hour: string;
	count: number;
};

export type ObjectDistributionEntry = {
	entity: string;
	count: number;
};

export type OverallMetrics = {
	totalEventsOverall: number;
	heatmap: HeatmapPoint[];
	objectDistribution: ObjectDistributionEntry[];
};

export type GetOverallMetricsResult =
	{ ok: true; data: OverallMetrics } | { ok: false; reason: 'server_error' };

function parseHeatmap(raw: unknown): HeatmapPoint[] | null {
	if (!Array.isArray(raw)) return null;

	const points: HeatmapPoint[] = [];
	for (const entry of raw) {
		if (typeof entry?.hour !== 'string' || typeof entry?.count !== 'number') return null;
		points.push({ hour: entry.hour, count: entry.count });
	}
	return points;
}

function parseObjectDistribution(raw: unknown): ObjectDistributionEntry[] | null {
	if (!Array.isArray(raw)) return null;

	const entries: ObjectDistributionEntry[] = [];
	for (const entry of raw) {
		if (typeof entry?.entity !== 'string' || typeof entry?.count !== 'number') return null;
		entries.push({ entity: entry.entity, count: entry.count });
	}
	return entries;
}

export async function getOverallMetrics(): Promise<GetOverallMetricsResult> {
	const authHeader = getAuthHeader();
	let response: Response;
	try {
		response = await fetch(`${PUBLIC_API_URL}/metrics/overall`, {
			headers: authHeader ? { Authorization: authHeader } : {}
		});
	} catch {
		return { ok: false, reason: 'server_error' };
	}

	if (!response.ok) {
		return { ok: false, reason: 'server_error' };
	}

	const body = await response.json().catch(() => null);
	const totalEventsOverall = body?.summary?.total_events_overall;
	const heatmap = parseHeatmap(body?.heatmap);
	const objectDistribution = parseObjectDistribution(body?.object_distribution);

	if (typeof totalEventsOverall !== 'number' || !heatmap || !objectDistribution) {
		return { ok: false, reason: 'server_error' };
	}

	return { ok: true, data: { totalEventsOverall, heatmap, objectDistribution } };
}
