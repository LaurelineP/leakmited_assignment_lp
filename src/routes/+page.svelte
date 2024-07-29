<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import Widget from '$lib/components/Widget.svelte';
	

	const widgets = [
		{ id: 'widget-road', name: 'road'},
		{ id: 'widget-map', name: 'map'},
		{ id: 'widget-smth', name: 'smth'}
	];

	const deleteWidget = () => {

	}

</script>

<main id = 'App' class = "h-screen w-full flex">
	<Panel>
		{#each widgets as { id, name } }
			<Widget {id} {name} />
		{/each}
	</Panel >
	<Map />
</main>
