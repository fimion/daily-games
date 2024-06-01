import netlifyBlobDriver from "unstorage/drivers/netlify-blobs";
export default defineNitroPlugin(()=>{
    if(import.meta.env.PROD){
        const {netlify} = useRuntimeConfig();
        const storage = useStorage();
        storage.mount('db', netlifyBlobDriver({
            siteID: constants.SITE_ID,
            token: constants.NETLIFY_API_TOKEN,
            deployID: process.env.DEPLOY_ID,
        }))
    }

})
