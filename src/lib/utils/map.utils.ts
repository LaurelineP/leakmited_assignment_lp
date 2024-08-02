import mapboxgl, { type FilterSpecification, type GeoJSONFeature, type MapOptions } from 'mapbox-gl';
export const layerId = 'roads';
export const sourceId = 'IDFSource';

export const filterRoads = (map: mapboxgl.Map, filters: [string, string, number | string][] = []) => {
	if (!filters.length) return;
	const infos: Record<string, string | number | null> = {
		count: null
	}

	filters?.forEach(filter => {
		const [operator, field, value] = filter;
		let _operator;
		switch (operator) {
			case 'sup':
				_operator = '>=';
				break;
			case 'inf':
				_operator = '<=';
				break;
			case 'eq':
				_operator = '==';
				break;
			default:
				_operator = '';
				break;
		}
		if (filter.length === 3 && _operator) {
			map.setFilter(layerId, [_operator, ['get', field], value] as FilterSpecification)
			const remaining = map.queryRenderedFeatures();

			// info details
			infos.count = remaining.length;
		}
	})

	return infos;
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


	const infos = filterRoads(map, [['sup', 'maxspeed', 1]]);
}

/** Click handler to get info */
export const onFeatureClick = (e) => {
	const map = e.target;
	const roadsFeatures = e.features;

	function getFeaturesHTML(features: GeoJSONFeature[]) {
		const liElementsCollection = features.map(f => {
			const featureStr = [];
			if (f.properties) {
				let liElements = [];
				let listTitle = ''
				const propertiesEntries = Object.entries(f.properties);


				// handles items  - li elements and title
				for (let i = 0; i < propertiesEntries.length; i++) {
					const [field, value] = propertiesEntries[i];
					if (field === 'name') {
						listTitle = `<h1>${value}</h1>`;
					} else {

						// adds item element
						liElements.push(`<li>${field}: ${value}`);

						// handle the end of properties traversal
						if (i === propertiesEntries.length - 1) {

							liElements.unshift(`<div class="border p-2"><h1 class="flex justify-center">${listTitle}</h1><ul class="p-2">`)
							liElements.push(`</div></ul>`)
							featureStr.push(liElements.join(''));

							liElements = [];
						}
					}
				}
			}
			return featureStr.join('');
		})
		return liElementsCollection.join('');
	}
	const listElementsStr = getFeaturesHTML(roadsFeatures);
	const content = `<div class="p-2 overflow-y-auto h-[300px] w-15 space-y-6">${listElementsStr}</div>`;

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

