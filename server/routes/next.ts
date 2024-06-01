import {Storage} from "unstorage";
import {EventHandlerRequest, H3Event} from "h3";

type RaindropCollectionRef = {
    "$ref": string;
    "$id": number;
    "oid": number;
};

type RaindropMediaItem = {
    "type": string;
    "link": string;
}

type RaindropUserRef = {
    "$ref": string;
    "$id": number;
};

type RaindropCreatorRef = {
    "_id": number;
    "avatar": string;
    "name": string;
    "email": string;
};

type RaindropCacheRef = {
    "status": string;
};

type RainDropItem = {
    _id: number;
    excerpt: string;
    type: string;
    "cover": string;
    "tags": string[];
    "removed": boolean;
    "title": string;
    "collection": RaindropCollectionRef;
    "link": string;
    "created": string;
    "lastUpdate": string;
    "important": boolean;
    "media": RaindropMediaItem[];
    "user": RaindropUserRef;
    "domain": string;
    "creatorRef": RaindropCreatorRef;
    "sort": number;
    "cache": RaindropCacheRef;
    "note": string;
    "highlights": string[];
    "broken": boolean;
    "collectionId": number;
}

type RaindropMultipleResponse = {
    result: boolean;
    items: RainDropItem[];
    count: number;
    collectionId: number;
}

type MyMeta = {
    cacheTime: number;
}

export type SessionData = {
    lastID?: number;
    lastAccessDay?: number;
}

type GamesStorage = RainDropItem[];

async function isExpired(db: Storage<GamesStorage>) {
    const now = Date.now();
    const cacheTime = (await db.getMeta('games') as MyMeta).cacheTime;
    return now - cacheTime > 24 * 60 * 60 * 1000;
}

function today(){
    return Math.floor(Date.now()/(1000*60*60*24))
}

type SessionHandler<T> = {
    readonly id: string | undefined;
    readonly data: T;
    update: (update: Partial<T>) => Promise<any>;
    clear: () => Promise<any>;
}

async function redirectUrl(url:{link:string, id:number}, event:H3Event<EventHandlerRequest>, session: SessionHandler<SessionData>){
    await session.update({
        lastID: url.id,
        lastAccessDay: today(),
    })
    return sendRedirect(event,url.link, 303);
}

export default defineEventHandler(async (event) => {
    const {raindropApiToken, raindropGamesCollection, sessionPassword} = useRuntimeConfig()
    const db = useStorage<GamesStorage>("db");

    let session = await useSession<SessionData>(event, {
        password: sessionPassword,
        // @ts-ignore
        cookie:{secure: import.meta.env.DEV}
    });


    if (!await db.hasItem('games') || await isExpired(db)) {

        const result = await $fetch<RaindropMultipleResponse>(
            `https://api.raindrop.io/rest/v1/raindrops/${raindropGamesCollection}`,
            {
                headers: {
                    "Authorization": `Bearer ${raindropApiToken}`,
                }
            });
        if (result.result) {
            await db.setItem('games', result.items)
            await db.setMeta('games', {cacheTime: Date.now()});
        }
    }

    const items = await db.getItem<RainDropItem[]>('games');
    const urls = items.filter((el)=>el.tags.includes("daily")||el.tags.includes("weekly/monday")).map((el)=>({link:el.link,id:el._id}));


    if(!session.data.lastID || today() - (session.data.lastAccessDay ?? 0) > 0 ){
        return redirectUrl(urls[0], event, session);
    }
    const lastUrlIndex = urls.findIndex((el)=>el.id === session.data.lastID);
    if(lastUrlIndex === urls.length-1) return sendRedirect(event, "https://meh.com", 303);
    return redirectUrl(urls[lastUrlIndex + 1], event, session);
});
