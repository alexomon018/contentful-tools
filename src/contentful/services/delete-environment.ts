import {Environment, Space} from "contentful-management";
// @ts-ignore
import contentful from "contentful-cli";
import {runCliCommand} from "../utils/contentful-cli-runner";
import {logger} from "./logger-provider";

export const deleteEnvironment = async (space: Space, targetEnv: Environment) => {
    logger.info(`Cleaning up environment: ${targetEnv.name}`)

    await runCliCommand(
        "space environment delete",
        space, [
            `--environment-id ${targetEnv.name}`
        ]
    )

    logger.info(`Cleaned up environment: ${targetEnv.name}`)
}
