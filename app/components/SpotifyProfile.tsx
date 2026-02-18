'use client';

import { SiSpotify } from 'react-icons/si';
import { SPOTIFY_PROFILE } from '@/app/settings/spotify';

export default function SpotifyProfile() {
    const profile = SPOTIFY_PROFILE;

    return (
        <a
            href={profile.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#2a2d31] transition-colors w-full group"
        >
            <div className="relative">
                {profile.images?.[0]?.url && profile.images[0].url.startsWith('http') ? (
                    <img
                        src={profile.images[0].url}
                        alt={profile.display_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-[#1DB954] transition-colors"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2a2d31] flex items-center justify-center">
                        <SiSpotify className="text-[#1DB954]" size={20} />
                    </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-[#1a1d21] rounded-full p-0.5">
                    <SiSpotify className="text-[#1DB954]" size={12} />
                </div>
            </div>

            <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate group-hover:text-[#1DB954] transition-colors">
                    {profile.display_name}
                </span>
            </div>
        </a>
    );
}
