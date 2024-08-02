import mapboxgl, { type FilterSpecification, type GeoJSONFeature, type MapOptions } from 'mapbox-gl';
export const sourceId = 'IDFSource';
export const layersRoadsId = 'roads';
export const featureIdentifierProperty = 'osm_id';

// TODO: wherever `map` is reaceived as param: remove it and use e.target which is a map

/* -------------------------------------------------------------------------- */
/*                                  MAP SETUP                                 */
/* -------------------------------------------------------------------------- */

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

/** Adds all road layers */
export const addRoadsLayer = (map: mapboxgl.Map, SECRET_LAYER_ID: string) => {
	map.addLayer(
		{
			id: layersRoadsId,
			source: sourceId,
			'source-layer': SECRET_LAYER_ID,
			type: 'line',
			layout: {
				'line-join': 'round',
				'line-cap': 'round',
			},
			paint: {
				'line-color': [
					'case',
					['boolean', ['feature-state', 'hover'], false],
					'#F75',
					'#E9C46A',
				],
				'line-width': [
					'case',
					['boolean', ['feature-state', 'hover'], false],
					4,
					2,
				],
			},
		},
	);


	const infos = filterRoads(map, [['sup', 'maxspeed', 1]]);
	console.log('[ addRoads ] infos:', infos);

}


export const addRoadsSource = (map: mapboxgl.Map, SECRET_MAPBOX_TILESET_ID: string) => {
	map.addSource(sourceId, {
		type: 'vector',
		url: `mapbox://${SECRET_MAPBOX_TILESET_ID}`,
		interactive: true,
		interactivelayersRoadsIds: [layersRoadsId],
		trackResize: true,
		promoteId: 'osm_id'
	});
}


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
			map.setFilter(layersRoadsId, [_operator, ['get', field], value] as FilterSpecification)
			const remaining = map.queryRenderedFeatures();

			// info details
			infos.count = remaining.length;
		}
	})

	return infos;
}


let hoveredFeature;
export const roadEvents = {
	click: (e: mapboxgl.MapMouseEvent) => {
		const map = e.target
		const roadsFeatures = e.features;

		function getFeaturesHTML(features: GeoJSONFeature[] | undefined) {
			const liElementsCollection = features?.map(f => {
				const featureStr = [];
				if (f.properties) {
					let liElements = [];
					let listTitle = '';
					const propertiesEntries = Object.entries(f.properties);


					// handles items  - li elements and title
					for (let i = 0; i < propertiesEntries.length; i++) {
						const [field, value] = propertiesEntries[i];
						if (field === 'name') {
							listTitle = `<h1>${value || '-- unknown --'}</h1>`;
						}
						if (typeof value === 'string' && !value.length) {
							// ignores empty value
							continue;
						} else {
							// adds item element with content
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
			return liElementsCollection?.join('');
		}
		const listElementsStr = getFeaturesHTML(roadsFeatures);
		const content = `<div class="p-2 overflow-y-auto h-[250px] w-15 space-y-6">${listElementsStr}</div>`;

		new mapboxgl.Popup({
			className: 'bg-red',
			offset: 15,
			closeButton: false,
			closeOnMove: true,
			maxWidth: '200px'
		})
			.setLngLat(e.lngLat)
			.setHTML(content)
			.addTo(map);
	},
	mouseMove: (e: mapboxgl.MapMouseEvent) => {
		const map = e.target;
		const features = e?.features;

		if (!features?.length) return;

		// Remove the hover state for the previous feature
		if (hoveredFeature) {
			map.setFeatureState(
				{
					source: hoveredFeature.source,
					sourceLayer: hoveredFeature.sourceLayer,
					id: hoveredFeature.properties[featureIdentifierProperty],
				},
				{ hover: false }
			);
		}

		// Set the hover state for the new feature
		const feature = features?.[0];
		hoveredFeature = feature
		if (hoveredFeature && feature.properties) {
			map.setFeatureState(
				{
					source: hoveredFeature.source,
					sourceLayer: hoveredFeature.sourceLayer,
					id: feature.properties[featureIdentifierProperty],
				},
				{ hover: true }
			);
		}
	},
	mouseLeave: (e: mapboxgl.MapMouseEvent) => {
		const map = e.target;

		// Reset the hover state for the previously hovered feature
		if (hoveredFeature) {
			map.setFeatureState(
				{
					source: hoveredFeature.source,
					sourceLayer: hoveredFeature.sourceLayer,
					id: hoveredFeature.properties[featureIdentifierProperty],
				},
				{ hover: false }
			);
			hoveredFeature = undefined;
		}
	}
}
