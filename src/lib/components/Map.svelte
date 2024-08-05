<script lang="ts">
	import {
		addRoadsLayer,
		addRoadsSource,
		filterRoads,
		getMapViewLayerRoadsInfos,
		initializeMap,
		layersRoadsId,
		roadEvents,
		sourceId
	} from '$lib/utils/mapbox.utils';
	import type { DataInfo } from '$lib/utils/types/app-data.types';
	import mapboxgl from 'mapbox-gl';
	import { createEventDispatcher, onMount } from 'svelte';
	import DuetRangeInputs from './DuetRangeInputs.svelte';
	import Panel from './Panel.svelte';
	const dispatch = createEventDispatcher();

	export let SECRET_MAPBOX_TOKEN, SECRET_MAPBOX_STYLE, SECRET_MAPBOX_TILESET_ID, SECRET_LAYER_ID;

	/* ------------------------------- Widget Data ------------------------------ */
	let info: Partial<DataInfo> = {};
	const updateWidgetsInfos = (map: mapboxgl.Map) => {
		info = getMapViewLayerRoadsInfos(map);
		dispatch('mapChanges', { payload: info });
	};

	const resetWidgetSelection = () => {
		dispatch('mapSelection', {
			payload: {
				isLoaded: true,
				roads: []
			}
		});
	};

	/* ----------------------- MapBox configuration items ----------------------- */
	let map: mapboxgl.Map;
	let currentMaxSpeed = 50;

	const initialView: [number, number] = [2.32, 48.85]; // IDF Coordinates IDF
	const mapId = 'Mapbox';

	const mapboxSourceOptions = {
		zoom: 7,
		container: mapId,
		style: SECRET_MAPBOX_STYLE,
		center: initialView,
		pitch: 40
	};

	/* ---------------------------- Map configuration --------------------------- */
	onMount(async () => {
		if (typeof window !== 'undefined') {
			// Map creation
			map = await initializeMap(SECRET_MAPBOX_TOKEN, mapboxSourceOptions);

			// Map custom setups
			map.once('load', async (e) => {
				// Loads source tileset - source for roads layer tiles
				addRoadsSource(map, SECRET_MAPBOX_TILESET_ID);

				// Creates a layer based on the previous source road loaded;
				await addRoadsLayer(map, SECRET_LAYER_ID, currentMaxSpeed);

				// Adds button control to zoom in and out
				map.addControl(new mapboxgl.NavigationControl());

				// Initializes data in widget(s) - from each tiles
				map.on('data', layersRoadsId, (e) => {
					if (e.dataType === 'source' && e.sourceId === sourceId) {
						const source = map.getSource(sourceId);
						if (source?.loaded()) {
							updateWidgetsInfos(map);
							dispatch('mapSelection', {
								payload: {
									isLoaded: true,
									roads: null
								}
							});
						}
					}
				});

				// Adds user interactions
				map
					// opens a tooltip
					.on('click', layersRoadsId, (e) => {
						const selectedData = roadEvents.click(e);
						dispatch('mapSelection', {
							payload: {
								isLoaded: true,
								roads: selectedData || null
							}
						});
					})
					// Add click event listener to the map container
					.on('click', (e) => {
						const features = map.queryRenderedFeatures(e.point, {
							layers: [layersRoadsId]
						});

						if (features.length === 0) {
							dispatch('mapSelection', {
								payload: {
									isLoaded: true,
									roads: null
								}
							});
						}
					})

					// removes the tooltip & selected data
					.on('mousemove', layersRoadsId, roadEvents.mouseMove)
					.on('mouseleave', layersRoadsId, roadEvents.mouseLeave)

					// update data based on viewport zoom change
					.on('zoomend', layersRoadsId, () => {
						updateWidgetsInfos(map);
						dispatch('mapSelection', {
							payload: {
								isLoaded: true,
								roads: null
							}
						});
					});
			});

			// Progressive zoom in transition on landing the app
			map.flyTo({
				zoom: 12,
				duration: 5000,
				essential: true
			});
		}
	});

	// On input ( range | number ) changes, filters the map and updates info
	const handleInputChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const inputId = target.id.includes('roads__') && target.id.split('__')[1];
		const value = JSON.parse(target.value);

		if (inputId === 'maxspeed') {
			currentMaxSpeed = value;
			filterRoads(map, [['>=', inputId, value]]);
			updateWidgetsInfos(map);
		}
	};
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="Map">
	<Panel extraClass="z-20 w-[300px] bottom-5 right-0 m-5 shadow-neutral-400">
		<slot />
		<div class="w-[250px]">
			<h1 class="tracking-widest uppercase text-slate-400 flex justify-center my-2">
				Layer's controls
			</h1>
			<hr />
			<div class="flex w-[100%] justify-between my-3 p-4">
				<label for="roads__maxspeed" class="text-sm">min. speed: </label>
				<DuetRangeInputs onChange={handleInputChange} value={currentMaxSpeed} />
			</div>
		</div>
	</Panel>
	<div id={mapId} class="w-screen h-screen" />
</div>
