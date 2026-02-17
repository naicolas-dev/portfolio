import { NextResponse } from 'next/server';
import { getSteamData } from '@/lib/steam';

export async function GET() {
    try {
        const data = await getSteamData();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Steam API Route Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch Steam games',
            details: error.message
        }, { status: 500 });
    }
}
