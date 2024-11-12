import { EventHandlerRequest, H3Event, type SessionData } from "h3";
import { TIME_IN_MS } from "#imports";

export type CurrentSessionData = {
	lastID?: number;
	lastAccessDay?: number;
};

type SessionDataT = Record<string, unknown>;
export type SessionUpdate<T extends SessionDataT = SessionDataT> =
	| Partial<SessionData<T>>
	| ((oldData: SessionData<T>) => Partial<SessionData<T>> | undefined);

export type SessionHandler<T extends SessionDataT> = {
	readonly id: string | undefined;
	readonly data: T;
	update: (update: SessionUpdate<T>) => Promise<SessionHandler<T>>;
	clear: () => Promise<SessionHandler<T>>;
};

export type CurrentSessionHandler = SessionHandler<CurrentSessionData>;

declare global {
	interface ImportMeta {
		env: {
			DEV: boolean;
		};
	}
}

export async function useCurrentSession(event: H3Event<EventHandlerRequest>) {
	const { sessionPassword } = useRuntimeConfig();
	return useSession<CurrentSessionData>(event, {
		password: sessionPassword,
		cookie: {
			secure: import.meta.env.DEV,
			maxAge: TIME_IN_MS.ONE_DAY / 1000, // seconds
		},
	});
}
