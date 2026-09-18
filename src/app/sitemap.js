import { apps } from "@/data/apps";
import { site } from "@/data/site";

export default function sitemap() {
  const now = new Date();
  const pages = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/apps`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
  const appPages = apps.map((app) => ({
    url: `${site.url}/apps/${app.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  const webApps = apps
    .filter((app) => app.webAppUrl)
    .map((app) => ({
      url: `${site.url}${app.webAppUrl}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  return [...pages, ...appPages, ...webApps];
}
