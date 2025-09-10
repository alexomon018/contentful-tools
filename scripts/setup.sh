#!/usr/bin/env bash

echo "Setting up - This script is designed to be run from the outer repo."

ln -s contentful-tools/bitbucket-pipelines-client.yml bitbucket-pipelines.yml

cat > .env << EOF
SPACE_ID=<The ID of your Contentful space (it's in the URL)>
DEFAULT_BASE_ENV_FOR_MIGRATIONS=<The environment cloned to make your migrations (usually your lowest environment)>
NEXT_PUBLIC_ENVIRONMENTS_PROGRESSION=<Comma separated list of your environment names in progression order e.g: test,pre-prod,production>
PROD_ENVIRONMENT=<Your production environment name>
EOF

cat .env.local << EOF
CMA_TOKEN=<Content management token>
CDA_TOKEN=<Content delivery token (with access to all envs)
EOF

mkdir generated-migrations
cat > generated-migrations/1-init.g.cjs << EOF
function migrationFunction(migration, context) {
    const contentfulMigrationTracking = migration.createContentType("contentfulMigrationTracking");
    contentfulMigrationTracking
        .displayField("title")
        .name("Contentful Migration Tracking")
        .description("STOP: Please DO NOT edit any of these types or create new ones. These are used programatically. ")

    const contentfulMigrationTrackingLastRunMigrationNumber = contentfulMigrationTracking.createField("lastRunMigrationNumber");
    contentfulMigrationTrackingLastRunMigrationNumber
        .name("Last run migration number")
        .type("Integer")
        .localized(false)
        .required(true)
        .validations([{ "unique": true }])
        .disabled(false)
        .omitted(false)

    const contentfulMigrationTracking = migration.editContentType("contentfulMigrationTracking");
        const contentfulMigrationTrackingLastBackportDate = contentfulMigrationTracking.createField("lastBackportDate");
        contentfulMigrationTrackingLastBackportDate
            .name("Last Backport Date")
            .type("Symbol")
            .localized(false)
            .required(false)
            .validations([])
            .disabled(false)
            .omitted(false)
        contentfulMigrationTracking.changeFieldControl("lastBackportDate", "builtin", "singleLine", { "helpText": "The last time this environment's changes were back-ported to the lower environment" })

    const contentfulMigrationTrackingTitle = contentfulMigrationTracking.createField("title");
    contentfulMigrationTrackingTitle
        .name("Title")
        .type("Symbol")
        .localized(false)
        .required(true)
        .validations([{ "unique": true }, { "regexp": { "pattern": "Contentful version number", "flags": null } }])
        .disabled(false)
        .omitted(false)
    contentfulMigrationTracking.changeFieldControl("lastRunMigrationNumber", "builtin", "numberEditor")
    contentfulMigrationTracking.changeFieldControl("title", "builtin", "singleLine", { "helpText": "Please don't edit this content type, it's used to track changes to content." })
}
module.exports = migrationFunction;
EOF
