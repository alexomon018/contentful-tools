import  {createClient, Space} from 'contentful-management';
import {logger} from "./logger-provider";

export const getContentfulSpace = async () => {
    logger.debug("Getting contentful space")
    const client = createClient({
        accessToken: process.env.CMA_TOKEN || ""
    });
    const space: Space = await client.getSpace(process.env.SPACE_ID || "");
    logger.info(`Loaded contentful space: [${space.name}]`);
    return space;
}