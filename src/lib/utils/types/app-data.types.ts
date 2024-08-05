import type { evaluateWithOperator } from '../constants';

/* ------------------------ Data across panel and map ----------------------- */
export interface DataInfo {
	widgets?: WidgetsInfos;
}

export type WidgetMapData = {
	totalCount: number;
	percentages: [number, number][];
} & { isLoaded: boolean };

export type OSMBooleanValue = 'F' | 'T';
export type WidgetSelectedData = {
	roads: {
		name: string;
		code: number;
		ref: string;
		bridge: OSMBooleanValue;
		fclass: string;
		layer: number;
		maxspeed: number;
		oneway: OSMBooleanValue;
		osm_id: number;
		tunnel: OSMBooleanValue;
	}[];
} & { isLoaded: boolean };

export type WidgetsInfos = {
	map?: WidgetMapData;
	selection?: WidgetSelectedData;
};

/* ---------------------------- Data app for map ---------------------------- */
export type MapboxFilter = [string, string, number | string];

export type FilterOperator = keyof typeof evaluateWithOperator;
