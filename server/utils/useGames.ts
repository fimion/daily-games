import { Storage } from "unstorage";

export type RaindropCollectionRef = {
	$ref: string;
	$id: number;
	oid: number;
};

export type RaindropMediaItem = {
	type: string;
	link: string;
};

export type RaindropUserRef = {
	$ref: string;
	$id: number;
};

export type RaindropCreatorRef = {
	_id: number;
	avatar: string;
	name: string;
	email: string;
};

export type RaindropCacheRef = {
	status: string;
};

export type RainDropItem = {
	_id: number;
	excerpt: string;
	type: string;
	cover: string;
	tags: string[];
	removed: boolean;
	title: string;
	collection: RaindropCollectionRef;
	link: string;
	created: string;
	lastUpdate: string;
	important: boolean;
	media: RaindropMediaItem[];
	user: RaindropUserRef;
	domain: string;
	creatorRef: RaindropCreatorRef;
	sort: number;
	cache: RaindropCacheRef;
	note: string;
	highlights: string[];
	broken: boolean;
	collectionId: number;
};

export type RaindropMultipleResponse = {
	result: boolean;
	items: RainDropItem[];
	count: number;
	collectionId: number;
};

export type GamesStorage = RainDropItem[];

export type MyMeta = {
	cacheTime: number;
};

export async function isExpired(db: Storage<GamesStorage>) {
	const now = Date.now();
	const cacheTime = ((await db.getMeta("games")) as MyMeta).cacheTime;
	return now - cacheTime > 24 * 60 * 60 * 1000;
}

export type GamesListItem = {
	name: string;
	description: string;
	link: string;
	id: number;
	tags: string[];
};

export async function useGames(): Promise<GamesListItem[]> {
	const { raindropApiToken, raindropGamesCollection } = useRuntimeConfig();
	const db = useStorage<GamesStorage>("db");
	let items: RainDropItem[] = [];
	if (!(await db.hasItem("games")) || (await isExpired(db))) {
		const result = await $fetch<RaindropMultipleResponse>(
			`https://api.raindrop.io/rest/v1/raindrops/${raindropGamesCollection}`,
			{
				headers: {
					Authorization: `Bearer ${raindropApiToken}`,
				},
			},
		);
		if (result.result) {
			await db.setItem("games", result.items);
			await db.setMeta("games", { cacheTime: Date.now() });
			items = result.items;
		}
	} else if (await db.hasItem("games")) {
		items = (await db.getItem<RainDropItem[]>("games"))!;
	}

	return items.map((el) => ({
		link: el.link,
		id: el._id,
		tags: el.tags,
		name: el.title,
		description: el.note,
	}));
}
