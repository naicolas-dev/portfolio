export interface Game {
    name: string;
    platform: 'Steam' | 'PlayStation' | 'Xbox' | 'Nintendo' | 'PC' | 'Mobile';
    status?: 'playing' | 'completed' | 'paused';
    playtime?: string;
    icon?: string;
}

// Placeholder data - user will provide actual game list
export const games: Game[] = [
    {
        name: 'The Witcher 3',
        platform: 'Steam',
        status: 'completed',
        playtime: '120h',
    },
    {
        name: 'Elden Ring',
        platform: 'PlayStation',
        status: 'playing',
        playtime: '45h',
    },
    {
        name: 'Minecraft',
        platform: 'PC',
        status: 'playing',
    },
];
