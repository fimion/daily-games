import {useCurrentSession} from "~/utils/useCurrentSession.ts";

export default defineEventHandler(async (event) => {
    let session = await useCurrentSession(event);
    await session.update({lastID: undefined, lastAccessDay: undefined});
    return sendRedirect(event, "/", 303);
});
