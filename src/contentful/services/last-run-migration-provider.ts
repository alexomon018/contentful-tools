import contentful, {Entry, Environment, Space} from 'contentful-management';
import {logger} from "./logger-provider";
import {MigrationFile} from "./migration-files-provider";
import {delay} from "../utils/utils";

interface MigrationTrackingItem {
    lastRunMigrationNumber: String
}

async function getDefaultLocale(env: Environment): Promise<string> {
    const locales = await env.getLocales();
    return locales.items.find((locale) => locale.default)?.code as string;
}

export async function getMigrationTrackingEntry(env: Environment) {
    let contentType = "contentfulMigrationTracking";
    const response = await env.getEntries({
        content_type: contentType
    });
    const entries: Entry[] = response.items;

    if (entries.length > 1) {
        throw "Multiple tracking items found, should only be 1!"
    }

    if (entries.length == 0) {
        // TODO: Automate this.
        throw `
        No version tracking content entry found. If this is your first time running these scripts then go into Contentful
        and create a ContentfulMigrationTracking with the migration number being 0. These scripts will handle the rest.
        `
    }

    return entries[0]
}

export const getLastRunMigrationNumber = async (env: Environment) => {
    const rawField = await getMigrationTrackingEntry(env);
    const rawMigrationNumber = rawField.fields["lastRunMigrationNumber"][await getDefaultLocale(env)];
    logger.debug(`Raw migration number found: ${rawMigrationNumber}`);
    return isNaN(rawMigrationNumber) ? null : rawMigrationNumber;
}

export const getLastBackportDate = async (env: Environment): Promise<string | null> => {
    const rawField = await getMigrationTrackingEntry(env);
    const field = rawField.fields["lastBackportDate"];
    if (!field) return null;

    const rawDate = field[await getDefaultLocale(env)] as string | null | undefined;
    logger.debug(`Raw backport date found: ${rawDate}`);
    return rawDate && rawDate?.length > 0 ? rawDate : null;
}

export const updateLastRunMigration = async (space: Space, targetEnv: Environment, migration: MigrationFile) => {
    const rawField = await getMigrationTrackingEntry(targetEnv)
    rawField.fields["lastRunMigrationNumber"][await getDefaultLocale(targetEnv)] = migration.number
    await rawField.update().then((it) => it.publish());

    logger.info(`Updated last migration number to ${migration.number}`)
}

export const updateLastBackportDate = async (space: Space, targetEnv: Environment) => {
    const rawField = await getMigrationTrackingEntry(targetEnv)
    rawField.fields["lastBackportDate"] = rawField.fields["lastBackportDate"] ?? {}
    rawField.fields["lastBackportDate"][await getDefaultLocale(targetEnv)] = new Date().toISOString()
    await rawField.update().then((it) => it.publish());

    logger.info(`Updated last backport date for ${targetEnv.name}`)
}