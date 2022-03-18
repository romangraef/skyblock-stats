import cookie from 'cookie'
import type { ExternalFetch, GetSession, Handle } from '@sveltejs/kit'

const SKYBLOCK_STATS_API_KEY = process.env.SKYBLOCK_STATS_API_KEY
if (!SKYBLOCK_STATS_API_KEY)
	console.warn('SKYBLOCK_STATS_API_KEY is not set as an environment variable. This is required for logging in with Skyblock Stats to work. It should be the same as the `key` environment variable in skyblock-api.')

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '')

	event.locals.sid = cookies.sid

	const response = await resolve(event)

	return response
}

export const getSession: GetSession = async ({ locals }) => {
	return {
		sid: locals.sid
	}
}

export const externalFetch: ExternalFetch = async (request) => {
	if (SKYBLOCK_STATS_API_KEY && request.url.startsWith('https://skyblock-api.matdoes.dev/')) {
		// add the key as a header
		request.headers.set('key', SKYBLOCK_STATS_API_KEY)
	}

	const response = await fetch(request)

	return response
}