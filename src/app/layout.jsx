import { Inter, Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import { site } from "@/data/site";

import "@/styles/globals.css";
import "@/styles/components.css";
import "@/styles/sections.css";
import "@/styles/pages.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport = {
  themeColor: "#fafafc",
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
  keywords: ["Codelove", "Codelove Apps", "Gowtham", "Android apps", "APK download", "mobile apps", "productivity apps"],
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Adds a "js" class before paint so scroll-reveal content can start hidden safely.
            suppressHydrationWarning: this class is intentionally not rendered by React. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className={`${inter.variable} ${manrope.variable}`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* SiteChrome hides the header/footer on standalone app routes (e.g. /clipdropper/app) */}
        <SiteChrome navbar={<Navbar />} footer={<Footer />}>
          {children}
        </SiteChrome>
        {/* Reveal everything already inside the first viewport before React loads (see components/Reveal.jsx) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var h=window.innerHeight||800;document.querySelectorAll('.reveal').forEach(function(el){if(el.getBoundingClientRect().top<h*1.15){el.classList.add('is-visible','is-early')}})})()",
          }}
        />
      </body>
    </html>
  );
}
