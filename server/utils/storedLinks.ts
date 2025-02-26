import { Storage } from "unstorage";
import { $fetch, type FetchOptions } from "ofetch";
import { TIME_IN_MS } from "#imports";

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

export type StoredLinkStorage = RainDropItem[];

export type MyMeta = {
	cacheTime: number;
};

export async function isExpired(db: Storage<StoredLinkStorage>, key: string) {
	const now = Date.now();
	const cacheTime = ((await db.getMeta(key)) as MyMeta).cacheTime;
	return now - cacheTime > TIME_IN_MS.SIX_HOURS;
}

export type StoredLinkItem = {
	name: string;
	description: string;
	link: string;
	id: number;
	tags: string[];
	order: number;
};

async function useStoredLinkItems(
	key: string,
	collection: string,
	options: FetchOptions<"json"> = {},
): Promise<StoredLinkItem[]> {
	const { raindropApiToken } = useRuntimeConfig();
	const db = useStorage<StoredLinkStorage>("db");
	let items: RainDropItem[] = [];
	if (!(await db.hasItem(key)) || (await isExpired(db, key))) {
		const result = await $fetch<RaindropMultipleResponse>(`https://api.raindrop.io/rest/v1/raindrops/${collection}`, {
			...options,
			headers: {
				Authorization: `Bearer ${raindropApiToken}`,
			},
		});
		if (result.result) {
			await db.setItem(key, result.items);
			await db.setMeta(key, { cacheTime: Date.now() });
			items = result.items;
		}
	} else if (await db.hasItem(key)) {
		items = (await db.getItem<RainDropItem[]>(key))!;
	}

	return items
		.map((el) => ({
			link: el.link,
			id: el._id,
			tags: el.tags,
			name: el.title,
			description: el.note,
			order: el.sort,
		}))
		.sort((a, b) => {
			return Math.sign(a.order - b.order);
		});
}

export async function useShops(): Promise<StoredLinkItem[]> {
	return useStoredLinkItems("shops", "0", { query: { search: "#daily/shops" } });
}

export async function useGames(): Promise<StoredLinkItem[]> {
	const { raindropGamesCollection } = useRuntimeConfig();
	return useStoredLinkItems("games", raindropGamesCollection);
}
