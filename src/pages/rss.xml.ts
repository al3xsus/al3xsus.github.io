import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

import sanitizerConfig from "../configs/sanitizerConfig";

export const GET = async (context) => {
  const posts = await getCollection("posts");

  return rss({
    title: "al3xsus's Blog",
    description: "Latest posts from al3xsus",
    site: context.site,
    stylesheet: "/rss/styles.xsl",
    trailingSlash: false,
    items: posts.map((post) => ({
      link: `/posts/${post.data.slug}/`,
      // Note: this will not process components or JSX expressions in MDX files.
      content: sanitizeHtml(
        marked.parse(post.body as string),
        sanitizerConfig({
          defaultTags: sanitizeHtml.defaults.allowedTags,
          defaultAttributes: sanitizeHtml.defaults.allowedAttributes,
        })
      ),
      ...post.data,
      pubDate: post.data.created,
      author: "al3xsus@pm.me (al3xsus)",
      customData: `<language>en-us</language>`,
    })),
    customData: `<language>en-us</language>`,
  });
};
