import {Environment, Space} from "contentful-management";
import {runCliCommand} from "../utils/contentful-cli-runner";
import * as fs from "node:fs";


export const getChangedEntries = async (
    env: Environment,
    changedSince: string // Date
): Promise<{
    entryId: string
}[]> => {
    const response = await env.getEntries({
        select: "sys.id",
        "sys.updatedAt[gte]": changedSince
    });

    //            "message": "Query cannot be executed. The maximum allowed size for a query is 8192 bytes but it was 36682 bytes",

    // TODO: handle more than 100
    return response.items.map((it) => {
        return {entryId: it.sys.id}
    })
}
