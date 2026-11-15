import { Suspense } from "react";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site, PERSON_ID, ORG_ID, WEBSITE_ID } from "@/data/site";
import { assetUrl } from "@/lib/asset";

import "@/styles/app.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});


export const viewport = {
  themeColor: "#090a12",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.developer, url: site.parentSiteUrl }],
  creator: site.developer,
  keywords: ["CodeLove", "CodeLove Apps", "Gowtham", "free Android games", "APK download", "video cutter app", "video to GIF app", "Instagram downloader app", "Java game emulator"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

// Who made the site and who publishes it: the same "@id"s as every other CodeLove site.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: site.developer,
      alternateName: ["Gowthamraj", "Gowtham Raj"],
      url: "https://gowtham.codelove.in",
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "CodeLove",
      url: site.parentSiteUrl,
      founder: { "@id": PERSON_ID },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: site.name,
      alternateName: ["CodeLove Android Apps", "CodeLove APK"],
      url: `${site.url}/`,
      description: site.description,
      inLanguage: "en",
      creator: { "@id": PERSON_ID },
      publisher: { "@id": ORG_ID },
    },
  ],
};

const HUB_SCRIPT ="if(/CodeloveHub\\//.test(navigator.userAgent))document.documentElement.classList.add('in-hub')";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inside the CodeLove app (apps-hub.js): swap APK downloads for Play / Open before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: HUB_SCRIPT }} />
        {/* CodeLove Analytics (admin.codelove.in) */}
        <script defer src="https://admin.codelove.in/t.js" />
        {/* APK download counts (public/dl.js → Firestore dl/apps) */}
        <script defer src={assetUrl("/dl.js")} />
      </head>
      <body className={inter.variable}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Suspense fallback={<header className="header" />}>
          <Navbar />
        </Suspense>
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
