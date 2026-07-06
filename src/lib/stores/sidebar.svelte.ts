const STORAGE_KEY = 'sidebar_collapsed';

let collapsed = $state(false);

if (typeof localStorage !== 'undefined') {
	collapsed = localStorage.getItem(STORAGE_KEY) === 'true';
}

export function isSidebarCollapsed(): boolean {
	return collapsed;
}

export function toggleSidebar(): void {
	collapsed = !collapsed;
	localStorage.setItem(STORAGE_KEY, String(collapsed));
}
