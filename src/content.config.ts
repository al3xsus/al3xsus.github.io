import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import ogs from "open-graph-scraper";
import { Octokit } from "octokit";

const skipRepos = ["al3xsus"];

// --- Schema ---
const commonSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  created: z.coerce.date(),
  tags: z.array(z.string()).default([]), // Default to empty array
  coverImage: z.string().optional(),
});

// --- Helper: Scraper with Absolute URL correction ---
async function getOGMetadata(url: string, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const { result } = await ogs({
      url,
      fetchOptions: { signal: controller.signal },
    });

    let imageUrl = result.ogImage?.[0]?.url;

    if (imageUrl && !imageUrl.startsWith("https://al3xsus.github.io")) {
      // This logic turns "./IMAGES/two-ways.png" + "https://al3xsus.github.io/path/"
      // into "https://al3xsus.github.io/path/IMAGES/two-ways.png"
      const baseUrl = new URL(url);

      // We use the second argument of New URL() to resolve relative paths
      imageUrl = new URL(imageUrl, baseUrl.href).toString();
    }

    return { ...result, fixedOgImage: imageUrl };
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const githubProjectLoader = ({ username }: { username: string }) => {
  return {
    name: "github-project-loader",
    load: async ({ store, logger }) => {
      // Use process.env fallback for broader environment support
      const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

      if (!token) {
        logger.error(
          "GITHUB_TOKEN is missing! Check your environment variables."
        );
        return;
      }

      const octokit = new Octokit({ auth: token });

      try {
        const { data: repos } =
          await octokit.rest.repos.listForAuthenticatedUser({
            visibility: "all",
            affiliation: "owner",
            sort: "updated",
            per_page: 100,
          });

        const filteredRepos = repos.filter(
          (repo) =>
            repo.description && repo.homepage && !skipRepos.includes(repo.name)
        );

        logger.info(`Processing ${filteredRepos.length} filtered projects...`);

        // Use for...of to avoid hitting some rate limits too hard
        for (const repo of filteredRepos) {
          const ogData = await getOGMetadata(repo.homepage!);
          
          store.set({
            id: repo.name.toLowerCase(),
            data: {
              title: repo.name,
              description: repo.description || "",
              slug: repo.name.toLowerCase(),
              created: new Date(repo.created_at || Date.now()),
              repo: repo.html_url,
              liveDemo: repo.homepage || "",
              coverImage: ogData?.fixedOgImage || "", // Use the fixed absolute URL
              tags: repo.topics || [],
            },
          });
        }
      } catch (err) {
        logger.error(`GitHub Load Error: ${(err as Error).message}`);
      }
    },
  };
};

// --- Collections ---

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/posts" }),
  schema: z.object({
    ...commonSchema.shape,
    project: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: githubProjectLoader({ username: "your-username" }),
  schema: z.object({
    ...commonSchema.shape,
    repo: z.string().url(),
    liveDemo: z.string().url(),
  }),
});

export const collections = { posts, projects };
