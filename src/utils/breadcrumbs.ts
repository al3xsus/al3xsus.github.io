export function generateBreadcrumbs(path: string) {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs = [];

  let cumulative = "/";
  for (let i = 0; i < segments.length; i++) {
    cumulative += segments[i] + "/";
    breadcrumbs.push({
      name: decodeURIComponent(segments[i].replace(/-/g, " ")),
      url: cumulative,
    });
  }

  return breadcrumbs;
}
