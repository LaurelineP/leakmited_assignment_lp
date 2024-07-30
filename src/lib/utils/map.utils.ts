import mapboxgl, { type FilterSpecification, type GeoJSONFeature, type MapOptions } from 'mapbox-gl';
export const layerId = 'roads';
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
				'line-cap': 'round',
			},
			paint: {
				'line-color': '#E9C46A',
				'line-width': 2
			},
		},
	);

	// Filter right away to road with maxspeed 
	const features = map.querySourceFeatures(sourceId, {
		sourceLayer: SECRET_LAYER_ID
	});

	const maxSpeedFeatures = features.filter((feature: GeoJSONFeature) => {
		return !!feature?.properties?.['maxspeed'];
	});

	filterRoads(map)

}

/** Click handler to get info */
export const onFeatureClick = (e) => {
	const roadsFeatures = e.features;

	function getFeaturesHTML(features: GeoJSONFeature[]) {
		let strrr = features.map(f => {
			const featureStr = [];
			if (f.properties) {
				let lis = '';
				const propertiesEntries = Object.entries(f.properties);
				for (let i = 0; i < propertiesEntries.length; i++) {
					lis += `<li>${propertiesEntries[i][0]}: ${propertiesEntries[i][1]}</li>`;
					if (i === propertiesEntries.length - 1) {
						featureStr.push(lis);
						lis = ''
					}
				}
			}
			return featureStr.join('');
		})
		return strrr
	}

	const itemsStr = getFeaturesHTML(roadsFeatures)


	const content = `<ul>${itemsStr}</ul>`

	new mapboxgl.Popup()
		.setLngLat(e.lngLat)
		.setHTML(content)
		.addTo(map);
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

