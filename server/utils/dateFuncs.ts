import { GamesListItem } from "~/utils/useGames.ts";

export function today() {
	return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
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

export function filterByTodaysGames(game: GamesListItem): boolean {
	return game.tags.includes("daily") || game.tags.includes(getWeeklyTag());
}

export function filterByTaggedGames(game: GamesListItem): boolean {
	return game.tags.includes("daily") || game.tags.some((tag) => tag.includes("weekly"));
}
