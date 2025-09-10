import {Space} from "contentful-management";
import parseArgs from "minimist";

export const findEnvFromArgs = async (space: Space) => {
    const argv = parseArgs(process.argv.slice(2));
    const targetEnv: string = argv["target-env-id"] ?? process.env.DEFAULT_TARGET_ENV;

    const envs = await space.getEnvironments()
    return envs.items.find((it) => it.name == targetEnv)
}