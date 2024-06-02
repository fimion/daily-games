import {EventHandlerRequest, H3Event} from "h3";

export type CurrentSessionData = {
    lastID?: number;
    lastAccessDay?: number;
}

export type SessionHandler<T> = {
    readonly id: string | undefined;
    readonly data: T;
    update: (update: Partial<T>) => Promise<any>;
    clear: () => Promise<any>;
}

export type CurrentSessionHandler = SessionHandler<CurrentSessionData>

export async function useCurrentSession(event: H3Event<EventHandlerRequest>) {
    const {sessionPassword} = useRuntimeConfig();
    return useSession<CurrentSessionData>(event, {
        password: sessionPassword,
        // @ts-ignore
        cookie: {secure: import.meta.env.DEV}
    });
}
