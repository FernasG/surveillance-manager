<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { login, storeSession } from '$lib/api/auth';

	let username = $state('');
	let password = $state('');
	let validationError = $state('');
	let submitError = $state('');
	let submitting = $state(false);

	function validate(): boolean {
		if (username.trim().length < 3 || password.length < 3) {
			validationError = 'Username and password must be at least 3 characters.';
			return false;
		}
		validationError = '';
		return true;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		submitError = '';
		if (!validate()) return;

		submitting = true;
		const result = await login(username, password);
		submitting = false;

		if (result.ok) {
			storeSession({ accessToken: result.accessToken, tokenType: result.tokenType });
			goto(resolve('/home'));
			return;
		}

		submitError =
			result.reason === 'invalid_credentials'
				? 'Invalid username or password.'
				: "Couldn't reach the server. Please try again.";
	}
</script>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 flex items-center gap-2">
			<span class="h-2 w-2 rounded-full bg-accent"></span>
			<span class="font-mono text-xs tracking-wide text-muted uppercase">Surveillance Manager</span>
		</div>

		<form onsubmit={handleSubmit} class="rounded-md border border-border bg-surface p-6" novalidate>
			<h1 class="mb-6 text-lg font-semibold text-ink">Sign in</h1>

			<div class="mb-4">
				<label class="mb-1.5 block text-sm text-muted" for="username">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					bind:value={username}
					autocomplete="username"
					class="w-full rounded border border-border bg-bg px-3 py-2 text-ink transition-colors duration-150 outline-none focus:border-primary"
				/>
			</div>

			<div class="mb-5">
				<label class="mb-1.5 block text-sm text-muted" for="password">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					bind:value={password}
					autocomplete="current-password"
					class="w-full rounded border border-border bg-bg px-3 py-2 text-ink transition-colors duration-150 outline-none focus:border-primary"
				/>
			</div>

			{#if validationError}
				<p class="mb-4 text-sm text-primary" role="alert">{validationError}</p>
			{/if}

			{#if submitError}
				<p class="mb-4 text-sm text-primary" role="alert">{submitError}</p>
			{/if}

			<button
				type="submit"
				disabled={submitting}
				class="w-full rounded bg-primary px-3 py-2 font-medium text-ink transition-colors duration-150 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
			>
				{submitting ? 'Signing in…' : 'Sign in'}
			</button>
		</form>
	</div>
</div>
