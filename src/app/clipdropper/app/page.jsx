import ClipDropperLoader from "@/components/clipdropper/ClipDropperLoader";
import { site } from "@/data/site";

import "@/styles/clipdropper.css";

/*
  ClipDropper web app — https://apps.codelove.in/clipdropper/app

  Standalone screen (no site header/footer, see components/SiteChrome.jsx).
  This is the URL the ClipDropper Android app loads inside its WebView, and
  it also works as a desktop clipboard manager in any browser.
*/

const title = "ClipDropper — Clipboard manager";
const description =
  "Save, search, pin and organise everything you copy. ClipDropper runs in your browser and inside the Android app — clips stay on your device.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/clipdropper/app" },
  openGraph: {
    title,
    description,
    url: `${site.url}/clipdropper/app`,
    type: "website",
  },
  twitter: { title, description },
};

export const viewport = {
  themeColor: "#fafafc",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function ClipDropperAppPage() {
  return <ClipDropperLoader appPageUrl="/apps/clipdropper" />;
}
