import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { promisify } from 'util';
import {getContentfulSpace} from "@/contentful/services/space-provider";
import {CheckReadyResponse} from "@/networking/check-ready";


export async function GET(req: NextRequest) {
    try {
        if (!process.env.SPACE_ID) {
            return NextResponse.json({ error: "SPACE_ID missing from .env.local" }, { status: 428 });
        }

        if (!process.env.CMA_TOKEN) {
            return NextResponse.json({ error: "CMA_TOKEN missing from .env.local" }, { status: 428 });
        }

        const space = await getContentfulSpace();
        const body: CheckReadyResponse = {
            spaceId: process.env.SPACE_ID,
            accessToken: process.env.CMA_TOKEN.substring(0, 2)
                + '*'.repeat(4),
            spaceName: space.name
        };
        return NextResponse.json(body);

    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}