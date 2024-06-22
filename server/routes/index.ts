import { useCurrentSession } from "~/utils/useCurrentSession.ts";
import { useLayout } from "~/utils/useLayout.ts";
import { StoredLinkItem } from "~/utils/storedLinks.ts";
import { filterByTodaysGames } from "~/utils/dateFuncs.ts";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	console.log(query);
	await useCurrentSession(event);
	const items = (await useGames()).filter(filterByTodaysGames);

	const listItem = (item: StoredLinkItem) => `<li>
		<a href="/jumpTo?id=${item.id}" target="_blank">${item.name}</a> ( #${item.tags.join(", #")} )
	</li>`;

	const content = `<details>
			<summary>Jump to a game</summary>
			<ol>
					${items.map(listItem).join("")}
			</ol>
		</details>`;
	return await useLayout("index", content);
});
