import {Environment, Space} from "contentful-management";
// @ts-ignore
import contentful from "contentful-cli";
import {execSync} from "child_process";
import {runCliCommand} from "../utils/contentful-cli-runner";
import * as fs from "fs";
import {rootDir} from "../utils/utils";
import {logger} from "./logger-provider";
import {getMigrationFiles, MigrationFile, migrationsDir} from "./migration-files-provider";
import Migration from "contentful-migration";
import {updateLastRunMigration} from "./last-run-migration-provider";

export const runIndividualMigration = async (space: Space, targetEnv: Environment, migration: MigrationFile) => {
    logger.info(`Running migration ${migration.fileName}`)

    await runCliCommand(
        "space migration",
        space, [
            `--environment-id ${targetEnv.name}`,
            migration.filePath,
            "--yes"
        ]
    )

    // TODO: Remove this conditional once we automate creation of this content type
    if (migration.number > 1) {
        await updateLastRunMigration(space, targetEnv, migration);
    }
}
