<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Widget from '$lib/components/widgets/Widget.svelte';
	import type { DataInfo } from '$lib/utils/types/app-data.types.js';

	export let data;
	const { SECRET_MAPBOX_TOKEN, SECRET_MAPBOX_TILESET_ID, SECRET_LAYER_ID, SECRET_MAPBOX_STYLE } =
		data;
	$: info = {} as DataInfo;
	$: widgets = [
		{ id: 'widget-map', data: { isLoaded: !!info?.widgets?.map, ...info?.widgets?.map } },
		{ id: 'widget-selection', data: info?.widgets?.selection }
	];

	const handleMapChanges = (e) => {
		info = e.detail.payload;
	};

	const handleMapSelection = (e) => {
		if (info.widgets) {
			info.widgets.selection = {
				...info.widgets.selection,
				...e.detail.payload
			};
		}
	};
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		rel="preload" as="style"
		href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap"
	/>
	<noscript>
		<link
		  rel="stylesheet"
		  href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap"
		/>
	</noscript>
</svelte:head>

<main id="App" class="h-screen w-full flex">
	<Panel isMainLayout isClosable title="Leakmited" extraClass="shadow-neutral-400 z-10 bg-white ">
		{#each widgets as { id, data } (id)}
			<Widget {id} bind:data />
		{/each}
	</Panel>
	<Map
		on:mapChanges={handleMapChanges}
		on:mapSelection={handleMapSelection}
		{SECRET_MAPBOX_TOKEN}
		{SECRET_MAPBOX_STYLE}
		{SECRET_MAPBOX_TILESET_ID}
		{SECRET_LAYER_ID}
	/>
</main>
