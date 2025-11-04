const sanitizerConfig = ({defaultTags, defaultAttributes}) => ({
    allowedTags: defaultTags.concat([
        "h1", "h2", "h3", "h4", "h5", "h6", "pre", "code", "img", 
        "table", "thead", "tbody", "tr", "td", "th", "dl", "dt", 
        "dd", "input", "cite", "sup" // Added for modern rich content
    ]),
    allowedAttributes: {
        ...defaultAttributes,
        img: ["src", "alt", "width", "height"],
        code: ["class"],
        a: ["href", "name", "target", { name: "rel", allowedValues: ["noopener", "noreferrer", "nofollow"] }], // Enforce secure 'rel'
        td: ["colspan", "rowspan"],
        th: ["colspan", "rowspan"],
        input: ["type", "disabled", "checked"] // Required for task lists
    },
    allowedSchemes: ["https", "mailto", "data"], // Removed 'http' for security
    allowedSchemesByTag: {
        img: ["http", "https", "data"],
    },  
    allowProtocolRelative: true,
});

export default sanitizerConfig;