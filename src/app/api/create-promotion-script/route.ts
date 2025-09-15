import { NextRequest, NextResponse } from "next/server";
import { getContentfulSpace } from "@/contentful/services/space-provider";
import { generateContentDiff } from "@/contentful/services/generate-content-diff";
import * as os from "node:os";
import { getChangedEntries } from "@/contentful/services/changed-entries-provider";
import {
  getLastBackportDate,
  getMigrationTrackingEntry,
} from "@/contentful/services/last-run-migration-provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { envToPromote, targetEnv } = body;
    if (!envToPromote || !targetEnv) {
      return NextResponse.json({ error: "Invalid env names" }, { status: 400 });
    }

    const space = await getContentfulSpace();
    const scriptContent = await generateContentDiff(
      space,
      envToPromote,
      targetEnv
    );

    // Important we don't migrate the tracking data since this needs to remain environment specific
    const migrationTracker = await getMigrationTrackingEntry(
      (await space.getEnvironments()).items.find((it) => it.name == targetEnv)!
    );

    scriptContent.items = scriptContent.items.filter(
      (it) => it.entity.sys.id != migrationTracker.sys.id
    );

    return NextResponse.json(scriptContent);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: JSON.stringify(err) || "Internal Server Error" },
      { status: 500 }
    );
  }
}
