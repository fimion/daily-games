import {EventHandlerRequest, H3Event} from "h3";
import {useGames, type RainDropItem} from "~/utils/useGames.ts";
import {useCurrentSession, type CurrentSessionHandler} from "~/utils/useCurrentSession.ts";

function today(){
    return Math.floor(Date.now()/(1000*60*60*24))
}

async function redirectToGame(url:{link:string, id:number}, event:H3Event<EventHandlerRequest>, session: CurrentSessionHandler){
    await session.update({
        lastID: url.id,
        lastAccessDay: today(),
    })
    return sendRedirect(event,url.link, 303);
}

export default defineEventHandler(async (event) => {
    const db = await useGames();
    const session = await useCurrentSession(event);

    const items = await db.getItem<RainDropItem[]>('games');
    const urls = items.filter((el)=>el.tags.includes("daily")||el.tags.includes("weekly/monday")).map((el)=>({link:el.link,id:el._id}));


    if(!session.data.lastID || today() - (session.data.lastAccessDay ?? 0) > 0 ){
        return redirectToGame(urls[0], event, session);
    }
    const lastUrlIndex = urls.findIndex((el)=>el.id === session.data.lastID);
    if(lastUrlIndex === urls.length-1) return sendRedirect(event, "/end", 303);
    return redirectToGame(urls[lastUrlIndex + 1], event, session);
});
