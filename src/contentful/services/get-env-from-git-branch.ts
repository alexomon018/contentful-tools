import {execSync} from "child_process";
import {logger} from "./logger-provider";
import {Space} from "contentful-management";
import {rootDir} from "@/contentful/utils/utils";

export const getEnvFromGitBranch = async (space: Space) => {
    const branchName = execSync(`git -C ${rootDir} rev-parse --abbrev-ref HEAD`).toString()
    const envs = await space.getEnvironments();
    const envName = branchName
        .replace("contentful-environment/", "")
        .replace(/\//g, "-")
        .trim();

    const env = envs.items.find((it) => it.name == envName);

    if (env) {
        logger.info(`Found environment: ${env.name}`);
        return env
    }

    throw `Could not find environment for current branch ${branchName}`;
}