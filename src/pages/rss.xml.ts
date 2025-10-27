import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export const GET = async (context) => {
  const posts = await getCollection("posts");

  return rss({
    title: "Al3xsus's Blog",
    description: "Latest posts from Al3xsus",
    site: context.site,
    stylesheet: "/rss/styles.xsl",
    trailingSlash: false,
    items: posts.map((post) => ({
      link: `/posts/${post.data.slug}/`,
      // Note: this will not process components or JSX expressions in MDX files.
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "pre",
          "code",
          "img",
          "table",
          "thead",
          "tbody",
          "tr",
          "td",
          "th",
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ["src", "alt", "width", "height"],
          code: ["class"],
          a: ["href", "name", "target", "rel"],
          td: ["colspan", "rowspan"],
          th: ["colspan", "rowspan"],
        },
        allowedSchemes: ["http", "https", "mailto", "data"],
        allowedSchemesByTag: {
          img: ["http", "https", "data"],
        },
        allowProtocolRelative: true,
      }),
      ...post.data,
    })),
    customData: `<language>en-us</language>`,
  });
};
