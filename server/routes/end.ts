import { useCurrentSession } from "~/utils/useCurrentSession.ts";
import { useLayout } from "~/utils/useLayout.ts";
import { useShops, useGames, type StoredLinkItem } from "~/utils/storedLinks.ts";

function itemsToList(items: StoredLinkItem[]) {
	return `<ul>
${items
		.sort((a, b) => Math.sign(b.order - a.order))
		.map((item) => `<li><a href="${item.link}" target="_blank">${item.name}</a></li>`)
		.join("")}
</ul>`
}

export default defineEventHandler(async (event) => {
	await useCurrentSession(event);
	const shops = await useShops();
	const games = await useGames();
	const extraGames = games.filter((item)=>item.tags.includes("extra"))

	const links = {
		content: itemsToList(shops),
		extras:itemsToList(extraGames),
	}

	return await useLayout("end", links);
});
