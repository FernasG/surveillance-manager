<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { isSidebarCollapsed, toggleSidebar } from '$lib/stores/sidebar.svelte';

	const navItems = [
		{ label: 'Home', path: '/home' as const, icon: 'home' as const },
		{ label: 'Video Archive', path: '/archive' as const, icon: 'archive' as const },
		{ label: 'Semantic Search', path: '/search' as const, icon: 'search' as const },
		{ label: 'Analytics', path: '/analytics' as const, icon: 'analytics' as const }
	];

	function isActive(path: '/home' | '/archive' | '/search' | '/analytics'): boolean {
		return page.url.pathname === resolve(path);
	}
</script>

<aside
	class="flex shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 ease-out"
	class:w-16={isSidebarCollapsed()}
	class:w-64={!isSidebarCollapsed()}
>
	<div class="flex items-center justify-end p-3">
		<button
			type="button"
			onclick={toggleSidebar}
			aria-label={isSidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'}
			class="flex cursor-pointer h-8 w-8 items-center justify-center rounded border border-border text-muted transition-colors duration-150 hover:border-primary hover:text-ink"
		>
			<svg
				class="h-4 w-4 transition-transform duration-200 ease-out"
				class:rotate-180={isSidebarCollapsed()}
				viewBox="0 0 16 16"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				aria-hidden="true"
			>
				<path d="M10 3L5 8l5 5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
	</div>

	<nav class="flex flex-col gap-1 px-2" aria-label="Main">
		{#each navItems as item (item.path)}
			<a
				href={resolve(item.path)}
				title={item.label}
				aria-current={isActive(item.path) ? 'page' : undefined}
				class="flex items-center gap-3 rounded px-2.5 py-2 text-sm transition-colors duration-150 hover:bg-surface-hover hover:text-ink"
				class:text-ink={isActive(item.path)}
				class:bg-surface-hover={isActive(item.path)}
				class:text-muted={!isActive(item.path)}
			>
				<span class="flex h-5 w-5 shrink-0 items-center justify-center">
					{#if item.icon === 'home'}
						<svg
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							class="h-full w-full"
							aria-hidden="true"
						>
							<path d="M3 9.5L10 4l7 5.5" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M5 8.5V16h10V8.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					{:else if item.icon === 'archive'}
						<svg
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							class="h-full w-full"
							aria-hidden="true"
						>
							<rect x="3" y="6" width="14" height="10" rx="1" />
							<path d="M3 6l2-3h10l2 3" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M8.5 10.5l1.5 1.5 1.5-1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					{:else if item.icon === 'search'}
						<svg
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							class="h-full w-full"
							aria-hidden="true"
						>
							<circle cx="8.5" cy="8.5" r="5" />
							<path d="M15.5 15.5L12.5 12.5" stroke-linecap="round" />
						</svg>
					{:else}
						<svg
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							class="h-full w-full"
							aria-hidden="true"
						>
							<path d="M4 16V10M10 16V4M16 16V12" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					{/if}
				</span>
				{#if !isSidebarCollapsed()}
					<span class="whitespace-nowrap">{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>
</aside>
