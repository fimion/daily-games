import { useGames } from "~/utils/storedLinks.ts";
import { useCurrentSession } from "~/utils/useCurrentSession.ts";
import { redirectToGame } from "~/utils/redirectToGame.ts";
import { today, filterByTodaysGames } from "~/utils/dateFuncs.ts";

export default defineEventHandler(async (event) => {
	const items = await useGames();
	const session = await useCurrentSession(event);
	if (items.length === 0) return sendRedirect(event, "/", 303);
	const urls = items.filter(filterByTodaysGames);

	if (!session.data.lastID || today() - (session.data.lastAccessDay ?? 0) > 0) {
		return redirectToGame(urls[0], event, session);
	}
	const lastUrlIndex = urls.findIndex((el) => el.id === session.data.lastID);
	if (lastUrlIndex === urls.length - 1) return sendRedirect(event, "/end", 303);
	return redirectToGame(urls[lastUrlIndex + 1], event, session);
});
