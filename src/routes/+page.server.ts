import {
	SECRET_LAYER_ID,
	SECRET_MAPBOX_STYLE,
	SECRET_MAPBOX_TILESET_ID,
	SECRET_MAPBOX_TOKEN
} from "$env/static/private";
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		SECRET_MAPBOX_TOKEN,
		SECRET_MAPBOX_STYLE,
		SECRET_MAPBOX_TILESET_ID,
		SECRET_LAYER_ID
	};
};
