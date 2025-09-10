import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { promisify } from 'util';
import {getContentfulSpace} from "@/contentful/services/space-provider";
import {CreateMigrationEnvironmentResponse} from "@/networking/create-migration-environment";
import {generateMigration} from "@/contentful/services/generate-migration-script";
import {CreateMigrationScriptResponse} from "@/networking/create-migration-script";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { envName } = body;
        if (!envName) {
            return NextResponse.json({error: "Invalid env name"}, {status: 400});
        }

        const space = await getContentfulSpace();
        const filename = await generateMigration(space, envName, process.env.DEFAULT_BASE_ENV_FOR_MIGRATIONS || "")
        const response: CreateMigrationScriptResponse = { filename };
        return NextResponse.json(response);

    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}