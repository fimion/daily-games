import netlifyBlobDriver from "unstorage/drivers/netlify-blobs";
export default defineNitroPlugin(async ()=>{
    if(import.meta.env.PROD){
        const storage = useStorage();
        await storage.unmount('db');
        console.log(process.env);
        storage.mount('db', netlifyBlobDriver({
             name:"db",
            deployScoped: false,
        }))
    }

})
