function migrationFunction(migration, context) {
    const product = migration.createContentType("product");
    product
        .displayField("name")
        .name("Product")
        .description("")

    const productName = product.createField("name");
    productName
        .name("name")
        .type("Symbol")
        .localized(false)
        .required(false)
        .validations([])
        .disabled(false)
        .omitted(false)
    product.changeFieldControl("name", "builtin", "singleLine")
}
module.exports = migrationFunction;
