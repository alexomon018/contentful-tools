import { NextRequest, NextResponse } from 'next/server';
import {getContentfulSpace} from "@/contentful/services/space-provider";
import {generateContentDiff} from "@/contentful/services/generate-content-diff";
import * as os from "node:os";
import {getChangedEntries} from "@/contentful/services/changed-entries-provider";
import {getLastBackportDate, getMigrationTrackingEntry} from "@/contentful/services/last-run-migration-provider";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { envToPromote, targetEnv } = body;
        if (!envToPromote || !targetEnv) {
            return NextResponse.json({error: "Invalid env names"}, {status: 400});
        }

        const space = await getContentfulSpace();
        const contentfulTargetEnv = (await space.getEnvironments())
            .items
            .find((it) => it.name == targetEnv);

        if (!contentfulTargetEnv) {
            return NextResponse.json({error: `Invalid env: ${targetEnv}`}, {status: 400});
        }

        const lastBackportDate = await getLastBackportDate(contentfulTargetEnv);
        const changedEntries = await getChangedEntries(
            contentfulTargetEnv,
            lastBackportDate ?? new Date(0).toISOString()
        );
        const changedEntryIds = new Set(changedEntries.map((it) => it.entryId))

        // Important we don't migrate the tracking data since this needs to remain environment specific
        const migrationTracker = await getMigrationTrackingEntry(contentfulTargetEnv);
        changedEntryIds.delete(migrationTracker.sys.id)

        const scriptContent = await generateContentDiff(
            space,
            // Going from target -> envToPromote since this is a backport
            targetEnv,
            envToPromote
        );
        scriptContent.items = scriptContent.items.filter((it) => changedEntryIds.has(it.entity.sys.id));

        return NextResponse.json(scriptContent);

    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: JSON.stringify(err) || 'Internal Server Error' }, { status: 500 });
    }
}