// Global site configuration. Edit this file to change branding, links and SEO text.

export const site = {
  name: "Codelove Apps",
  shortName: "Codelove",
  url: "https://apps.codelove.in",
  developer: "Gowtham",
  developerTitle: "Developer & Creator",
  parentSite: "codelove.in",
  parentSiteUrl: "https://codelove.in",
  tagline: "Discover useful mobile apps crafted by Gowtham.",
  title: "Codelove Apps — Useful Mobile Apps by Gowtham",
  description:
    "Discover useful and thoughtfully crafted mobile apps by Gowtham. Explore productivity, utility, media and creative apps from Codelove.",
  year: 2026,
  // Where the "Contact" link in the header points (a mailto: link also works).
  contactUrl: "https://codelove.in",
  // Social links. Leave a URL empty ("") to hide that icon in the footer.
  social: {
    website: "https://codelove.in",
    github: "",
  },
};

/*
  Header navigation.
  - menu: "categories" renders a dropdown listing every category from categories.js
  - external: true opens the link in a new tab
*/
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Apps", href: "/apps" },
  { label: "Categories", href: "/apps", menu: "categories" },
  { label: "Latest", href: "/#latest" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "https://codelove.in", external: true },
];

export const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Apps", href: "/apps" },
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
