import { useCurrentSession } from "~/utils/useCurrentSession.ts";
import { useLayout } from "~/utils/useLayout.ts";
import { useShops } from "~/utils/useGames.ts";

export default defineEventHandler(async (event) => {
	await useCurrentSession(event);
	const shops = await useShops();
	const links =
		"<ul>" +
		shops
			.sort((a, b) => Math.sign(b.order - a.order))
			.map((item) => `<li><a href="${item.link}" target="_blank">${item.name}</a></li>`)
			.join("") +
		"</ul>";
	return await useLayout("end", links);
});
