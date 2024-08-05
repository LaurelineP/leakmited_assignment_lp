// /api/map GET

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ url, params }) {
	return json({ message: 'OK' });
}
