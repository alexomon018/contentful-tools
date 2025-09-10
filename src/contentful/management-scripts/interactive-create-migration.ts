import {getContentfulSpace} from "../services/space-provider";
import {logger} from "../services/logger-provider";
import {promptUserInput} from "../utils/user-input-prompt";
import {createEnvFromGitBranch} from "../services/create-env-from-git-branch";
import {generateMigration} from "../services/generate-migration-script";
import {loadContext} from "../services/context-provider";
import parseArgs from "minimist";

loadContext()
const space = await getContentfulSpace()

const envName = await createEnvFromGitBranch(space)
const argv = parseArgs(process.argv.slice(2));
const targetEnv = argv["target-env-id"]

logger.info("Come back once you've done and we'll generate the script")
await promptUserInput("Press any key to continue AFTER you're done editing models: ")

await generateMigration(space, envName, targetEnv || process.env.DEFAULT_BASE_ENV_FOR_MIGRATIONS)
