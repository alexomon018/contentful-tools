import {getContentfulSpace} from "../services/space-provider";
import {logger} from "../services/logger-provider";
import {loadContext} from "../services/context-provider";
import {getLastRunMigrationNumber} from "../services/last-run-migration-provider";
import {getMigrationFiles} from "../services/migration-files-provider";
import {runIndividualMigration} from "../services/run-individual-migration";
import {getEnvFromGitBranch} from "../services/get-env-from-git-branch";
import {deleteEnvironment} from "../services/delete-environment";
import {Environment} from "contentful-management";

async function run() {

    if (!process.env.CI) {
        logger.error("Migrations should only be applied via CI.");
        logger.info("Manually delete this check to get around this but please don't unless you really know what you're doing.");
        process.exit(1);
    }

    loadContext()
    const space = await getContentfulSpace()
    const targetEnv = await getEnvFromGitBranch(space);
    const lastMigration = await getLastRunMigrationNumber(targetEnv);
    logger.info("Last migration to run was " + lastMigration)
    const migrationFiles = getMigrationFiles()
    const migrationsToRun = migrationFiles
        .filter((it) => it.number > lastMigration)
        .sort((file1, file2) => file1.number - file2.number);
    for (const migration of migrationsToRun) {
        await runIndividualMigration(space, targetEnv, migration);
    }

    logger.info("Migrations run successfully woop!");

    // Cleanup any migration environments in contentful for migrations that have been applied
    const migrationEnvNames = migrationFiles.map((it) => it.contentfulEnvName);
    const envsToDelete: Environment[] = (await space.getEnvironments()).items.filter(
        it => migrationEnvNames.includes(it.name)
    );
    for (const env of envsToDelete) {
        await deleteEnvironment(space, env)
    }
}

run();