import { type StoredLinkItem } from "~/utils/storedLinks.ts";

export const TIME_IN_MS = {
	SIX_HOURS: 6 * 60 * 60 * 1000,
	ONE_DAY: 24 * 60 * 60 * 1000,
};

export function today() {
	return Math.floor(Date.now() / TIME_IN_MS.ONE_DAY);
}

export const WeeklyTags = [
	"weekly/sunday",
	"weekly/monday",
	"weekly/tuesday",
	"weekly/wednesday",
	"weekly/thursday",
	"weekly/friday",
	"weekly/saturday",
] as const;

export function getWeeklyTag() {
	return WeeklyTags[new Date().getUTCDay()];
}

export function filterByTodaysGames(game: StoredLinkItem): boolean {
	return game.tags.includes("daily") || game.tags.includes(getWeeklyTag());
}

export function filterByTaggedGames(game: StoredLinkItem): boolean {
	return game.tags.includes("daily") || game.tags.some((tag) => tag.includes("weekly"));
}
