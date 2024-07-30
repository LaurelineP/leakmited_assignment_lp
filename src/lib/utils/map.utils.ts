import mapboxgl, { type FilterSpecification, type GeoJSONFeature, type MapOptions } from 'mapbox-gl';
export const layerId = 'mapRoads';
export const sourceId = 'IDFSource';



export const addLayer = (map: mapboxgl.Map, SECRET_LAYERS_ID: string, filters: string[] = []) => {
	const sourceFeatures = map.querySourceFeatures(sourceId, {
		sourceLayer: SECRET_LAYERS_ID
	});

	const filteredFeatures: Array<GeoJSONFeature> = []


	map.addSource(sourceId, {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: filteredFeatures
		}
	});

	map.addLayer({
		'id': layerId,
		'type': 'line', // Change to the appropriate type (e.g., 'fill', 'circle', etc.)
		'source': sourceId,
		'layout': {},
		'paint': {
			'line-color': '#fa0',
			'line-width': 1
		}
	});
}

export const filterRoads = (map: mapboxgl.Map, filters: string[] = []) => {
	map.setFilter(layerId, ['>=', ['get', 'maxspeed'], 1] as FilterSpecification)
}


/** Adds all road layers */
export const addRoadsLayer = (map: mapboxgl.Map, SECRET_LAYER_ID: string) => {
	map.addLayer(
		{
			id: layerId,
			source: sourceId,
			'source-layer': SECRET_LAYER_ID,
			type: 'line',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'

			},
			paint: {
				'line-color': '#E9C46A',
				'line-width': 1
			}
		},
	);

	const features = map.querySourceFeatures(sourceId, {
		sourceLayer: SECRET_LAYER_ID
	});

	// Example of filtering features
	const maxSpeedFeatures = features.filter((feature: GeoJSONFeature) => {
		// Replace with your filtering logic

		return !!feature?.properties?.['maxspeed'];
	});




	console.table({ all: features.length, maxSpeedFilter: maxSpeedFeatures.length })
}

/** Click handler to get info */
export const onFeatureClick = (e) => {
	console.log(e.features)
	// new mapboxgl.Popup()
	// 	.setLngLat(e.lngLat)
	// 	.setHTML(e.features[0].properties.yourProperty)
	// 	.addTo(map);
}
export const addSource = (map: mapboxgl.Map, SECRET_MAPBOX_TILESET_ID: string) => {
	map.addSource(sourceId, {
		type: 'vector',
		url: `mapbox://${SECRET_MAPBOX_TILESET_ID}`,
		interactive: true,
		interactiveLayerIds: [layerId],
		trackResize: true,
	});
}


/** Instantiate MapboxGl with config */
export const initializeMap = (
	SECRET_MAPBOX_TOKEN: string,
	options: MapOptions
) => {
	mapboxgl.accessToken = SECRET_MAPBOX_TOKEN;
	const map = new mapboxgl.Map({
		...options,
		interactive: true,
		trackResize: true
	});
	return map;
}

