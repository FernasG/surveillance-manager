<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { clearSession } from '$lib/api/auth';

	function handleSignOut() {
		clearSession();
		goto(resolve('/'));
	}
</script>

<div class="min-h-screen">
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

	<main class="flex flex-col items-center justify-center px-4 py-24 text-center">
		<div
			class="mb-4 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2"
		>
			<span class="h-2 w-2 rounded-full bg-accent"></span>
			<span class="text-sm text-ink">All systems normal</span>
		</div>
		<p class="max-w-sm text-sm text-muted">
			No cameras connected yet. Once feeds are configured, their status will appear here.
		</p>
	</main>
</div>
