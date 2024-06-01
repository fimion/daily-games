import type {SessionData} from "./next.ts";

export default defineEventHandler(async (event) => {
    const {sessionPassword} = useRuntimeConfig()

    let session = await useSession<SessionData>(event, {
        password: sessionPassword,
        // @ts-ignore
        cookie: {secure: import.meta.env.DEV}
    });

    return await useStorage("assets:server").getItem("index.html");
});
