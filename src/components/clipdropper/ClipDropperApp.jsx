"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ClipboardList,
  ClipboardPaste,
  Code2,
  Copy,
  Folder,
  FolderPlus,
  Hash,
  KeyRound,
  LayoutGrid,
  Link2,
  Mail,
  Pin,
  PinOff,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Type,
  X,
} from "lucide-react";

/*
  ClipDropper — web app.

  A clipboard manager that runs in the browser (desktop) and inside the
  ClipDropper Android app (WebView). Everything is stored in localStorage on
  the device; nothing is uploaded.

  Native bridge
  ─────────────
  The Android app injects `window.CodeloveNative` with:
    copy(text)          copy to the system clipboard
    readClipboard()     returns the current clipboard text
    share(text)         open the Android share sheet
  When the bridge is missing the browser Clipboard API is used instead.

  The Android app also dispatches a `codelove:add` CustomEvent (detail =
  text) when text is shared to it, and this component saves it as a clip.
*/

const STORAGE_KEY = "clipdropper.clips.v1";
const COLLECTIONS_KEY = "clipdropper.collections.v1";
const DEFAULT_COLLECTIONS = ["Work", "Links", "Snippets", "Personal"];
const MAX_CLIPS = 500;

const TYPES = {
  link: { label: "Link", icon: Link2, color: "#0ea5e9" },
  code: { label: "Code", icon: Code2, color: "#7c6cff" },
  otp: { label: "One-time code", icon: KeyRound, color: "#f59e0b" },
  email: { label: "Email", icon: Mail, color: "#ff6b9a" },
  number: { label: "Number", icon: Hash, color: "#10b981" },
  text: { label: "Text", icon: Type, color: "#64748b" },
};

const MOBILE_QUERY = "(max-width: 900px)";
const COLLECTION_COLORS = ["#7c6cff", "#ff6b9a", "#0ea5e9", "#10b981", "#f59e0b", "#a855f7"];

const FILTERS = [
  { id: "all", label: "All clips", icon: ClipboardList },
  { id: "pinned", label: "Pinned", icon: Pin },
];

