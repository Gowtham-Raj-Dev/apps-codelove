/* Re-mounts on every navigation so each page gets a soft fade-in transition. */
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
