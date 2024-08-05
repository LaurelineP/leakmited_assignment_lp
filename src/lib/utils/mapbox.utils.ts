import mapboxgl, {
	type FilterSpecification,
	type GeoJSONFeature,
	type MapOptions
} from 'mapbox-gl';

import { metrics } from './mapMetrics.utils';
import type { DataInfo, WidgetSelectedData } from './types/app-data.types';
import type { MapboxFilter } from './types/mapbox.utils.types';
export const sourceId = 'IDFSource';
export const layersRoadsId = 'roads';
export const featureIdentifierProperty = 'osm_id';

/* -------------------------------------------------------------------------- */
/*                                  MAP SETUP                                 */
/* -------------------------------------------------------------------------- */

/** Instantiate MapboxGl with config */
export const initializeMap = (SECRET_MAPBOX_TOKEN: string, options: MapOptions) => {
	mapboxgl.accessToken = SECRET_MAPBOX_TOKEN;
	const map = new mapboxgl.Map({
		...options,
		interactive: true,
		trackResize: true
	});
	return map;
};

/** Adds all road layers
 * - from an existing source layer, adds line typed layer
 * 	- with colors, width customizations
 */
export const addRoadsLayer = (
	map: mapboxgl.Map,
	SECRET_LAYER_ID: string,
	speedValue: number = 0
) => {
	map.addLayer({
		id: layersRoadsId,
		source: sourceId,
		'source-layer': SECRET_LAYER_ID,
		type: 'line',
		layout: {
			'line-join': 'round',
			'line-cap': 'round'
		},
		paint: {
			'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#F75', '#E9C46A'],
			'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 4, 2]
		},
		minzoom: 5,
		maxzoom: 17
	});

	// Filter out roads without speeds
	const defaultFilters: MapboxFilter[] = [['>=', 'maxspeed', speedValue]];
	filterRoads(map, defaultFilters);
};

export const addRoadsSource = (map: mapboxgl.Map, SECRET_MAPBOX_TILESET_ID: string) => {
	map.addSource(sourceId, {
		type: 'vector',
		url: `mapbox://${SECRET_MAPBOX_TILESET_ID}`,
		interactive: true,
		interactivelayersRoadsIds: [layersRoadsId],
		trackResize: true,
		promoteId: 'osm_id'
	});
};

export const filterRoads = (map: mapboxgl.Map, filters: MapboxFilter[]) => {
	if (!filters.length) return;

	filters?.forEach((filter) => {
		const [operator, field, value] = filter;
		if (filter.length === 3 && operator) {
			map.setFilter(layersRoadsId, [operator, ['get', field], value] as FilterSpecification);
		}
	});
};

export const getMapViewLayerRoadsInfos = (map: mapboxgl.Map) => {
	const info: Partial<DataInfo> = {};

	const sourceLayerId = map.getLayer(layersRoadsId)?.['source-layer'];

	// Gets layer's visible total roads
	const mapCurrentFilter: FilterSpecification | null | undefined = map.getFilter(layersRoadsId);
	if (!mapCurrentFilter?.length) return info;

	const allDisplayedFeatures = map
		.querySourceFeatures(sourceId, {
			sourceLayer: sourceLayerId
		})
		.filter(metrics.filterVisible(mapCurrentFilter));

	const totalCount = allDisplayedFeatures.length;

	// Gets layer's visible roads percent values
	const percentagesMap = metrics.getPercentagePerRoads(allDisplayedFeatures, totalCount);

	// updates info
	info.widgets = {
		map: {
			percentages: percentagesMap,
			totalCount,
			zoom: Number(map.getZoom().toFixed(2)),
			minSpeed: map.getFilter(layersRoadsId)?.[2]
		}
	};
	return info;
};

let hoveredFeature: GeoJSONFeature | undefined;
export const roadEvents = {
	click: (e: mapboxgl.MapMouseEvent) => {
		const map = e.target;
		const roadsFeatures = e.features;
		const ignoredFieldsInTooltip = [
			'name',
			'fclass',
			'layer',
			'bridge',
			'code',
			'oneway',
			'tunnel',
			'osm_id',
			'ref'
		];
		const selectionInfo: WidgetSelectedData[] = [];

		const getFeaturesHTML = (features: GeoJSONFeature[] | undefined) => {
			const liElementsCollection = features?.map((f) => {
				const featureStr = [];
				if (f.properties) {
					let liElements = [];
					let listTitle = '';
					selectionInfo.push(f.properties);
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
							// adds item element with content for non excluded fields
							if (!ignoredFieldsInTooltip.includes(field)) {
								liElements.push(`<li>${field}: ${value}`);
							}

							// handle the end of properties traversal
							if (i === propertiesEntries.length - 1) {
								liElements.unshift(
									`<div class="border p-2"><h1 class="flex justify-center">${listTitle}</h1><ul class="p-2">`
								);
								liElements.push(`</div></ul>`);
								featureStr.push(liElements.join(''));

								liElements = [];
							}
						}
					}
				}
				return featureStr.join('');
			});
			return liElementsCollection?.join('');
		};
		const listElementsStr = getFeaturesHTML(roadsFeatures);
		const content = `<div class="p-2 overflow-y-auto h-[120px] w-15 space-y-6">${listElementsStr}</div>`;

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
		return selectionInfo;
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
					id: hoveredFeature?.properties?.[featureIdentifierProperty]
				},
				{ hover: false }
			);
		}

		// Set the hover state for the new feature
		const feature = features?.[0];
		hoveredFeature = feature;
		if (hoveredFeature && feature.properties) {
			map.setFeatureState(
				{
					source: hoveredFeature.source,
					sourceLayer: hoveredFeature.sourceLayer,
					id: feature.properties[featureIdentifierProperty]
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
					id: hoveredFeature?.properties?.[featureIdentifierProperty]
				},
				{ hover: false }
			);
			hoveredFeature = undefined;
		}
	}
};
