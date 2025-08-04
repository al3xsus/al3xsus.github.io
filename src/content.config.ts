import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import jsonData from "./data/projects/projects.json";
import matter from "gray-matter";

const commonSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  date: z.date(),
  updated: z.date().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  canonical: z.string().optional(),
  linkedinURL: z.string().optional(),
  mediumURL: z.string().optional(),
  devtoURL: z.string().optional(),
});

// -------------------- POSTS --------------------

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/posts" }),
  schema: z.object({
    ...commonSchema.shape, // Reuse common schema for posts
    project: z.string().optional(),
  }),
});

// -------------------- PROJECTS (from GitHub) --------------------

async function tryFetchReadme(repoUrl: string) {
  const branches = ["main", "master"];
  for (const branch of branches) {
    const rawUrl =
      repoUrl.replace("github.com", "raw.githubusercontent.com") +
      `/${branch}/README.md`;
    try {
      const res = await fetch(rawUrl);
      if (res.ok) {
        const raw = await res.text();
        const { content, data: frontmatter } = matter(raw); // parse with gray-matter

        let resultContent = content;

        const id = repoUrl.split("/").pop() ?? crypto.randomUUID();

        let coverImage = frontmatter.coverImage || null;
        if (coverImage && !coverImage.startsWith("http")) {
          let newCoverImage = rawUrl.replace("/README.md", coverImage);
          resultContent = resultContent.replace(
            `.${coverImage} `,
            newCoverImage
          );
          coverImage = newCoverImage;
        }

        return {
          id,
          repo: repoUrl,
          content: resultContent, // or `content` if you're rendering Markdown safely later
          ...frontmatter, // include optional metadata
          coverImage: coverImage ? coverImage : "",
        };
      }
    } catch (err) {
      console.error(`❌ Error fetching ${rawUrl}:`, (err as Error).message);
    }
  }
  return null;
}

async function runWithConcurrencyLimit(
  tasks: (() => Promise<any>)[],
  limit: number
) {
  const results: any[] = [];
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const currentIndex = index++;
      try {
        results[currentIndex] = await tasks[currentIndex]();
      } catch {
        results[currentIndex] = null;
      }
    }
  }

  const workers = Array.from({ length: limit }, () => worker());
  await Promise.all(workers);
  return results.filter(Boolean);
}

const projects = defineCollection({
  loader: async () => {
    const tasks = jsonData.map((repoUrl) => () => tryFetchReadme(repoUrl));
    return await runWithConcurrencyLimit(tasks, 5);
  },
  schema: z.object({
    ...commonSchema.shape, // Reuse common schema for projects
    repo: z.string().url(),
    content: z.string(),
    liveDemo: z.string().optional(),
    techStack: z.array(z.string()).optional(),
  }),
});

// -------------------- EXPORT --------------------

export const collections = { posts, projects };