function detectType(raw) {
  const t = raw.trim();
  if (!t) return "text";
  if (/^(https?:\/\/|www\.)\S+$/i.test(t)) return "link";
  if (/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(t)) return "email";
  if (/^\d[\d\s-]{2,10}\d$/.test(t) && t.replace(/\D/g, "").length <= 8) return "otp";
  if (/^\+?[\d][\d\s().-]{5,}$/.test(t)) return "number";
  const looksLikeCode =
    /[{};]\s*$/m.test(t) ||
    /=>|<\/?[a-z][^>]*>|\b(function|const|let|var|import|export|class|def|return|SELECT|FROM)\b/.test(t) ||
    /^[$#>] /.test(t);
  if (looksLikeCode) return "code";
  return "text";
}

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function timeAgo(ts, now) {
  const diff = Math.max(0, now - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function getNative() {
  return typeof window !== "undefined" ? window.CodeloveNative : undefined;
}

async function copyText(text) {
  const native = getNative();
  if (native && typeof native.copy === "function") {
    native.copy(text);
    return true;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fall through to the legacy path (older WebViews / non-secure contexts)
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    area.remove();
  }
}

async function readClipboardText() {
  const native = getNative();
  if (native && typeof native.readClipboard === "function") return native.readClipboard() || "";
  if (navigator.clipboard && navigator.clipboard.readText) return navigator.clipboard.readText();
  throw new Error("unsupported");
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — the app keeps working in memory
  }
}

export default function ClipDropperApp({ appPageUrl = "/apps/clipdropper" }) {
  // This component is rendered client-only (see ClipDropperLoader), so it is
  // safe to read localStorage in the initial state.
  const [clips, setClips] = useState(() => loadJSON(STORAGE_KEY, []));
  const [collections, setCollections] = useState(() => loadJSON(COLLECTIONS_KEY, DEFAULT_COLLECTIONS));
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [draftCollection, setDraftCollection] = useState("");
  const [newCollection, setNewCollection] = useState("");
  const [addingCollection, setAddingCollection] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [sheet, setSheet] = useState(null); // mobile: "browse" | "compose" | null
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  const [now, setNow] = useState(() => Date.now());
  const [isNative] = useState(() => Boolean(getNative()));

  const searchRef = useRef(null);
  const draftRef = useRef(null);
  const clipsRef = useRef(clips);
  const toastTimer = useRef(null);
  const copiedTimer = useRef(null);

  useEffect(() => {
    clipsRef.current = clips;
    saveJSON(STORAGE_KEY, clips);
  }, [clips]);

  useEffect(() => {
    saveJSON(COLLECTIONS_KEY, collections);
  }, [collections]);

  // Sidebar/composer render inline on desktop and inside bottom sheets on phones
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setSheet(null);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Keep "x min ago" labels fresh
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const showToast = useCallback((message, tone = "ok") => {
    setToast({ message, tone });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const addClip = useCallback(
    (text, collection = "") => {
      const value = (text || "").replace(/\r\n/g, "\n").trim();
      if (!value) return false;
      const duplicate = clipsRef.current.some((c) => c.text === value);
      setClips((prev) => {
        const existing = prev.find((c) => c.text === value);
        if (existing) {
          // Same text again: bump it to the top instead of storing a copy
          const rest = prev.filter((c) => c.id !== existing.id);
          return [{ ...existing, createdAt: Date.now(), collection: collection || existing.collection }, ...rest];
        }
        const clip = {
          id: uid(),
          text: value,
          type: detectType(value),
          collection,
          pinned: false,
          createdAt: Date.now(),
        };
        return [clip, ...prev].slice(0, MAX_CLIPS);
      });
      showToast(duplicate ? "Already saved — moved to top" : "Clip saved");
      return true;
    },
    [showToast],
  );

  // Ctrl+V anywhere on the page (outside an input) saves the clipboard as a clip
  useEffect(() => {
    function onPaste(event) {
      const target = event.target;
      const tag = target && target.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT" || (target && target.isContentEditable)) return;
      const text = event.clipboardData && event.clipboardData.getData("text/plain");
      if (text && text.trim()) {
        event.preventDefault();
        addClip(text);
      }
    }
    function onKey(event) {
      const tag = document.activeElement && document.activeElement.tagName;
      const typing = tag === "TEXTAREA" || tag === "INPUT";
      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current && searchRef.current.focus();
      }
      if (event.key === "Escape") {
        setSheet(null);
        if (document.activeElement === searchRef.current) {
          setQuery("");
          searchRef.current.blur();
        }
      }
    }
    function onNativeAdd(event) {
      if (typeof event.detail === "string") addClip(event.detail);
    }
    document.addEventListener("paste", onPaste);
    document.addEventListener("keydown", onKey);
    window.addEventListener("codelove:add", onNativeAdd);
    return () => {
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("codelove:add", onNativeAdd);
    };
  }, [addClip]);

  async function pasteFromClipboard() {
    try {
      const text = await readClipboardText();
      if (!text || !text.trim()) {
        showToast("Clipboard is empty", "warn");
        return;
      }
      addClip(text);
    } catch {
      showToast("Press Ctrl+V anywhere to save your clipboard", "warn");
      draftRef.current && draftRef.current.focus();
    }
  }

  function submitDraft(event) {
    if (event) event.preventDefault();
    if (addClip(draft, draftCollection)) {
      setDraft("");
      setSheet(null);
    }
  }

  async function handleCopy(clip) {
    const ok = await copyText(clip.text);
    if (ok) {
      setCopiedId(clip.id);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopiedId(null), 1400);
      showToast("Copied to clipboard");
    } else {
      showToast("Could not copy — select the text manually", "warn");
    }
  }

  function togglePin(id) {
    setClips((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  }

  function removeClip(id) {
    setClips((prev) => prev.filter((c) => c.id !== id));
    showToast("Clip deleted");
  }

  function moveClip(id, collection) {
    setClips((prev) => prev.map((c) => (c.id === id ? { ...c, collection } : c)));
  }

  function toggleExpanded(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearAll() {
    if (!clips.length) return;
    if (window.confirm("Delete all clips? Pinned clips will be kept.")) {
      setClips((prev) => prev.filter((c) => c.pinned));
      showToast("Cleared");
    }
  }

  function createCollection(event) {
    event.preventDefault();
    const name = newCollection.trim();
    if (!name) return;
    if (!collections.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setCollections((prev) => [...prev, name]);
    }
    setNewCollection("");
    setAddingCollection(false);
    setFilter(`col:${name}`);
  }

  function removeCollection(name) {
    if (!window.confirm(`Remove collection "${name}"? Clips inside it are kept.`)) return;
    setCollections((prev) => prev.filter((c) => c !== name));
    setClips((prev) => prev.map((c) => (c.collection === name ? { ...c, collection: "" } : c)));
    if (filter === `col:${name}`) setFilter("all");
  }

  // Counts for the sidebar
  const counts = useMemo(() => {
    const out = { all: clips.length, pinned: 0, type: {}, col: {} };
    for (const c of clips) {
      if (c.pinned) out.pinned += 1;
      out.type[c.type] = (out.type[c.type] || 0) + 1;
      if (c.collection) out.col[c.collection] = (out.col[c.collection] || 0) + 1;
    }
    return out;
  }, [clips]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clips.filter((c) => {
      if (filter === "pinned" && !c.pinned) return false;
      if (filter.startsWith("type:") && c.type !== filter.slice(5)) return false;
      if (filter.startsWith("col:") && c.collection !== filter.slice(4)) return false;
      if (q && !c.text.toLowerCase().includes(q) && !(c.collection || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [clips, filter, query]);

  const pinnedVisible = visible.filter((c) => c.pinned);
  const otherVisible = visible.filter((c) => !c.pinned);

  const filterLabel = (() => {
    if (filter === "all") return "All clips";
    if (filter === "pinned") return "Pinned";
    if (filter.startsWith("type:")) return TYPES[filter.slice(5)].label;
    if (filter.startsWith("col:")) return filter.slice(4);
    return "Clips";
  })();

  const draftType = detectType(draft);
  const draftLines = draft.split("\n").length;

  const todayStart = new Date(now).setHours(0, 0, 0, 0);
  const todayCount = clips.filter((c) => c.createdAt >= todayStart).length;

  function pickFilter(id) {
    setFilter(id);
    setSheet(null);
  }

  function openCompose() {
    setSheet("compose");
    setTimeout(() => draftRef.current && draftRef.current.focus(), 50);
  }

  const sidebar = (
    <>
      <div className="cd-stats" aria-label="Overview">
        <div className="cd-stat">
          <strong>{clips.length}</strong>
          <span>Clips</span>
        </div>
        <div className="cd-stat">
          <strong>{counts.pinned}</strong>
          <span>Pinned</span>
        </div>
        <div className="cd-stat">
          <strong>{todayCount}</strong>
          <span>Today</span>
        </div>
      </div>

      <nav className="cd-nav" aria-label="Views">
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={`cd-nav-item ${filter === id ? "is-active" : ""}`} onClick={() => pickFilter(id)}>
            <span className="cd-nav-ico">
              <Icon size={15} aria-hidden="true" />
            </span>
            <span>{label}</span>
            <em>{id === "all" ? counts.all : counts.pinned}</em>
          </button>
        ))}
      </nav>

      <div className="cd-side-title">Types</div>
      <nav className="cd-nav" aria-label="Types">
        {Object.entries(TYPES).map(([id, t]) => {
          const Icon = t.icon;
          return (
            <button
              key={id}
              type="button"
              className={`cd-nav-item ${filter === `type:${id}` ? "is-active" : ""}`}
              onClick={() => pickFilter(`type:${id}`)}
              style={{ "--dot": t.color }}
            >
              <span className="cd-nav-ico">
                <Icon size={15} aria-hidden="true" />
              </span>
              <span>{t.label}</span>
              <em>{counts.type[id] || 0}</em>
            </button>
          );
        })}
      </nav>

      <div className="cd-side-title">
        Collections
        <button type="button" className="cd-icon-btn" onClick={() => setAddingCollection((v) => !v)} aria-label="New collection" title="New collection">
          <FolderPlus size={15} />
        </button>
      </div>
      {addingCollection && (
        <form className="cd-new-col" onSubmit={createCollection}>
          <input
            autoFocus
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
            placeholder="Collection name"
            aria-label="Collection name"
            maxLength={24}
          />
          <button type="submit" className="cd-icon-btn" aria-label="Add">
            <Plus size={15} />
          </button>
        </form>
      )}
      <nav className="cd-nav" aria-label="Collections">
        {collections.map((name, i) => (
          <div key={name} className={`cd-nav-item cd-nav-col ${filter === `col:${name}` ? "is-active" : ""}`} style={{ "--dot": COLLECTION_COLORS[i % COLLECTION_COLORS.length] }}>
            <button type="button" onClick={() => pickFilter(`col:${name}`)}>
              <span className="cd-nav-ico cd-nav-ico--folder">
                <Folder size={15} aria-hidden="true" />
              </span>
              <span>{name}</span>
              <em>{counts.col[name] || 0}</em>
            </button>
            <button type="button" className="cd-col-remove" onClick={() => removeCollection(name)} aria-label={`Remove collection ${name}`}>
              <X size={13} />
            </button>
          </div>
        ))}
      </nav>

      <div className="cd-side-note">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>Clips are stored only on this device. Nothing is uploaded.</span>
      </div>
    </>
  );

  const composer = (
    <form className={`cd-composer ${draft ? "has-text" : ""}`} onSubmit={submitDraft}>
      <div className="cd-composer-glow" aria-hidden="true" />
      <textarea
        ref={draftRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submitDraft(e);
        }}
        placeholder="Paste or type anything to keep it — links, codes, notes, addresses…"
        rows={draftLines > 2 ? Math.min(10, draftLines + 1) : 2}
        aria-label="New clip"
      />
      <div className="cd-composer-bar">
        <span className="cd-type-chip" style={{ "--dot": TYPES[draftType].color }}>
          <Sparkles size={13} aria-hidden="true" />
          {draft ? TYPES[draftType].label : "Auto-detects type"}
        </span>
        <select value={draftCollection} onChange={(e) => setDraftCollection(e.target.value)} aria-label="Collection" className="cd-select">
          <option value="">No collection</option>
          {collections.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {draft && <span className="cd-count">{draft.length} chars</span>}
        <span className="cd-hint">
          <kbd>Ctrl</kbd>
          <kbd>↵</kbd>
        </span>
        <button type="submit" className="cd-btn cd-btn-primary" disabled={!draft.trim()}>
          <Plus size={16} aria-hidden="true" />
          Save clip
        </button>
      </div>
    </form>
  );

  const renderCard = (clip) => (
    <ClipCard
      key={clip.id}
      clip={clip}
      now={now}
      copied={copiedId === clip.id}
      expanded={expanded.has(clip.id)}
      collections={collections}
      onCopy={() => handleCopy(clip)}
      onPin={() => togglePin(clip.id)}
      onDelete={() => removeClip(clip.id)}
      onMove={(c) => moveClip(clip.id, c)}
      onToggle={() => toggleExpanded(clip.id)}
    />
  );

  return (
    <div className={`cd ${isNative ? "cd--native" : ""} ${sheet ? "has-sheet" : ""}`}>
      <div className="cd-ambient" aria-hidden="true">
        <div className="cd-blob cd-blob-1" />
        <div className="cd-blob cd-blob-2" />
        <div className="cd-grid-bg" />
      </div>

      {/* Top bar --------------------------------------------------------- */}
      <header className="cd-top">
        <div className="cd-brand">
          <span className="cd-mark" aria-hidden="true">
            <ClipboardList size={20} />
          </span>
          <div>
            <strong>ClipDropper</strong>
            <small>by Codelove</small>
          </div>
        </div>

        <label className="cd-search">
          <Search size={17} aria-hidden="true" />
          <input ref={searchRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search clips…" aria-label="Search clips" />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={15} />
            </button>
          ) : (
            <kbd aria-hidden="true">/</kbd>
          )}
        </label>

        <div className="cd-top-actions">
          <button type="button" className="cd-btn cd-btn-primary" onClick={pasteFromClipboard}>
            <ClipboardPaste size={17} aria-hidden="true" />
            <span>Paste clipboard</span>
          </button>
          {!isNative && (
            <a href={appPageUrl} className="cd-btn cd-btn-ghost cd-only-desktop" title="Get the Android app">
              <Smartphone size={17} aria-hidden="true" />
              <span>Android app</span>
            </a>
          )}
        </div>
      </header>

      <div className="cd-body">
        {/* Sidebar (desktop) ------------------------------------------- */}
        {!isMobile && (
          <aside className="cd-side" aria-label="Filters">
            {sidebar}
          </aside>
        )}

        {/* Main ---------------------------------------------------------- */}
        <section className="cd-main">
          {!isMobile && <div className="cd-composer-wrap">{composer}</div>}

          {/* Mobile quick filters */}
          <div className="cd-chips cd-only-mobile" role="tablist" aria-label="Quick filters">
            {FILTERS.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" role="tab" aria-selected={filter === id} className={`cd-chip ${filter === id ? "is-active" : ""}`} onClick={() => setFilter(id)}>
                <Icon size={14} aria-hidden="true" />
                {label}
              </button>
            ))}
            {collections.map((name, i) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={filter === `col:${name}`}
                className={`cd-chip ${filter === `col:${name}` ? "is-active" : ""}`}
                onClick={() => setFilter(`col:${name}`)}
                style={{ "--dot": COLLECTION_COLORS[i % COLLECTION_COLORS.length] }}
              >
                <span className="cd-chip-dot" aria-hidden="true" />
                {name}
              </button>
            ))}
          </div>

          <div className="cd-list-head">
            <div>
              <h1>{filterLabel}</h1>
              <p>
                {visible.length} {visible.length === 1 ? "clip" : "clips"}
                {query ? ` matching “${query}”` : ""}
              </p>
            </div>
            {clips.length > 0 && filter === "all" && !query && (
              <button type="button" className="cd-btn cd-btn-ghost cd-btn-sm" onClick={clearAll}>
                <Trash2 size={15} aria-hidden="true" />
                Clear all
              </button>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="cd-empty">
              <div className="cd-empty-art" aria-hidden="true">
                <div className="cd-ghost cd-ghost-1">
                  <span style={{ "--dot": TYPES.link.color }}>
                    <Link2 size={12} />
                  </span>
                  <i style={{ width: "62%" }} />
                </div>
                <div className="cd-ghost cd-ghost-2">
                  <span style={{ "--dot": TYPES.otp.color }}>
                    <KeyRound size={12} />
                  </span>
                  <i style={{ width: "38%" }} />
                </div>
                <div className="cd-ghost cd-ghost-3">
                  <span style={{ "--dot": TYPES.code.color }}>
                    <Code2 size={12} />
                  </span>
                  <i style={{ width: "74%" }} />
                </div>
              </div>
              <h2>{clips.length === 0 ? "Your clipboard, remembered" : "No clips here"}</h2>
              <p>
                {clips.length > 0
                  ? "Try a different filter or search term."
                  : isNative
                    ? "Copy anything in any app, then come back and tap Paste — or share text straight to ClipDropper."
                    : "Copy something, then press Ctrl + V anywhere on this page — or use the Paste clipboard button."}
              </p>
              {clips.length === 0 && (
                <>
                  <ol className="cd-steps">
                    <li>
                      <span>1</span>Copy
                    </li>
                    <li>
                      <span>2</span>Paste here
                    </li>
                    <li>
                      <span>3</span>Find it later
                    </li>
                  </ol>
                  <button type="button" className="cd-btn cd-btn-primary" onClick={pasteFromClipboard}>
                    <ClipboardPaste size={17} aria-hidden="true" />
                    Paste clipboard
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {pinnedVisible.length > 0 && filter !== "pinned" && (
                <>
                  <div className="cd-group-title">
                    <Pin size={14} aria-hidden="true" /> Pinned
                  </div>
                  <div className="cd-grid">{pinnedVisible.map(renderCard)}</div>
                  {otherVisible.length > 0 && <div className="cd-group-title">Recent</div>}
                </>
              )}
              <div className="cd-grid">{(filter === "pinned" ? pinnedVisible : otherVisible).map(renderCard)}</div>
            </>
          )}
        </section>
      </div>

      {/* Mobile: bottom sheets + navigation --------------------------- */}
      <div className={`cd-backdrop ${sheet ? "is-open" : ""}`} onClick={() => setSheet(null)} aria-hidden="true" />

      <div className={`cd-sheet ${sheet === "browse" ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Browse">
        <div className="cd-sheet-handle" aria-hidden="true" />
        <div className="cd-sheet-head">
          <h2>Browse</h2>
          <button type="button" className="cd-icon-btn" onClick={() => setSheet(null)} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="cd-sheet-body">{isMobile && sidebar}</div>
      </div>

      <div className={`cd-sheet ${sheet === "compose" ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="New clip">
        <div className="cd-sheet-handle" aria-hidden="true" />
        <div className="cd-sheet-head">
          <h2>New clip</h2>
          <button type="button" className="cd-icon-btn" onClick={() => setSheet(null)} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="cd-sheet-body">{isMobile && composer}</div>
      </div>

      <nav className="cd-bottom" aria-label="Main">
        <button type="button" className={`cd-bottom-item ${filter === "all" && !sheet ? "is-active" : ""}`} onClick={() => pickFilter("all")}>
          <ClipboardList size={21} aria-hidden="true" />
          <span>Clips</span>
        </button>
        <button type="button" className={`cd-bottom-item ${filter === "pinned" && !sheet ? "is-active" : ""}`} onClick={() => pickFilter("pinned")}>
          <Pin size={21} aria-hidden="true" />
          <span>Pinned</span>
        </button>
        <button type="button" className="cd-fab" onClick={openCompose} aria-label="New clip">
          <Plus size={26} aria-hidden="true" />
        </button>
        <button type="button" className={`cd-bottom-item ${sheet === "browse" ? "is-active" : ""}`} onClick={() => setSheet(sheet === "browse" ? null : "browse")}>
          <LayoutGrid size={21} aria-hidden="true" />
          <span>Browse</span>
        </button>
        <button type="button" className="cd-bottom-item" onClick={pasteFromClipboard}>
          <ClipboardPaste size={21} aria-hidden="true" />
          <span>Paste</span>
        </button>
      </nav>

      <div className={`cd-toast ${toast ? "is-visible" : ""} ${toast ? `cd-toast--${toast.tone}` : ""}`} role="status" aria-live="polite">
        {toast && (
          <>
            {toast.tone === "ok" ? <Check size={15} aria-hidden="true" /> : <Sparkles size={15} aria-hidden="true" />}
            {toast.message}
          </>
        )}
      </div>
    </div>
  );
}

function ClipCard({ clip, now, copied, expanded, collections, onCopy, onPin, onDelete, onMove, onToggle }) {
  const type = TYPES[clip.type] || TYPES.text;
  const Icon = type.icon;
  const isLong = clip.text.length > 180 || clip.text.split("\n").length > 3;
  const href = clip.type === "link" ? (clip.text.startsWith("http") ? clip.text : `https://${clip.text}`) : null;
  const domain = href ? href.replace(/^https?:\/\//, "").split(/[/?#]/)[0] : null;

  return (
    <article className={`cd-card ${clip.pinned ? "is-pinned" : ""} ${expanded ? "is-expanded" : ""} cd-card--${clip.type}`} style={{ "--dot": type.color }}>
      <div className="cd-card-head">
        <span className="cd-card-ico" aria-hidden="true">
          <Icon size={16} />
        </span>
        <div className="cd-card-meta">
          <span className="cd-card-type">{type.label}</span>
          <span className="cd-card-time">
            {domain ? `${domain} · ` : ""}
            {timeAgo(clip.createdAt, now)}
          </span>
        </div>
        {clip.pinned && (
          <span className="cd-card-pin" title="Pinned">
            <Pin size={12} aria-hidden="true" />
          </span>
        )}
      </div>

      <button type="button" className={`cd-card-text ${clip.type === "code" ? "is-code" : ""} ${clip.type === "otp" ? "is-otp" : ""}`} onClick={onCopy} title="Click to copy">
        {clip.text}
      </button>

      {isLong && (
        <button type="button" className="cd-card-more" onClick={onToggle}>
          {expanded ? "Show less" : "Show more"}
        </button>
      )}

      <div className="cd-card-foot">
        <select className="cd-card-col" value={clip.collection || ""} onChange={(e) => onMove(e.target.value)} aria-label="Move to collection">
          <option value="">No collection</option>
          {collections.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="cd-card-actions">
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="cd-icon-btn" aria-label="Open link" title="Open link">
              <ArrowUpRight size={16} />
            </a>
          )}
          <button type="button" className={`cd-icon-btn ${clip.pinned ? "is-on" : ""}`} onClick={onPin} aria-label={clip.pinned ? "Unpin" : "Pin"} title={clip.pinned ? "Unpin" : "Pin"}>
            {clip.pinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
          <button type="button" className="cd-icon-btn cd-icon-danger" onClick={onDelete} aria-label="Delete" title="Delete">
            <Trash2 size={16} />
          </button>
          <button type="button" className={`cd-copy ${copied ? "is-copied" : ""}`} onClick={onCopy} aria-label="Copy">
            {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
