import {exec, execSync} from "child_process";
import {Space} from "contentful-management";
import {logger} from "../services/logger-provider";
import {rejects} from "assert";

const createContentfulCommand = (command: string, space: Space, args: string[]) => {
    return `
        npm run contentful
         -- ${command}
         --management-token ${process.env.CMA_TOKEN}
         --cda-token=${process.env.CDA_TOKEN}
         --space-id ${space.sys.id}
         ${args.join(" ")}`.replace(/(\r\n|\n|\r|)/gm, "").replace(/\s+/g, ' ');

}

const createContentfulMergeCommand = (command: string, space: Space, args: string[]) => {
    return `
        npm run contentful-merge
         -- ${command}
         --space ${space.sys.id}
         ${args.join(" ")}`.replace(/(\r\n|\n|\r|)/gm, "").replace(/\s+/g, ' ');

}

export const runCliCommand = (command: string, space: Space, args: string[], cli: "contentful" | "contentful-merge" = "contentful") => {
    const fullCommand = cli == "contentful" ? createContentfulCommand(command, space, args)
        : createContentfulMergeCommand(command, space, args);

    logger.debug(`Running command ${fullCommand.replace(process.env.CMA_TOKEN || "", "[REDACTED]")}`)
    return execSync(fullCommand);
}



