// Central registry of Lucide icons that can be referenced by name from data files.
// Add an icon here if you want to use it in src/data/*.js.
import {
  ClipboardList,
  Wrench,
  Film,
  NotebookPen,
  QrCode,
  ImageIcon,
  FolderOpen,
  ScanLine,
  Repeat,
  Zap,
  Feather,
  ShieldCheck,
  WifiOff,
  Layers,
  RefreshCw,
  LayoutGrid,
  Hammer,
  Heart,
  Palette,
  Sparkles,
  Smartphone,
} from "lucide-react";

export const iconMap = {
  ClipboardList,
  Wrench,
  Film,
  NotebookPen,
  QrCode,
  ImageIcon,
  FolderOpen,
  ScanLine,
  Repeat,
  Zap,
  Feather,
  ShieldCheck,
  WifiOff,
  Layers,
  RefreshCw,
  LayoutGrid,
  Hammer,
  Heart,
  Palette,
  Sparkles,
  Smartphone,
};

/* Renders a Lucide icon by name, e.g. <Icon name="Zap" size={20} />. Unknown names fall back to a phone icon. */
export function Icon({ name, ...props }) {
  const Component = iconMap[name] || Smartphone;
  return <Component {...props} />;
}
