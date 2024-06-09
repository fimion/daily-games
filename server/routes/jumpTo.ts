import { useCurrentSession } from "~/utils/useCurrentSession.ts";
import { filterByTodaysGames } from "~/utils/dateFuncs.ts";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	isString: if (typeof query.id === "string") {
		const id = parseInt(query.id);
		if (Number.isNaN(id)) break isString;
		const items = (await useGames()).filter(filterByTodaysGames);
		const game = items.find((el) => el.id === id);
		if (!game) return sendRedirect(event, "/", 303);
		const session = await useCurrentSession(event);
		return redirectToGame(game, event, session);
	}
	return sendRedirect(event, "/", 303);
});
