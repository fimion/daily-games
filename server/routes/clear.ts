import { useCurrentSession } from "~/utils/useCurrentSession.ts";

export default defineEventHandler(async (event) => {
	const session = await useCurrentSession(event);
	await session.clear();
	return sendRedirect(event, "/", 303);
});
