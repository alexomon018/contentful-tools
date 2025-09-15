function migrationFunction(migration, context) {
  const contentfulMigrationTracking = migration.createContentType(
    "contentfulMigrationTracking"
  );
  contentfulMigrationTracking
    .name("Contentful Migration Tracking")
    .description(
      "STOP: Please DO NOT edit any of these types or create new ones. These are used programatically. "
    );

  const contentfulMigrationTrackingLastRunMigrationNumber =
    contentfulMigrationTracking.createField("lastRunMigrationNumber");
  contentfulMigrationTrackingLastRunMigrationNumber
    .name("Last run migration number")
    .type("Integer")
    .localized(false)
    .required(true)
    .validations([{ unique: true }])
    .disabled(false)
    .omitted(false);

  migration.editContentType("contentfulMigrationTracking");
  const contentfulMigrationTrackingLastBackportDate =
    contentfulMigrationTracking.createField("lastBackportDate");
  contentfulMigrationTrackingLastBackportDate
    .name("Last Backport Date")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  contentfulMigrationTracking.changeFieldControl(
    "lastBackportDate",
    "builtin",
    "singleLine",
    {
      helpText:
        "The last time this environment's changes were back-ported to the lower environment",
    }
  );

  const contentfulMigrationTrackingTitle =
    contentfulMigrationTracking.createField("title");
  contentfulMigrationTrackingTitle
    .name("Title")
    .type("Symbol")
    .localized(false)
    .required(true)
    .validations([
      { unique: true },
      { regexp: { pattern: "Contentful version number", flags: null } },
    ])
    .disabled(false)
    .omitted(false);
  contentfulMigrationTracking.changeFieldControl(
    "lastRunMigrationNumber",
    "builtin",
    "numberEditor"
  );
  contentfulMigrationTracking.changeFieldControl(
    "title",
    "builtin",
    "singleLine",
    {
      helpText:
        "Please don't edit this content type, it's used to track changes to content.",
    }
  );
  contentfulMigrationTracking.displayField("title");
}
module.exports = migrationFunction;
