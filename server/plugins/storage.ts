import netlifyBlobDriver from "unstorage/drivers/netlify-blobs";
export default defineNitroPlugin(()=>{
    if(import.meta.env.PROD){
        const {siteId, netlifyApiToken} = useRuntimeConfig();
        const storage = useStorage();
        storage.mount('db', netlifyBlobDriver({
            name:"daily-games",
            siteID: siteId,
            token:netlifyApiToken,
        }))
    }

})
