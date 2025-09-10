import {Space} from "contentful-management";
import {runCliCommand} from "../utils/contentful-cli-runner";
import * as fs from "node:fs";
import os from "node:os";

export const applyContentDiff = async (
    space: Space,
    targetEnv: string,
    script: string
): Promise<void> => {
    const dir = os.tmpdir();
    const migrationFileName = `${dir}/merge-apply-${targetEnv}-${new Date()}.g.json`;
    fs.writeFileSync(migrationFileName, script)
    const result = runCliCommand(
        "apply",
        space, [
            `--environment ${targetEnv}`,
            `--file "${migrationFileName}"`,
            `--cma-token ${process.env.CMA_TOKEN}`,
            `--yes`
        ],
        "contentful-merge"
    ).toString();
    fs.rmSync(migrationFileName);
    if (result.includes("Merge was unsuccessful")) {
        throw new Error(result);
    }
}
