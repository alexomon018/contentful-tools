function migrationFunction(migration, context) {
    const blog = migration.createContentType("blog");
    blog
        .displayField("name")
        .name("Blog")
        .description("")

    const blogName = blog.createField("name");
    blogName
        .name("Name")
        .type("Symbol")
        .localized(false)
        .required(false)
        .validations([])
        .disabled(false)
        .omitted(false)

    const blogDescription = blog.createField("description");
    blogDescription
        .name("Description")
        .type("RichText")
        .localized(false)
        .required(false)
        .validations([{ "enabledMarks": ["bold", "italic", "underline", "code", "superscript", "subscript", "strikethrough"], "message": "Only bold, italic, underline, code, superscript, subscript, and strikethrough marks are allowed" }, { "enabledNodeTypes": ["heading-1", "heading-2", "heading-3", "heading-4", "heading-5", "heading-6", "ordered-list", "unordered-list", "hr", "blockquote", "embedded-entry-block", "embedded-asset-block", "table", "asset-hyperlink", "embedded-entry-inline", "entry-hyperlink", "hyperlink"], "message": "Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, table, link to asset, inline entry, link to entry, and link to Url nodes are allowed" }, { "nodes": {} }])
        .disabled(false)
        .omitted(false)
    blog.changeFieldControl("name", "builtin", "singleLine")
    blog.changeFieldControl("description", "builtin", "richTextEditor")
}
module.exports = migrationFunction;
