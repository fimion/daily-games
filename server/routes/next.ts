import { useGames, type RainDropItem } from "~/utils/useGames.ts";
import { useCurrentSession } from "~/utils/useCurrentSession.ts";
import { today, redirectToGame } from "~/utils/redirectToGame.ts";

export default defineEventHandler(async (event) => {
	const db = await useGames();
	const session = await useCurrentSession(event);

	if (await db.hasItem("games")) {
		const items = await db.getItem<RainDropItem[]>("games");
		if (Array.isArray(items)) {
			const urls = items
				.filter((el) => el.tags.includes("daily") || el.tags.includes("weekly/monday"))
				.map((el) => ({ link: el.link, id: el._id }));

			if (!session.data.lastID || today() - (session.data.lastAccessDay ?? 0) > 0) {
				return redirectToGame(urls[0], event, session);
			}
			const lastUrlIndex = urls.findIndex((el) => el.id === session.data.lastID);
			if (lastUrlIndex === urls.length - 1) return sendRedirect(event, "/end", 303);
			return redirectToGame(urls[lastUrlIndex + 1], event, session);
		}
	}
	return sendRedirect(event, "/", 303);
});
