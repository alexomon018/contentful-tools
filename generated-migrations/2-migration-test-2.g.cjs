function migrationFunction(migration, context) {
    const tag = migration.createContentType("tag");
    tag
        .displayField("name")
        .name("Tag")
        .description("")

    const tagName = tag.createField("name");
    tagName
        .name("Name")
        .type("Symbol")
        .localized(false)
        .required(false)
        .validations([])
        .disabled(false)
        .omitted(false)
    tag.changeFieldControl("name", "builtin", "singleLine")
}
module.exports = migrationFunction;
