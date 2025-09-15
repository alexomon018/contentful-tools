import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { promisify } from 'util';
import {getContentfulSpace} from "@/contentful/services/space-provider";
import {CreateMigrationEnvironmentResponse} from "@/networking/create-migration-environment";
import {Space} from "contentful-management";
import {logger} from "@/contentful/services/logger-provider";
import {rootDir} from "@/contentful/utils/utils";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { migrationName } = body;

        if (!process.env.DEFAULT_BASE_ENV_FOR_MIGRATIONS) {
            return NextResponse.json({ error: 'DEFAULT_BASE_ENV_FOR_MIGRATIONS missing from .env file' }, { status: 428 });
        }

        if (
            typeof migrationName !== 'string' ||
            migrationName.length >= 30 ||
            !/^[a-zA-Z0-9_-]+$/.test(migrationName)
        ) {
            return NextResponse.json({ error: 'Invalid migration name' }, { status: 400 });
        }

        const branchName = `migration/${migrationName}`;
        // Create git branch
        execSync(`git -C "${rootDir}" checkout ${branchName} || git -C "${rootDir}" checkout -b ${branchName}`).toString();
        const envName = `migration-${migrationName}`;

        try {
            const space = await getContentfulSpace();
            await getOrCreateEnvironment(space,  envName);
            const response: CreateMigrationEnvironmentResponse = {
                envName,
                gitBranchCreated: true,
                partialError: null,
                contentfulEnvUrl: `https://app.contentful.com/spaces/${space.sys.id}/environments/${envName}/content_types`,
            };
            return NextResponse.json(response);
        } catch (err) {
            const response: CreateMigrationEnvironmentResponse = {
                envName,
                gitBranchCreated: true,
                partialError: err?.toString() || "",
                contentfulEnvUrl: null,
            };
            return NextResponse.json(response);
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}

async function getOrCreateEnvironment(space: Space, envName: string)  {
    const envs = await space.getEnvironments();

    if (envs.items.some((it) => it.name == envName)) {
        logger.warn(`Environment ${envName} already exists, skipping creation`);
        return envName
    } else {
        await space.createEnvironmentWithId(envName, {
            name: envName
        }, process.env.DEFAULT_BASE_ENV_FOR_MIGRATIONS)
        return envName;
    }
}