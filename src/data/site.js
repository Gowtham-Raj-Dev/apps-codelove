// Global site configuration: branding, links and SEO text.

export const site = {
  name: "CodeLove Apps",
  shortName: "CodeLove",
  url: "https://apps.codelove.in",
  developer: "Gowtham",
  developerTitle: "Developer, CodeLove",
  parentSite: "codelove.in",
  parentSiteUrl: "https://codelove.in",
  tagline: "Free Android games and tools by CodeLove.",
  title: "CodeLove Apps — Free Android Games and Tools (APK)",
  description:
    "Free Android apps by CodeLove: full-screen 3D games, plus a video cutter, video to GIF, Insta downloader, link in bio and the JavaPlay Java game emulator.",
  year: 2026,
  contactUrl: "https://codelove.in",
  social: {
    website: "https://codelove.in",
    github: "",
  },
};

// Schema.org "@id"s shared by every CodeLove site, so search engines see one publisher and one creator.
export const ORG_ID = "https://codelove.in/#organization";
export const PERSON_ID = "https://gowtham.codelove.in/#person";
export const WEBSITE_ID = "https://apps.codelove.in/#website";

// Header navigation
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/apps?category=Games" },
  { label: "All apps", href: "/apps" },
  { label: "About", href: "/about" },
];

export const footerLinks = [
  { label: "All apps", href: "/apps" },
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

// The other CodeLove sites (same labels on every site in the network)
export const networkLinks = [
  { label: "CodeLove", href: "https://codelove.in" },
  { label: "Free 3D Models", href: "https://models.codelove.in" },
  { label: "Free 3D Games", href: "https://games.codelove.in" },
  { label: "Insta Downloader", href: "https://downloader.codelove.in" },
  { label: "Link in Bio", href: "https://linkinbio.codelove.in" },
  { label: "Video to GIF", href: "https://videotogif.codelove.in" },
  { label: "Video to Images", href: "https://videotoimages.codelove.in" },
  { label: "Free YouTube Automation", href: "https://utubeflow.codelove.in" },
  { label: "Free Java Games", href: "https://javaplay.codelove.in" },
];
