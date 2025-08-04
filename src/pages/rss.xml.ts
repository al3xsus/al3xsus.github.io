import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export const GET = async () => {
  const posts = await getCollection("blog");

  return rss({
    title: "Vdeep AI Blog",
    description: "Latest posts from Vdeep AI",
    site: "https://yourdomain.com",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.datePublished),
      link: `/blog/${post.slug}/`,
      description: post.data.description,
    })),
  });
};
