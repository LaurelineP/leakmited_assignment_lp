import type { GeoJSONFeature } from 'mapbox-gl';
import type { FilterSpecification } from 'maplibre-gl';
import { evaluateWithOperator, type strOrNum } from './constants';

export const metrics = {
	filterVisible: (
		mapCurrentFilter?: FilterSpecification
	): ((f: GeoJSONFeature, index: number, array: GeoJSONFeature[]) => unknown) => {
		return (f: GeoJSONFeature) => {
			// Early error handlings
			if (!mapCurrentFilter) return true;
			if (!Array.isArray(mapCurrentFilter) || mapCurrentFilter.length < 3) return false;

			const filterField = Array.isArray(mapCurrentFilter[1]) ? mapCurrentFilter[1][1] : undefined;
			const filterOperator = mapCurrentFilter[0] as FilterOperator;
			const filterValue = mapCurrentFilter[2];
			const featureValue = f?.properties?.[filterField] as strOrNum;

			if (!filterField || !filterOperator || filterValue === undefined) return false;
			if (typeof featureValue !== 'string' && typeof featureValue !== 'number') return false;
			const result = evaluateWithOperator?.[filterOperator]?.(featureValue, filterValue);
			return result;
		};
	},
	getPercentagePerRoads: (features: GeoJSONFeature[], total: number) => {
		// Count roads per speed
		const percentagesMap = new Map();
		for (let i = 0; i < total; i++) {
			const featureMaxSpeed = features[i]?.properties?.maxspeed;
			const existingSpeed = percentagesMap.get(featureMaxSpeed);
			const count = !existingSpeed ? 1 : existingSpeed + 1;
			percentagesMap.set(featureMaxSpeed, count);
		}

		// Get roads speed's percentage
		const x = Array.from(percentagesMap.entries()).map(([speed, count]) => {
			const percent = (count / total) * 100;
			return [speed, percent];
		});
		return x;
	}
};
