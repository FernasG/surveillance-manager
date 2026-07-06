import { PUBLIC_API_URL } from '$env/static/public';
import { getAuthHeader, type StoredSession } from '$lib/api/auth';

export type Video = {
	video_name: string;
	thumbnail_url: string;
};

export type VideosPage = {
	videos: Video[];
	page: number;
	size: number;
	total_items: number;
	total_pages: number;
};

export type ListVideosParams = {
	page?: number;
	size?: number;
	startDate?: string;
	endDate?: string;
};

export type ListVideosResult =
	{ ok: true; data: VideosPage } | { ok: false; reason: 'server_error' };

export async function listVideos(params: ListVideosParams = {}): Promise<ListVideosResult> {
	const query = new URLSearchParams();
	if (params.page !== undefined) query.set('page', String(params.page));
	if (params.size !== undefined) query.set('size', String(params.size));
	if (params.startDate) query.set('start_date', params.startDate);
	if (params.endDate) query.set('end_date', params.endDate);

	const authHeader = getAuthHeader();
	let response: Response;
	try {
		response = await fetch(`${PUBLIC_API_URL}/videos/?${query.toString()}`, {
			headers: authHeader ? { Authorization: authHeader } : {}
		});
	} catch {
		return { ok: false, reason: 'server_error' };
	}

	if (!response.ok) {
		return { ok: false, reason: 'server_error' };
	}

	const data = await response.json().catch(() => null);
	if (!data || !Array.isArray(data.videos)) {
		return { ok: false, reason: 'server_error' };
	}

	return { ok: true, data };
}

export function buildMediaUrl(url: string, session: StoredSession): string {
	const withToken = new URL(url);
	withToken.searchParams.set('token', session.accessToken);
	return withToken.toString();
}

export function videoStreamUrl(videoName: string, session: StoredSession): string {
	return buildMediaUrl(`${PUBLIC_API_URL}/videos/${videoName}`, session);
}
