import type { EventHandlerRequest, H3Event } from "h3";
import type { CurrentSessionHandler } from "~/utils/useCurrentSession.ts";
import { today } from "~/utils/dateFuncs.ts";
import { type StoredLinkItem } from "~/utils/storedLinks.ts";

export async function redirectToGame(
	url: StoredLinkItem,
	event: H3Event<EventHandlerRequest>,
	session: CurrentSessionHandler,
) {
	await session.update({
		lastID: url.id,
		lastAccessDay: today(),
	});
	return sendRedirect(event, url.link, 303);
}
