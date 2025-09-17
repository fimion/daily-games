import { useStorage } from "nitropack/runtime";

type InsertPartial = string | Record<string,string>;


export async function useLayout(partial: string, insertPartial: InsertPartial = "", layout: string = "layout") {
	const assets = useStorage("assets:server");
	let layoutContent = await assets.getItem(`${layout}.html`);
	let partialContent = await assets.getItem(`partials/${partial}.partial.html`);
	if (typeof layoutContent === "string" && typeof partialContent === "string") {
		if(typeof insertPartial === "string") {
			partialContent = partialContent.replace(/\{\{content}}/gi, insertPartial);
		} else {
			for(const [key,content] of Object.entries(insertPartial)) {
				partialContent = partialContent.replaceAll(`{{${key}}}`, content);
			}
		}

		layoutContent = layoutContent.replace(/\{\{content}}/gi, partialContent);
	}
	return layoutContent;
}
