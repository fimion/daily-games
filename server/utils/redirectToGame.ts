import type { EventHandlerRequest, H3Event } from "h3";
import type { CurrentSessionHandler } from "~/utils/useCurrentSession.ts";
import { today } from "~/utils/dateFuncs.ts";
import { GamesListItem } from "~/utils/useGames.ts";

export async function redirectToGame(
	url: GamesListItem,
	event: H3Event<EventHandlerRequest>,
	session: CurrentSessionHandler,
) {
	await session.update({
		lastID: url.id,
		lastAccessDay: today(),
	});
	return sendRedirect(event, url.link, 303);
}
