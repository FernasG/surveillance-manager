import { PUBLIC_API_URL } from '$env/static/public';

const SESSION_STORAGE_KEY = 'auth_session';

export type StoredSession = {
	accessToken: string;
	tokenType: string;
};

export type LoginResult =
	({ ok: true } & StoredSession) | { ok: false; reason: 'invalid_credentials' | 'server_error' };

export async function login(username: string, password: string): Promise<LoginResult> {
	let response: Response;
	try {
		response = await fetch(`${PUBLIC_API_URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
	} catch {
		return { ok: false, reason: 'server_error' };
	}

	if (!response.ok) {
		const reason =
			response.status === 400 || response.status === 401 ? 'invalid_credentials' : 'server_error';
		return { ok: false, reason };
	}

	const body = await response.json().catch(() => null);
	if (typeof body?.access_token !== 'string' || typeof body?.token_type !== 'string') {
		return { ok: false, reason: 'server_error' };
	}

	return { ok: true, accessToken: body.access_token, tokenType: body.token_type };
}

export function storeSession(session: StoredSession): void {
	localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getStoredSession(): StoredSession | null {
	const raw = localStorage.getItem(SESSION_STORAGE_KEY);
	if (!raw) return null;

	try {
		const parsed = JSON.parse(raw);
		if (typeof parsed?.accessToken !== 'string' || typeof parsed?.tokenType !== 'string') {
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

export function hasValidSession(): boolean {
	return getStoredSession() !== null;
}

export function clearSession(): void {
	localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getAuthHeader(): string | null {
	const session = getStoredSession();
	if (!session) return null;
	return `${session.tokenType} ${session.accessToken}`;
}
