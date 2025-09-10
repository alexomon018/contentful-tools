import {Space} from "contentful-management";
import {runCliCommand} from "../utils/contentful-cli-runner";
import * as fs from "node:fs";
import os from "node:os";

export interface RawBackportScript {
    sys: {
        type: "Changeset"
    },
    items: {
        changeType: string,
        entity: {
            sys: {
                type: string,
                linkType: string,
                id: string
            }
        },
        [key: string]: any;
    }[]
}

export const generateContentDiff = async (
    space: Space,
    sourceEnv: string,
    targetEnv: string
): Promise<RawBackportScript> => {
    const dir = os.tmpdir();
    const migrationFileName = `${dir}/merge-${sourceEnv}-${targetEnv}-${new Date()}.g.json`;
    runCliCommand(
        "create",
        space, [
            `--source ${sourceEnv}`,
            `--target ${targetEnv}`,
            `--output-file "${migrationFileName}"`,
            `--cda-token ${process.env.CDA_TOKEN}`
        ],
        "contentful-merge"
    )
    const contents = fs.readFileSync(migrationFileName).toString();
    fs.rmSync(migrationFileName);
    return JSON.parse(contents) as RawBackportScript;
}
