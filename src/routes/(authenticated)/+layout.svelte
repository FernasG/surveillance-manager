<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { clearSession } from '$lib/api/auth';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();

	function handleSignOut() {
		clearSession();
		goto(resolve('/'));
	}
</script>

<div class="flex min-h-screen">
	<Sidebar />
	<div class="flex min-h-screen flex-1 flex-col">
		<header class="flex items-center justify-between border-b border-border px-6 py-4">
			<span class="font-mono text-xs tracking-wide text-muted uppercase">Surveillance Manager</span>
			<button
				type="button"
				onclick={handleSignOut}
				class="rounded border border-border px-3 py-1.5 text-sm text-muted transition-colors duration-150 hover:border-primary hover:text-ink"
			>
				Sign out
			</button>
		</header>
		<main class="flex-1 overflow-y-auto">
			{@render children()}
		</main>
	</div>
</div>
