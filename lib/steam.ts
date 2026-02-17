
const STEAM_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_USER_ID;

const RECENTLY_PLAYED_URL = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/`;
const PLAYER_SUMMARY_URL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`;
const OWNED_GAMES_URL = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/`;

const PERFECTED_APP_IDS = [55230, 239140, 534380, 307690, 747660, 1030830, 1625450, 1919590, 1583320, 417860];

let cachedData: any = null;
let lastFetch = 0;
const CACHE_DURATION = 3600000; // 1 hour

export async function getSteamData() {
    if (!STEAM_KEY || !STEAM_ID) {
        console.warn('Steam credentials missing');
        return null;
    }

    const now = Date.now();
    // Cache temporarily disabled for testing missing games
    if (cachedData && (now - lastFetch < 0)) {
        return cachedData;
    }

    try {
        // 1. Fetch Profile
        const profileUrl = new URL(PLAYER_SUMMARY_URL);
        profileUrl.searchParams.append('key', STEAM_KEY);
        profileUrl.searchParams.append('steamids', STEAM_ID);

        const profileRes = await fetch(profileUrl.toString());
        const profileJson = await profileRes.json();
        const player = profileJson.response.players[0];

        // 2. Fetch Recently Played (limit to 1)
        const recentlyUrl = new URL(RECENTLY_PLAYED_URL);
        recentlyUrl.searchParams.append('key', STEAM_KEY);
        recentlyUrl.searchParams.append('steamid', STEAM_ID);
        recentlyUrl.searchParams.append('count', '1');

        const recentlyRes = await fetch(recentlyUrl.toString());
        const recentlyJson = await recentlyRes.json();
        const latestGame = recentlyJson.response.games?.[0] || null;

        // 3. Fetch Owned Games (to get metadata for perfected games)
        const ownedUrl = new URL(OWNED_GAMES_URL);
        ownedUrl.searchParams.append('key', STEAM_KEY);
        ownedUrl.searchParams.append('steamid', STEAM_ID);
        ownedUrl.searchParams.append('include_appinfo', '1');
        ownedUrl.searchParams.append('include_played_free_games', '1');
        ownedUrl.searchParams.append('include_played_free_games', '1');

        const ownedRes = await fetch(ownedUrl.toString());
        const ownedJson = await ownedRes.json();
        const allOwnedGames = ownedJson.response.games || [];

        const mappedGame = latestGame ? {
            name: latestGame.name,
            appid: latestGame.appid,
            playtime_forever: latestGame.playtime_forever,
            icon_url: latestGame.img_icon_url
                ? `http://media.steampowered.com/steamcommunity/public/images/apps/${latestGame.appid}/${latestGame.img_icon_url}.jpg`
                : null,
            platform: 'Steam'
        } : null;

        // Map perfected games metadata
        const perfectedGames = PERFECTED_APP_IDS.map(id => {
            const game = allOwnedGames.find((g: any) => g.appid === id);
            if (game) {
                return {
                    name: game.name,
                    appid: game.appid,
                    icon: game.img_icon_url
                        ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
                        : null
                };
            }
            return null;
        }).filter(Boolean);

        const data = {
            profile: player ? {
                name: player.personaname,
                avatar: player.avatarfull,
                status: player.personastate, // 0: Offline, 1: Online, etc.
                game: player.gameextrainfo || null // Current game being played
            } : null,
            currentlyPlaying: mappedGame,
            perfectedGames
        };

        cachedData = data;
        lastFetch = now;

        return data;
    } catch (error) {
        console.error('Error fetching Steam data:', error);
        return cachedData;
    }
}
