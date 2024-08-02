

<script lang="ts">
	// import Map from '$lib/components/Map.svelte';
	import Map from '$lib/components/Map.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Widget from '$lib/components/Widget.svelte';

	export let data;
	const { SECRET_MAPBOX_TOKEN, SECRET_MAPBOX_TILESET_ID, SECRET_LAYER_ID, SECRET_MAPBOX_STYLE } = data;

	const widgets = [
		{ id: 'widget-road', name: 'road'},
		{ id: 'widget-map', name: 'map'},
		{ id: 'widget-smth', name: 'smth'}
	];

</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin = "true">
	<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet">
</svelte:head>

<main id = 'App' class = "h-screen w-full flex">
	<Panel isMainLayout isClosable
		title = "Leakmited"
		extraClass = "shadow-neutral-400 z-10">
		{#each widgets as { id, name } }
			<Widget {id} {name} />
		{/each}
	</Panel >
	<Map 
		{SECRET_MAPBOX_TOKEN}
		{SECRET_MAPBOX_STYLE}
		{SECRET_MAPBOX_TILESET_ID}
		{SECRET_LAYER_ID}
	/>
</main>
