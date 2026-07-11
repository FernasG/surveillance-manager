import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthHeader, type StoredSession } from '$lib/api/auth';
import { buildMediaUrl } from '$lib/api/videos';

export type SearchResult = {
	videoName: string;
	elapsedMs: number;
	description: string;
	confidenceScore: number;
	frameBase64: string | null;
};

export type QueryResult = { ok: true; data: SearchResult[] } | { ok: false; reason: 'server_error' };

function parseVideoName(videoPath: string): string {
	const segments = videoPath.split('/');
	return segments[segments.length - 1];
}

export async function postQuery(text: string): Promise<QueryResult> {
	const authHeader = getAuthHeader();
	let response: Response;
	try {
		response = await fetch(`${PUBLIC_API_URL}/query`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(authHeader ? { Authorization: authHeader } : {})
			},
			body: JSON.stringify({ text })
		});
	} catch {
		return { ok: false, reason: 'server_error' };
	}

	if (!response.ok) {
		return { ok: false, reason: 'server_error' };
	}

	const body = await response.json().catch(() => null);
	if (!body || !Array.isArray(body.results)) {
		return { ok: false, reason: 'server_error' };
	}

	const data: SearchResult[] = body.results.map((result: Record<string, unknown>) => ({
		videoName: parseVideoName(String(result.video_path)),
		elapsedMs: Number(result.elapsed_ms),
		description: String(result.description),
		confidenceScore: Number(result.confidence_score),
		frameBase64: typeof result.frame_base64 === 'string' ? result.frame_base64 : null
	}));

	return { ok: true, data };
}

export function searchResultStreamUrl(videoName: string, session: StoredSession): string {
	return buildMediaUrl(`${PUBLIC_API_URL}/videos/${videoName}/playback`, session);
}
