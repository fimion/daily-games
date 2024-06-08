import { useCurrentSession } from "~/utils/useCurrentSession.ts";
import { useLayout } from "~/utils/useLayout.ts";

export default defineEventHandler(async (event) => {
	await useCurrentSession(event);
	return await useLayout("index");
});
