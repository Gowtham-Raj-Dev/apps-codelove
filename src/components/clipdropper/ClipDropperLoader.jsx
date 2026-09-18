"use client";

import dynamic from "next/dynamic";
import { ClipboardList } from "lucide-react";

/*
  Loads the ClipDropper app on the client only. The app reads localStorage in
  its initial state, so it must not be server-rendered (avoids a hydration
  mismatch and the flash of an empty list).
*/
const ClipDropperApp = dynamic(() => import("./ClipDropperApp"), {
  ssr: false,
  loading: () => (
    <div className="cd-loading" role="status" aria-label="Loading ClipDropper">
      <span className="cd-mark" aria-hidden="true">
        <ClipboardList size={22} />
      </span>
      <span>Opening ClipDropper…</span>
    </div>
  ),
});

export default function ClipDropperLoader(props) {
  return <ClipDropperApp {...props} />;
}
