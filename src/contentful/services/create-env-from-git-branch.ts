import {execSync} from "child_process";
import {logger} from "./logger-provider";
import {Space} from "contentful-management";

export const createEnvFromGitBranch = async (space: Space) => {
    const branchName = execSync("git rev-parse --abbrev-ref HEAD").toString()
    const envs = await space.getEnvironments();
    const envName = branchName.replace(/\//g, "-").trim();

    if (!branchName.startsWith("migration/")) {
        logger.error("Please create a new branch starting with 'migration/' to get started.");
        process.exit(1)
    }

    if (envs.items.some((it) => it.name == envName)) {
        logger.warn(`Environment ${envName} already exists, skipping creation`);
    } else {
        await space.createEnvironmentWithId(envName, {
            name: envName
        }, process.env.DEFAULT_BASE_ENV_FOR_MIGRATIONS)
    }
    logger.info(`New environment ready, go make content updates: ${envName}`);
    return envName
}