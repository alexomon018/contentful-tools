import { NextRequest, NextResponse } from 'next/server';
import {getContentfulSpace} from "@/contentful/services/space-provider";
import {generateContentDiff} from "@/contentful/services/generate-content-diff";
import * as os from "node:os";
import {getChangedEntries} from "@/contentful/services/changed-entries-provider";
import {getLastBackportDate, updateLastBackportDate} from "@/contentful/services/last-run-migration-provider";
import {applyContentDiff} from "@/contentful/services/apply-content-diff";
import {delay} from "@/contentful/utils/utils";
import {syncAssets} from "@/contentful/services/sync-assets";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sourceEnv, targetEnv, isBackport, script } = body;
        if (!targetEnv) {
            return NextResponse.json({error: "Invalid env name"}, {status: 400});
        }

        const space = await getContentfulSpace();
        const environments = await space.getEnvironments();
        const contentfulTargetEnv = environments
            .items
            .find((it) => it.name == targetEnv);
        const contentfulSourceEnv = environments
            .items
            .find((it) => it.name == sourceEnv)!;

        if (!contentfulTargetEnv) {
            return NextResponse.json({error: `Invalid env: ${targetEnv}`}, {status: 400});
        }

        // The migration cli tool doesn't deal with assets.
        // If the asset exists in the source environment but not in the target then the migration just fails
        // so we must sync these manually
        await syncAssets(contentfulSourceEnv, contentfulTargetEnv, script);

        await delay(200) // Wait a bit to avoid Contentful rate limits

        // Now we can apply the migration
        await applyContentDiff(space, targetEnv, script)

        if (isBackport) {
            await delay(200) // Wait a bit to avoid Contentful rate limits
            await updateLastBackportDate(space, environments.items.find((it) => it.name == sourceEnv)!)
        }
        return NextResponse.json({message: "success"});

    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: JSON.stringify(err) || 'Internal Server Error' }, { status: 500 });
    }
}