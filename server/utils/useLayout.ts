

export async function useLayout(partial:string, insertPartial: string = "",layout:string="layout"){
    const assets = useStorage("assets:server");
    let layoutContent = await assets.getItem(`${layout}.html`);
    let partialContent = await assets.getItem(`partials/${partial}.partial.html`);
    if(typeof layoutContent ==="string" && typeof partialContent === "string"){
        partialContent = partialContent.replace(/\{\{content}}/gi, insertPartial)
        layoutContent = layoutContent.replace(/\{\{content}}/gi, partialContent);
    }
    return layoutContent;
}
