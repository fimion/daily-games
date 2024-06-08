import type { EventHandlerRequest, H3Event } from "h3";
import type { CurrentSessionHandler } from "~/utils/useCurrentSession.ts";

export function today() {
	return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
}

export async function redirectToGame(
	url: { link: string; id: number },
	event: H3Event<EventHandlerRequest>,
	session: CurrentSessionHandler,
) {
	await session.update({
		lastID: url.id,
		lastAccessDay: today(),
	});
	return sendRedirect(event, url.link, 303);
}
