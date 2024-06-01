//https://nitro.unjs.io/config
export default defineNitroConfig({
    srcDir: "server",
    serverAssets: [
        {
            baseName: 'templates',
            dir: './templates'
        }
    ],
    // Production
    storage: {
        db: {
            driver: "netlifyBlobs",
            name: "daily-games",
            deployScope: false,
            siteID: import.meta.env.SITE_ID,
            token: import.meta.env.NETLIFY_API_TOKEN
        }
    },
    // Development
    devStorage: {
        db: {
            driver: 'fs',
            base: './data/db'
        }
    },
    runtimeConfig: {
        raindropApiToken: "RAINDROP_API_TOKEN",
        raindropGamesCollection: "RAINDROP_GAMES_COLLECTION",
        sessionPassword: "SESSION_PASSWORD_NEEDS_TO_BE_AT_LEAST_32_CHARACTERS_LONG",
    }
});
