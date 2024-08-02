<script lang="ts">
    import { addRoadsLayer, addRoadsSource, filterRoads, initializeMap, layersRoadsId, roadEvents } from '$lib/utils/mapbox.utils';
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
    let currentMaxSpeed = 1;

    const zoom = 8.5;
    const initialView: [number, number] = [2.4, 48.7]; // IDF Coordinates IDF
    const mapId = 'Mapbox';

    const mapboxSourceOptions = {
        zoom,
        container: mapId,
        style: SECRET_MAPBOX_STYLE,
        center: initialView,
        pitch: 40,
        bearing: 41,
    }

	
    onMount(async () => {
        if (typeof window !== 'undefined') {

            map = await initializeMap(
                SECRET_MAPBOX_TOKEN,
                mapboxSourceOptions
            );

            let hoveredRoadId = null;
            // Functionalities
            map.once('load', async() => {
                // loads source tileset
                addRoadsSource(map, SECRET_MAPBOX_TILESET_ID);

                // loads layer roads --> TODO: next - use returned info in Panel widget;
                const details = addRoadsLayer( map, SECRET_LAYER_ID )
                
                // map controllers
                map.addControl(new mapboxgl.NavigationControl());

                // map event handlers
                map.on('click', layersRoadsId, roadEvents.click );
                map.on('mousemove', layersRoadsId, roadEvents.mouseMove );
                map.on('mouseleave', layersRoadsId, roadEvents.mouseLeave );
            });
	}});


    const handleInputChange = e => {
        const inputId = e.target.id.includes('roads__') &&  e.target.id.split('__')[1];
        const value = JSON.parse(e.target.value);

        if( inputId === 'maxspeed'){
            const infos = filterRoads(map, [[ 'sup', inputId, value ]]);
            console.log('infos:', infos)
            currentMaxSpeed = value;
        }
    }
</script>

<svelte:head>
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>


 <div class = 'Map'>
     <Panel  extraClass = "z-20 w-[300px] bottom-5 right-0 m-5 shadow-neutral-400">
        <slot/>
        <div class = "w-[250px]">
            <h1 class = "tracking-widest uppercase text-slate-400 flex justify-center my-2">
                Layer's controls
            </h1>
            <hr/>
             <div class = "flex w-[100%] justify-between my-3 p-4">
                <label for = "roads__maxspeed" class = "text-sm">min. speed: </label>
                <div class = "duet-speed-input flex justify-between space-x-3 w-[50%]">
                    <input
                        on:change = {handleInputChange}
                        bind:value = {currentMaxSpeed}
                        id = "roads__maxspeed__range"
                        class = "rounded p-0.5 w-16 ml-2 outline-none cursor-pointer"
                        type = "range"
                        step = 5
                        min = 0
                        max = 200
                    />

                    <input
                        on:change = {handleInputChange}
                        bind:value = {currentMaxSpeed}
                        id = "roads__maxspeed__value"
                        class = "rounded p-0.5 w-[40px] ml-2 outline-none cursor-pointer text-sm w-[20px]"
                        type = "number"
                        step = 5
                        min = 0
                        max = 200
                    />
                </div>
             </div>
        </div>
     
     </Panel>
    <div 
        id = { mapId }
        class = "w-screen h-screen"
        bind:this = { mapElement }
    />
 </div>

 <style lang='postcss'> 
    [type="number"]::-webkit-inner-spin-button, 
    [type="number"]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    } 

    [type="number"] { 
        -moz-appearance: textfield; 
    } 
</style> 