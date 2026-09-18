# Codelove Apps — apps.codelove.in

Premium showcase & download website for mobile apps built by **Gowtham · Codelove**.

Built with **Next.js (App Router) + React + JavaScript + plain CSS**. No Tailwind, no UI kit.
Icons are from [Lucide React](https://lucide.dev).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

## Where things live

```
src/
  app/                     Routes (Next.js App Router)
    layout.jsx             Root layout: fonts, SEO metadata, Navbar + Footer
    template.jsx           Page fade-in transition
    page.jsx               Home
    apps/page.jsx          Apps (search + category filters)
    apps/[appId]/page.jsx  App detail (screenshots, features, specs, release notes, download)
    about/page.jsx         About the studio
    privacy/, terms/       Legal pages
    not-found.jsx          404
    robots.js, sitemap.js  SEO files (served at /robots.txt and /sitemap.xml)
    opengraph-image.jsx    Social preview image (generated)
    icon.svg               Favicon
  components/              Reusable UI (Navbar, Footer, AppCard, CategoryFilter, SearchBar,
                           DownloadButton, AppStats, FeatureCard, MobilePreview, Breadcrumb, ...)
  components/sections/     Home page sections (Hero, FeaturedApps, WhySection, Showcase, ...)
  data/
    apps.js                ← THE app catalogue. Edit this to add/replace apps.
    categories.js          Category list
    site.js                Branding, URLs, nav + footer links
  styles/
    globals.css            Design tokens, reset, typography, buttons, glass, animations
    components.css         Component styles
    sections.css           Home section styles
    pages.css              Inner page styles
public/
  downloads/               Put real .apk files here (see README.txt inside)
  icons/                   Optional real app icons
  screenshots/             Optional real screenshots
```

## Replacing the dummy apps

Everything on the site is driven by `src/data/apps.js`. For each app:

1. Set `apkUrl` to the real file — either `/downloads/your-app.apk` (drop the file in `public/downloads/`)
   or a full external URL. Every Download button uses this field.
2. Optionally set `iconImage: "/icons/your-app.png"` to replace the generated icon.
3. Optionally set `screenshots: ["/screenshots/your-app-1.png", ...]` to replace the CSS mock screens.
4. Mark up to three apps `featured: true` (home page) and one `isNewRelease: true` (“Fresh from the studio”).

Branding, domain and social links are in `src/data/site.js`.

## Deploying

The site is fully static. Deploy to Vercel/Netlify as-is, or run `npm run build` and host the output
with `npm start` behind any Node host. Point the `apps.codelove.in` DNS record at the host.

## Notes

- `_scaffold-backup/` holds the original create-next-app placeholder files; it is safe to delete.
- The `AGENTS.md`/`CLAUDE.md` block at the repo root is written automatically by `next dev`.
