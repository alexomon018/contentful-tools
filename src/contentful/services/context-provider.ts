import * as dotenv from "dotenv"
import {logger} from "./logger-provider";

export const loadContext = () => {
    logger.trace("Loading environment");
    dotenv.config({ path: ['.env.local', '.env'] });

    logger.trace(process.env, `Environment`);

    if (!process.env.CMA_TOKEN) {
        console.error("Missing Contentful access token");
        process.exit(1);
    }

    if (!process.env.SPACE_ID) {
        console.error("Missing Contentful Space Id");
        process.exit(1);
    }
    logger.debug("Loaded environment")
}