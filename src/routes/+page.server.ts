import { building } from '$app/environment';
import type { PageLoad } from './$types';

import {
	SECRET_LAYER_ID,
	SECRET_MAPBOX_STYLE,
	SECRET_MAPBOX_TILESET_ID,
	SECRET_MAPBOX_TOKEN
} from '$env/static/private';

export const load: PageLoad = async () => {
	if (!building) {
		return {
			SECRET_MAPBOX_TOKEN,
			SECRET_MAPBOX_STYLE,
			SECRET_MAPBOX_TILESET_ID,
			SECRET_LAYER_ID
		};
	}

	return {
		SECRET_MAPBOX_TOKEN,
		SECRET_MAPBOX_STYLE,
		SECRET_MAPBOX_TILESET_ID,
		SECRET_LAYER_ID
	};
};
