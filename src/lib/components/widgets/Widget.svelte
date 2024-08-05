<script lang="ts">
	import type { WidgetMapData, WidgetSelectedData } from '$lib/utils/types/app-data.types';
	import WidgetMapContent from './WidgetMapContent.svelte';
	import WidgetSelectionContent from './WidgetSelectionContent.svelte';

	export let id: string;
	export let data: WidgetMapData | WidgetSelectedData;

	const widgetName = id.replace(/widget-/, '');

	$: contentComponent =
		id === 'widget-map' ? WidgetMapContent : 'widget-selection' ? WidgetSelectionContent : null;
</script>

<div
	{id}
	class="Widget shadow-xl min-w-[250px] min-w-h-[130px] bg-slate-100 rounded m-3 p-6 box-content"
>
	<h1 class="text-slate-400">{widgetName}</h1>

	{#if contentComponent && data?.isLoaded}
		<svelte:component this={contentComponent} bind:data />

		<!-- Placeholder on loading -->
	{:else}
		<div
			class="animate-pulse w-full h-[60%]
			bg-slate-300 flex items-center
			justify-items-center rounded p-2 my-1"
		/>
	{/if}
</div>
