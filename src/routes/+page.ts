import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { hasValidSession } from '$lib/api/auth';

export function load() {
	if (browser && hasValidSession()) {
		redirect(307, '/home');
	}
}
