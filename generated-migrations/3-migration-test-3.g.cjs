function migrationFunction(migration, context) {
    const author = migration.createContentType("author");
    author
        .displayField("name")
        .name("Author")
        .description("")

    const authorName = author.createField("name");
    authorName
        .name("Name")
        .type("Symbol")
        .localized(false)
        .required(false)
        .validations([])
        .disabled(false)
        .omitted(false)
    author.changeFieldControl("name", "builtin", "singleLine")
}
module.exports = migrationFunction;
