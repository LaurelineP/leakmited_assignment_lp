
<!-- loading mapboxgl -->
<div
	id = "map"
	bind:this = { mapElement }
	class = "Map w-full h-full -mx-0.5 z-0"
	>
	<div class = "absolute">Map</div>
</div>

<script defer lang="ts">
	import mapboxgl from "mapbox-gl";
	import { onMount } from "svelte";
  
	let mapElement: string | HTMLElement;
	let map = null;
	let accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
	let mapStyle = "mapbox://styles/mapbox/light-v9";
	let viewState = {
	  longitude: -118.2443409,
	  latitude: 34.0544779,
	  zoom: 2,
	  pitch: 0,
	  bearing: 0,
	};
  
	onMount(() => {
	  createMap();
	});
  
	function createMap() {
	  map = new mapboxgl.Map({
		accessToken: accessToken,
		container: mapElement,
		interactive: true,
		style: mapStyle,
		center: [viewState.longitude, viewState.latitude],
		zoom: viewState.zoom,
		pitch: viewState.pitch,
		bearing: viewState.bearing,
	  });
	}
  </script>
