import { MTA_API_KEY } from '$env/static/private';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	console.log(url);
	const baseUrl = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs';
	const pathMap = new Map([
		['1', baseUrl],
		['2', baseUrl],
		['3', baseUrl],
		['4', baseUrl],
		['5', baseUrl],
		['6', baseUrl],
		['7', baseUrl],
		['A', `${baseUrl}-ace`],
		['C', `${baseUrl}-ace`],
		['E', `${baseUrl}-ace`],
		['B', `${baseUrl}-bdfm`],
		['D', `${baseUrl}-bdfm`],
		['F', `${baseUrl}-bdfm`],
		['M', `${baseUrl}-bdfm`],
		['G', `${baseUrl}-g`],
		['J', `${baseUrl}-jz`],
		['Z', `${baseUrl}-jz`],
		['N', `${baseUrl}-nqrw`],
		['Q', `${baseUrl}-nqrw`],
		['R', `${baseUrl}-nqrw`],
		['W', `${baseUrl}-nqrw`],
		['L', `${baseUrl}-l`],
		['SIR', `${baseUrl}-si`]
	]);
	const path: string = url.searchParams.get('path')?.toUpperCase() ?? '';
	const fetchUrl = pathMap.get(path);
	if (!fetchUrl) {
		throw error(
			400,
			`Incorrect 'path' paremter. Acceptible paths are [${Array.from(pathMap.keys()).join(', ')}].`
		);
	}
	const headers = {
		'x-api-key': MTA_API_KEY
	};
	const response = await fetch(fetchUrl, { headers });
	const buffer = await response.arrayBuffer();
	const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
	return Response.json({ feedEntities: feed.entity });
}
