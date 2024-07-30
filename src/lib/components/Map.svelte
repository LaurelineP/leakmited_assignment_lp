<script lang="ts">
    
    import { addRoadsLayer, addSource, initializeMap, layerId, onFeatureClick } from '$lib/utils/map.utils';
    import mapboxgl from 'mapbox-gl';
    import { onMount } from 'svelte';
    import Panel from './Panel.svelte';

	let {
        SECRET_MAPBOX_TOKEN,
        SECRET_MAPBOX_STYLE,
        SECRET_MAPBOX_TILESET_ID,
        SECRET_LAYER_ID
    } = $$props
    

    let mapElement: HTMLDivElement;
    let map: mapboxgl.Map;

    const zoom = 8.5;
    const initialView: [number, number] = [2.6, 48.7]; // IDF Coordinates IDF
    const mapId = 'Mapbox';

    const mapboxSourceOptions = {
        zoom,
        container: mapId,
        style: SECRET_MAPBOX_STYLE,
        center: initialView,
    }

	
    onMount(async () => {
        if (typeof window !== 'undefined') {

            map = await initializeMap(
                SECRET_MAPBOX_TOKEN,
                mapboxSourceOptions
            );

            // Functionalities
            map.once('load', async() => {
                // loads source tileset
                addSource(map, SECRET_MAPBOX_TILESET_ID);

                // loads layer roads
                addRoadsLayer( map, SECRET_LAYER_ID )
                
                // 
                map.addControl(new mapboxgl.NavigationControl());
                map.on('click', layerId, onFeatureClick)
            })
	}});
</script>

<svelte:head>
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

 <div class = 'Map'>
     <Panel
        title = "Layer controls"
        extraClass = "z-20 w-[250px] h-[50vh] top-[25%] right-0 m-5 shadow-neutral-400"
        >
        <div class = "w-[220px]">
            <h1 class = "tracking-widest uppercase text-slate-400 flex justify-center my-2">
                Layer' controls
            </h1>
            <hr/>
             <div class = "flex w-[100%] justify-between my-3 p-4">
                <label for = "road-max-speed">speed limit: </label>
                <input
                    id = "road-max-speed"
                    class = "rounded p-0.5 w-16 ml-2 outline-none"
                    type = "number"
                    step = 5
                    min = 0
                />
             </div>
        </div>
     
     </Panel>
    <div 
        id = {mapId}
        class = "w-screen h-screen"
        bind:this={mapElement}
    />
 </div>
