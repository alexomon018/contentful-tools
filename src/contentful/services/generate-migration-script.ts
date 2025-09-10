import {Space} from "contentful-management";
import {runCliCommand} from "../utils/contentful-cli-runner";
import {logger} from "./logger-provider";
import {getMigrationFiles, migrationsDir} from "./migration-files-provider";

export const generateMigration = async (space: Space, sourceEnv: string, targetEnv: String) => {
    const migrations = getMigrationFiles();
    const migrationNumbers = migrations.map((it) => it.number);
    const nextMigration = Math.max(...migrationNumbers) + 1
    logger.info(`Generating migration ${nextMigration}`)

    const migrationFileName = `${migrationsDir}/${nextMigration}-${sourceEnv}.g.cjs`;
    await runCliCommand(
        "merge export",
        space, [
            `--source-environment-id ${sourceEnv}`,
            `--target-environment-id ${targetEnv}`,
            `--output-file ${migrationFileName}`
        ]
    )
    return migrationFileName;
}
