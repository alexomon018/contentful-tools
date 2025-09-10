import {execSync} from "child_process";
import {runCliCommand} from "../utils/contentful-cli-runner";
import * as fs from "fs";
import {rootDir} from "../utils/utils";
import {logger} from "./logger-provider";

export interface MigrationFile {
    number: number
    fileName: string
    contentfulEnvName: string
    filePath: string
}

export const migrationsDir = `${rootDir}/generated-migrations`

export const getMigrationFiles = () => {
    const migrationFiles = fs.readdirSync(migrationsDir)
    const migrations: MigrationFile[] = migrationFiles.map((it) => {
        return {
            number: parseInt(it.split("-")[0]),
            fileName: it,
            contentfulEnvName: envNameFromFileName(it) || "",
            filePath: `${migrationsDir}/${it}`
        }
    })
    return migrations
}

function envNameFromFileName(fileName: string): string | null {
    const regex = new RegExp("\\d+-(.*).g.cjs", "gi");
    const matches = [...fileName.matchAll(regex)];
    if (matches.length < 0 || matches[0].length < 1) {
        return null;
    }
    return matches[0][1]
}