import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Spotlight from "@/components/Spotlight";
import Rail from "@/components/Rail";
import AppCard from "@/components/AppCard";
import ToolCard from "@/components/ToolCard";
import { apps, getAppById } from "@/data/apps";
import { site, WEBSITE_ID } from "@/data/site";

// "Find the right CodeLove app": the searches each app answers (id = must exist in src/data, else the line is hidden)
const FIND = [
  { title: "Free Android games", text: "3D games, each its own app: landscape, full screen and touch controls.", link: "Free Android games", href: "/apps?category=Games" },
  { id: "videocut", title: "Video cutter app", text: "Cut a long video into Shorts or equal parts on your phone.", link: "Video cutter app", href: "/apps/videocut/" },
  { id: "video-to-gif", title: "Video to GIF app", text: "Turn a clip from your gallery into a GIF and save it.", link: "Video to GIF app", href: "/apps/video-to-gif/" },
  { id: "insta-downloader", title: "Instagram downloader app", text: "Share a reel or post to the app and save it to Downloads.", link: "Instagram downloader app", href: "/apps/insta-downloader/" },
  { id: "javaplay", title: "Java game emulator APK", text: "Play old .jar keypad-phone games, with 160+ free games built in.", link: "Java game emulator APK", href: "/apps/javaplay/" },
];

// Games shown in the big carousel at the top, in order
const SPOTLIGHT = ["kingdom-clash", "patti-veedu", "turbo-karts", "crypt-knight", "cannon-cove", "skate-rush"];

export default function HomePage() {
  const slides = SPOTLIGHT.map(getAppById)
    .filter(Boolean)
    .map((app) => ({ ...app, hero: app.gallery[1] || app.cover }));
  // Games you can install today come first
  const games = apps
    .filter((a) => a.category === "Games" && a.id !== "javaplay")
    .sort((a, b) => Number(!!a.comingSoon) - Number(!!b.comingSoon));
  const tools = apps.filter((a) => a.category !== "Games" || a.id === "javaplay");

  // The list of apps on this page, for search engines.
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: site.title,
    url: `${site.url}/`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: games.length + tools.length,
      itemListElement: [...games, ...tools].map((app, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: app.name,
        url: `${site.url}/apps/${app.id}/`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
      <section className="spotlight" aria-label="Featured">
        <div className="container">
          <Spotlight slides={slides} />

          <div className="intro">
            <h1>CodeLove Apps: free Android games and tools. Download the APK and play.</h1>
            <div className="intro-stats">
              <div>
                <strong>{games.length}</strong>
                <span>3D games</span>
              </div>
              <div>
                <strong>{tools.length}</strong>
                <span>Tools</span>
              </div>
              <div>
                <strong>₹0</strong>
                <span>Always free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Rail
        id="games-title"
        title="Games"
        text="Every game is its own app: landscape, full screen, touch controls."
        moreHref="/apps?category=Games"
      >
        {games.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </Rail>

      <section className="section" aria-labelledby="tools-title">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="tools-title">Tools</h2>
              <p>The CodeLove web tools, as Android apps.</p>
            </div>
          </div>
          <div className="tools-grid">
            {tools.map((app) => (
              <ToolCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>

      {/* What people search for, each answered in a line and linked to its app page. */}
      <section className="section hub-hide" aria-labelledby="find-title">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="find-title">Find the right CodeLove app</h2>
              <p>Every CodeLove app is a free APK, with no account and no paid version.</p>
            </div>
          </div>
          <ul className="steps">
            {FIND.filter((f) => !f.id || getAppById(f.id)).map((f) => (
              <li key={f.title} className="step">
                <h3>{f.title}</h3>
                <p>
                  {f.text}{" "}
                  <Link href={f.href} className="link-more">
                    {f.link} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section hub-hide" aria-labelledby="install-title">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 id="install-title">How to install an APK</h2>
              <p>The apps are not on Google Play, so Android asks once before installing.</p>
            </div>
          </div>
          <ol className="steps">
            <li className="step">
              <span className="step-num">1</span>
              <h3>Download</h3>
              <p>Tap Download APK on the app&apos;s page. The file goes to your Downloads folder.</p>
            </li>
            <li className="step">
              <span className="step-num">2</span>
              <h3>Allow the install</h3>
              <p>Open the file. If Android asks, allow your browser to install apps.</p>
            </li>
            <li className="step">
              <span className="step-num">3</span>
              <h3>Open the app</h3>
              <p>Tap Install, then Open. Updates install the same way, over the old version.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section" aria-label="More">
        <div className="container">
          <div className="banner hub-hide">
            <div>
              <h2>Prefer the browser?</h2>
              <p>Every game also plays free at games.codelove.in — no download needed.</p>
            </div>
            <a href="https://games.codelove.in" className="btn btn-primary btn-lg">
              Play online <ArrowRight size={17} className="btn-arrow" aria-hidden="true" />
            </a>
          </div>
          <p style={{ marginTop: 18 }}>
            <Link href="/apps" className="link-more">
              Browse all {apps.length} apps <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
